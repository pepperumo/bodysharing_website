import {onRequest} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import {Resend} from "resend";
import {RESEND_API_KEY, EMAIL_FROM} from "./config.js";
import {corsHandler} from "./middleware/cors.js";
import {logger} from "./utils/logger.js";
import {generateQRCode} from "./utils/qrcode.js";

// Initialize Firestore if it hasn't been initialized yet
if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();
const storage = admin.storage();

/**
 * Firebase Cloud Function to handle event application submissions
 */
export const submitEventApplication = onRequest((request, response) => {
  return corsHandler(request, response, async () => {
    logger.info("🚀 Starting submitEventApplication function execution");

    // Handle preflight request
    if (request.method === "OPTIONS") {
      logger.info("✨ Handling OPTIONS preflight request");
      return response.status(200).send();
    }

    try {
      // Validate request method
      if (request.method !== "POST") {
        logger.warn("❌ Method not allowed:", request.method);
        return response.status(405).json({error: "Method not allowed"});
      }

      // Extract form data
      const {
        name,
        email,
        consentAcknowledgment,
        dataRetentionAgreement,
        understandingConsent,
        attendeeType,
        partnerAlias,
        photoUrl,
      } = request.body;
      
      // Extract photo file if uploaded
      const photoFile = request.files?.photo;
      
      logger.info("📝 Received event application from:", name);
      
      // Validate required fields
      const missingFields = [];
      if (!name) missingFields.push("name");
      if (!email) missingFields.push("email");
      if (consentAcknowledgment === undefined) missingFields.push("consentAcknowledgment");
      if (dataRetentionAgreement === undefined) missingFields.push("dataRetentionAgreement");
      if (!understandingConsent) missingFields.push("understandingConsent");
      if (!attendeeType) missingFields.push("attendeeType");
      
      // Validate attendee type and partner info
      if (attendeeType === "couple" && !partnerAlias) {
        missingFields.push("partnerAlias");
      }
      
      // Validate photo - either URL or file must be provided
      if (!photoUrl && !photoFile) {
        missingFields.push("photo");
      }

      // Check if any required fields are missing
      if (missingFields.length > 0) {
        logger.error("❌ Missing required application fields:", missingFields);
        return response.status(400).json({
          error: "Missing required application fields",
          missingFields: missingFields,
        });
      }

      // Create a new application document
      const timestamp = admin.firestore.FieldValue.serverTimestamp();
      const applicationData = {
        name,
        email,
        consentAcknowledgment: Boolean(consentAcknowledgment),
        dataRetentionAgreement: Boolean(dataRetentionAgreement),
        understandingConsent,
        attendeeType,
        partnerAlias: partnerAlias || null,
        status: "pending",
        submittedAt: timestamp,
        updatedAt: timestamp,
      };
      
      // Handle photo
      let finalPhotoUrl = photoUrl;
      
      if (photoFile) {
        try {
          logger.info("📸 Processing uploaded photo");
          // For a real implementation, we would save the file to Firebase Storage
          // This is a simplified version that assumes the photo is saved elsewhere
          // and returns a mock URL
          finalPhotoUrl = `https://example.com/photos/${Date.now()}.jpg`;
          
          // In a real implementation, we would do something like:
          /*
          const bucket = storage.bucket();
          const fileBuffer = photoFile.buffer;
          const filePath = `applications/${Date.now()}_${photoFile.originalname}`;
          const fileRef = bucket.file(filePath);
          await fileRef.save(fileBuffer);
          finalPhotoUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
          */
        } catch (err) {
          logger.error("❌ Error saving photo:", err);
          return response.status(500).json({
            error: "Failed to save photo. Please try again."
          });
        }
      }
      
      // Add photo URL to application data
      applicationData.photoUrl = finalPhotoUrl;

      // Save to Firestore
      logger.info("💾 Saving application to Firestore");
      const docRef = await db.collection("applications").add(applicationData);
      const applicationId = docRef.id;
      
      // Generate tracking URL
      const baseUrl = "https://bodysharing-4b51e.web.app";
      const trackingUrl = `${baseUrl}/#/eventapplication/${applicationId}`;
      
      logger.info("✅ Application saved successfully with ID:", applicationId);

      // Initialize Resend for emails
      logger.info("🔑 Initializing Resend client");
      const resend = new Resend(RESEND_API_KEY);

      // Send confirmation email to the applicant
      logger.info("📧 Sending confirmation email to applicant");
      await resend.emails.send({
        to: email,
        from: EMAIL_FROM,
        subject: "Your BodySharing Event Application",
        html: `
          <h2>Thank You for Applying to BodySharing</h2>
          <p>Hello ${name},</p>
          <p>We have received your application for the upcoming BodySharing event. Our team will review your application and update you on its status.</p>
          <p>You can track the status of your application at any time using this link:</p>
          <p><a href="${trackingUrl}">${trackingUrl}</a></p>
          <p>Please bookmark this link for future reference.</p>
          <p>Best regards,<br>The BodySharing Team</p>
        `,
      });
      
      // Send notification email to admins
      logger.info("📧 Sending notification email to admin");
      await resend.emails.send({
        to: "admin@bodysharing.com", // Replace with actual admin email
        from: EMAIL_FROM,
        subject: `New Event Application: ${name}`,
        html: `
          <h2>New Event Application Received</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Attendee Type:</strong> ${attendeeType === "couple" ? "Couple" : "Single"}</p>
          ${partnerAlias ? `<p><strong>Partner's Name:</strong> ${partnerAlias}</p>` : ""}
          <p><strong>Consent Understanding:</strong></p>
          <p>${understandingConsent}</p>
          <p><a href="${baseUrl}/#/admin">View in Admin Dashboard</a></p>
        `,
      });

      logger.success("✅ Application process completed successfully");
      
      // Return success response with tracking info
      return response.status(200).json({
        success: true,
        message: "Application submitted successfully",
        applicationId: applicationId,
        trackingUrl: trackingUrl,
      });
      
    } catch (error) {
      logger.error("❌ Error processing application:", error);
      return response.status(500).json({
        error: "Failed to process application",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });
});

/**
 * Firebase Cloud Function to get application status
 */
export const getApplicationStatus = onRequest((request, response) => {
  return corsHandler(request, response, async () => {
    logger.info("🔍 Starting getApplicationStatus function execution");
    
    try {
      // Extract application ID from query parameters
      const {id} = request.query;
      
      if (!id || typeof id !== "string") {
        logger.error("❌ Missing or invalid application ID");
        return response.status(400).json({
          error: "Missing or invalid application ID",
        });
      }
      
      logger.info("🔍 Looking up application:", id);
      
      // Fetch application from Firestore
      const appDoc = await db.collection("applications").doc(id).get();
      
      if (!appDoc.exists) {
        logger.error("❌ Application not found:", id);
        return response.status(404).json({
          error: "Application not found",
        });
      }
      
      // Get application data
      const appData = appDoc.data();
      if (!appData) {
        logger.error("❌ Application data is empty");
        return response.status(500).json({
          error: "Application data is empty",
        });
      }
      
      // Format the timestamps
      const submittedAt = appData.submittedAt?.toDate?.() || new Date();
      const updatedAt = appData.updatedAt?.toDate?.() || new Date();
      
      // Build response object
      const responseData = {
        id: appDoc.id,
        status: appData.status,
        name: appData.name,
        email: appData.email,
        attendeeType: appData.attendeeType,
        submittedAt: submittedAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
      };
      
      // Add rejection reason if application was rejected
      if (appData.status === "rejected" && appData.rejectionReason) {
        responseData.rejectionReason = appData.rejectionReason;
      }
      
      // Add event details if application was approved
      if (appData.status === "approved") {
        // In a real implementation, this would come from an events collection
        // For now, we'll use hardcoded values
        responseData.eventDetails = {
          date: "August 15, 2024",
          time: "8:00 PM - 11:00 PM",
          location: "The Secret Garden, 123 Hidden Lane",
        };
        
        // Generate QR code for entry
        if (!appData.qrCodeUrl) {
          try {
            logger.info("🎟️ Generating QR code for application:", id);
            
            // In a real implementation, we would generate the QR code
            // and save it to Firebase Storage. For this prototype, 
            // we'll use a mock URL.
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(id)}`;
            
            // Update the application with the QR code URL
            await db.collection("applications").doc(id).update({
              qrCodeUrl: qrCodeUrl,
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            
            responseData.qrCodeUrl = qrCodeUrl;
          } catch (err) {
            logger.error("❌ Error generating QR code:", err);
            // We don't need to fail the entire request if QR generation fails
          }
        } else {
          responseData.qrCodeUrl = appData.qrCodeUrl;
        }
      }
      
      logger.success("✅ Application status retrieved successfully");
      return response.status(200).json(responseData);
      
    } catch (error) {
      logger.error("❌ Error fetching application status:", error);
      return response.status(500).json({
        error: "Failed to fetch application status",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });
});

/**
 * Firebase Cloud Function for admin to get applications list
 */
export const getApplicationsList = onRequest((request, response) => {
  return corsHandler(request, response, async () => {
    logger.info("🔍 Starting getApplicationsList function execution");
    
    // In a real implementation, we would authenticate the admin user here
    
    try {
      // Fetch applications from Firestore
      logger.info("🔍 Fetching applications from Firestore");
      const appsSnapshot = await db.collection("applications")
        .orderBy("submittedAt", "desc")
        .get();
      
      const applications = [];
      
      appsSnapshot.forEach((doc) => {
        const data = doc.data();
        const submittedAt = data.submittedAt?.toDate?.() || new Date();
        const updatedAt = data.updatedAt?.toDate?.() || new Date();
        
        applications.push({
          id: doc.id,
          name: data.name,
          email: data.email,
          status: data.status,
          attendeeType: data.attendeeType,
          partnerAlias: data.partnerAlias,
          photoUrl: data.photoUrl,
          understandingConsent: data.understandingConsent,
          submittedAt: submittedAt.toISOString(),
          updatedAt: updatedAt.toISOString(),
          rejectionReason: data.rejectionReason,
          qrCodeUrl: data.qrCodeUrl,
          checkInStatus: data.checkInStatus,
          checkInTime: data.checkInTime?.toDate?.()?.toISOString(),
        });
      });
      
      logger.success("✅ Applications list retrieved successfully:", {
        count: applications.length,
      });
      
      return response.status(200).json(applications);
      
    } catch (error) {
      logger.error("❌ Error fetching applications list:", error);
      return response.status(500).json({
        error: "Failed to fetch applications list",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });
});

/**
 * Firebase Cloud Function for admin to update application status
 */
export const updateApplicationStatus = onRequest((request, response) => {
  return corsHandler(request, response, async () => {
    logger.info("🔄 Starting updateApplicationStatus function execution");
    
    // Handle preflight request
    if (request.method === "OPTIONS") {
      logger.info("✨ Handling OPTIONS preflight request");
      return response.status(200).send();
    }
    
    // In a real implementation, we would authenticate the admin user here
    
    try {
      // Validate request method
      if (request.method !== "POST") {
        logger.warn("❌ Method not allowed:", request.method);
        return response.status(405).json({error: "Method not allowed"});
      }
      
      // Extract parameters
      const {applicationId, status, rejectionReason} = request.body;
      
      // Validate required fields
      if (!applicationId || !status) {
        logger.error("❌ Missing required fields: applicationId or status");
        return response.status(400).json({
          error: "Missing required fields",
        });
      }
      
      // Validate status value
      const validStatuses = ["pending", "reviewing", "approved", "rejected"];
      if (!validStatuses.includes(status)) {
        logger.error("❌ Invalid status:", status);
        return response.status(400).json({
          error: "Invalid status. Must be one of: " + validStatuses.join(", "),
        });
      }
      
      // Validate rejection reason if status is rejected
      if (status === "rejected" && !rejectionReason) {
        logger.error("❌ Missing rejection reason for rejected status");
        return response.status(400).json({
          error: "Rejection reason is required when status is set to rejected",
        });
      }
      
      logger.info("🔍 Fetching application:", applicationId);
      
      // Fetch application from Firestore
      const appDoc = await db.collection("applications").doc(applicationId).get();
      
      if (!appDoc.exists) {
        logger.error("❌ Application not found:", applicationId);
        return response.status(404).json({
          error: "Application not found",
        });
      }
      
      const appData = appDoc.data();
      if (!appData) {
        logger.error("❌ Application data is empty");
        return response.status(500).json({
          error: "Application data is empty",
        });
      }
      
      logger.info("🔄 Updating application status:", {
        id: applicationId,
        oldStatus: appData.status,
        newStatus: status,
      });
      
      // Prepare update data
      const updateData = {
        status: status,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      
      // Add rejection reason if status is rejected
      if (status === "rejected") {
        updateData.rejectionReason = rejectionReason;
      }
      
      // Generate QR code if status is approved
      if (status === "approved" && !appData.qrCodeUrl) {
        try {
          logger.info("🎟️ Generating QR code for approved application");
          
          // In a real implementation, we would generate the QR code
          // and save it to Firebase Storage. For this prototype, 
          // we'll use a mock URL.
          const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(applicationId)}`;
          updateData.qrCodeUrl = qrCodeUrl;
        } catch (err) {
          logger.error("❌ Error generating QR code:", err);
          // We don't need to fail the entire request if QR generation fails
        }
      }
      
      // Update application in Firestore
      await db.collection("applications").doc(applicationId).update(updateData);
      
      // Initialize Resend for emails
      logger.info("🔑 Initializing Resend client");
      const resend = new Resend(RESEND_API_KEY);
      
      // Send status update email to the applicant
      logger.info("📧 Sending status update email to applicant");
      let emailSubject = "";
      let emailHtml = "";
      
      if (status === "approved") {
        emailSubject = "Your BodySharing Application Has Been Approved!";
        emailHtml = `
          <h2>Congratulations! Your Application is Approved</h2>
          <p>Hello ${appData.name},</p>
          <p>We're pleased to inform you that your application for the upcoming BodySharing event has been approved!</p>
          <h3>Event Details</h3>
          <p><strong>Date:</strong> August 15, 2024</p>
          <p><strong>Time:</strong> 8:00 PM - 11:00 PM</p>
          <p><strong>Location:</strong> The Secret Garden, 123 Hidden Lane</p>
          <p>You can view your entry QR code and more details at: <a href="https://bodysharing-4b51e.web.app/#/eventapplication/${applicationId}">your application status page</a>.</p>
          <p>Please arrive 15 minutes early for check-in. Don't forget to bring your ID and have your QR code ready for scanning.</p>
          <p>Best regards,<br>The BodySharing Team</p>
        `;
      } else if (status === "rejected") {
        emailSubject = "Update on Your BodySharing Application";
        emailHtml = `
          <h2>Your BodySharing Application Status</h2>
          <p>Hello ${appData.name},</p>
          <p>Thank you for your interest in our BodySharing event. After careful review, we regret to inform you that your application has not been approved for the upcoming event.</p>
          <p><strong>Reason:</strong> ${rejectionReason}</p>
          <p>You may apply again after 3 months with a new application. We appreciate your understanding.</p>
          <p>Best regards,<br>The BodySharing Team</p>
        `;
      } else if (status === "reviewing") {
        emailSubject = "Your BodySharing Application is Under Review";
        emailHtml = `
          <h2>Your Application is Under Review</h2>
          <p>Hello ${appData.name},</p>
          <p>Your application for the upcoming BodySharing event is now under review by our team. We'll update you on the status soon.</p>
          <p>You can always check your application status at: <a href="https://bodysharing-4b51e.web.app/#/eventapplication/${applicationId}">your application status page</a>.</p>
          <p>Best regards,<br>The BodySharing Team</p>
        `;
      }
      
      if (emailSubject && emailHtml) {
        await resend.emails.send({
          to: appData.email,
          from: EMAIL_FROM,
          subject: emailSubject,
          html: emailHtml,
        });
      }
      
      // Get updated application data for response
      const updatedAppDoc = await db.collection("applications").doc(applicationId).get();
      const updatedAppData = updatedAppDoc.data();
      
      if (!updatedAppData) {
        logger.error("❌ Updated application data is empty");
        return response.status(500).json({
          error: "Updated application data is empty",
        });
      }
      
      // Format timestamps
      const submittedAt = updatedAppData.submittedAt?.toDate?.() || new Date();
      const updatedAt = updatedAppData.updatedAt?.toDate?.() || new Date();
      
      // Build response
      const responseData = {
        id: updatedAppDoc.id,
        name: updatedAppData.name,
        email: updatedAppData.email,
        status: updatedAppData.status,
        attendeeType: updatedAppData.attendeeType,
        partnerAlias: updatedAppData.partnerAlias,
        photoUrl: updatedAppData.photoUrl,
        understandingConsent: updatedAppData.understandingConsent,
        submittedAt: submittedAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
        rejectionReason: updatedAppData.rejectionReason,
        qrCodeUrl: updatedAppData.qrCodeUrl,
      };
      
      logger.success("✅ Application status updated successfully");
      return response.status(200).json(responseData);
      
    } catch (error) {
      logger.error("❌ Error updating application status:", error);
      return response.status(500).json({
        error: "Failed to update application status",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });
});

/**
 * Firebase Cloud Function for scanning QR codes at events
 */
export const scanQrCode = onRequest((request, response) => {
  return corsHandler(request, response, async () => {
    logger.info("🎟️ Starting scanQrCode function execution");
    
    // Handle preflight request
    if (request.method === "OPTIONS") {
      logger.info("✨ Handling OPTIONS preflight request");
      return response.status(200).send();
    }
    
    // In a real implementation, we would authenticate the admin user here
    
    try {
      // Validate request method
      if (request.method !== "POST") {
        logger.warn("❌ Method not allowed:", request.method);
        return response.status(405).json({error: "Method not allowed"});
      }
      
      // Extract QR code content
      const {qrCode} = request.body;
      
      if (!qrCode) {
        logger.error("❌ Missing QR code content");
        return response.status(400).json({
          error: "Missing QR code content",
        });
      }
      
      logger.info("🔍 Looking up application by QR code:", qrCode);
      
      // In a real implementation, the QR code would be a unique identifier
      // For this prototype, we're assuming it's the application ID
      const applicationId = qrCode;
      
      // Fetch application from Firestore
      const appDoc = await db.collection("applications").doc(applicationId).get();
      
      if (!appDoc.exists) {
        logger.error("❌ Application not found for QR code:", applicationId);
        return response.status(200).json({
          success: false,
          message: "QR code is invalid or application not found",
        });
      }
      
      const appData = appDoc.data();
      if (!appData) {
        logger.error("❌ Application data is empty");
        return response.status(200).json({
          success: false,
          message: "Application data is empty",
        });
      }
      
      // Check if application is approved
      if (appData.status !== "approved") {
        logger.warn("⚠️ Attempted check-in with non-approved application:", {
          id: applicationId,
          status: appData.status,
        });
        
        return response.status(200).json({
          success: false,
          message: `This application has not been approved. Current status: ${appData.status}`,
        });
      }
      
      // Check if already checked in
      if (appData.checkInStatus === "checked_in" && appData.checkInTime) {
        const checkInTime = appData.checkInTime.toDate();
        const formattedTime = checkInTime.toLocaleTimeString();
        
        logger.warn("⚠️ Attempted duplicate check-in:", {
          id: applicationId,
          previousCheckIn: formattedTime,
        });
        
        return response.status(200).json({
          success: false,
          message: `This attendee has already checked in at ${formattedTime}`,
        });
      }
      
      // Update check-in status
      logger.info("✅ Processing check-in for application:", applicationId);
      
      await db.collection("applications").doc(applicationId).update({
        checkInStatus: "checked_in",
        checkInTime: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      
      logger.success("✅ Check-in successful for application:", applicationId);
      
      // Return success
      return response.status(200).json({
        success: true,
        message: "Check-in successful",
        applicationId: applicationId,
        name: appData.name,
        email: appData.email,
        attendeeType: appData.attendeeType,
      });
      
    } catch (error) {
      logger.error("❌ Error processing QR code scan:", error);
      return response.status(500).json({
        success: false,
        message: "Failed to process QR code scan",
      });
    }
  });
});