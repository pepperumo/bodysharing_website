import {onRequest} from "firebase-functions/v2/https";
import {Resend} from "resend";
import {RESEND_API_KEY, EMAIL_FROM, EMAIL_ADMIN} from "./config.js";
import {corsHandler} from "./middleware/cors.js";
import {logger} from "./utils/logger.js";

interface EmailPayload {
  to: string;
  from: string;
  subject: string;
  html: string;
}

export const sendEmail = onRequest((request, response) => {
  return corsHandler(request, response, async () => {
    logger.info("🚀 Starting sendEmail function execution");
    logger.debug("Request headers:", request.headers);

    try {
      // Validate request method
      if (request.method !== "POST") {
        logger.warn("❌ Method not allowed:", request.method);
        return response.status(405).json({error: "Method not allowed"});
      }

      // Extract the payload from the request body
      const {to, from, subject, html} = request.body as EmailPayload;
      logger.info("📧 Received email request:", {to, from, subject});

      // Validate the required fields
      if (!to || !from || !subject || !html) {
        logger.error("❌ Missing required fields");
        logger.debug("Received payload:", {to, from, subject, html});
        return response.status(400).json({
          error: "Missing required fields: to, from, subject, html",
        });
      }

      // Initialize Resend with API key
      logger.info("🔑 Initializing Resend client");
      const resend = new Resend(RESEND_API_KEY);

      // Send the email
      logger.info("📤 Sending email...");
      const result = await resend.emails.send({
        from,
        to,
        subject,
        html,
      });

      logger.success("✅ Email sent successfully:", result);
      return response.status(200).json(result);
    } catch (error) {
      logger.error("❌ Error sending email:", error);
      return response.status(500).json({
        error: "Failed to send email",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });
});

export const sendContactFormEmail = onRequest((request, response) => {
  return corsHandler(request, response, async () => {
    logger.info("🚀 Starting sendContactFormEmail function execution");
    logger.debug("Request headers:", request.headers);

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

      const {name, email, inquiryType, message, consent} = request.body;
      logger.info("📝 Received contact form submission from:", name);
      logger.debug("Form data:", {email, inquiryType, message, consent});

      // Validate the required fields
      if (!name || !email || !inquiryType || !message ||
          consent === undefined) {
        logger.error("❌ Missing required form fields");
        logger.debug("Received payload:", {name, email, inquiryType, message, consent});
        return response.status(400).json({
          error: "Missing required form fields",
        });
      }

      // Initialize Resend with API key
      logger.info("🔑 Initializing Resend client");
      const resend = new Resend(RESEND_API_KEY);
      const fromEmail = EMAIL_FROM;
      const adminEmail = EMAIL_ADMIN;

      const inquiryTypeMap: Record<string, string> = {
        "membership": "Membership Application",
        "event": "Event Information",
        "safety": "Safety or Concern",
        "other": "Other Inquiry",
      };

      const inquiryTypeText = inquiryTypeMap[inquiryType] || inquiryType;
      logger.info("📧 Preparing admin notification email");

      // Email to the site admin with the form contents
      logger.info("📤 Sending admin notification email...");
      await resend.emails.send({
        to: adminEmail,
        from: fromEmail,
        subject: `New Contact Form: ${inquiryTypeText}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Inquiry Type:</strong> ${inquiryTypeText}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
          <p><strong>Consent Given:</strong> ${consent ? "Yes" : "No"}</p>
          <hr>
          <p><small>This message was sent via the BodySharing contact form.</small></p>
        `,
      });
      logger.success("✅ Admin notification email sent successfully");

      // Confirmation email to the user
      logger.info("📧 Preparing user confirmation email");
      const userResult = await resend.emails.send({
        to: email,
        from: fromEmail,
        subject: "Thank you for contacting BodySharing",
        html: `
          <h2>Thank You for Contacting BodySharing</h2>
          <p>Hello ${name},</p>
          <p>We have received your inquiry about "${inquiryTypeText}" and will get back to you shortly.</p>
          <p>For your records, here is a copy of your message:</p>
          <blockquote>${message.replace(/\n/g, "<br>")}</blockquote>
          <p>Best regards,<br>The BodySharing Team</p>
        `,
      });
      logger.success("✅ User confirmation email sent successfully");

      logger.info("🎉 Contact form submission processed successfully");
      return response.status(200).json({
        success: true,
        message: "Emails sent successfully",
        id: userResult.data?.id,
      });
    } catch (error) {
      logger.error("❌ Error processing contact form:", error);
      return response.status(500).json({
        error: "Failed to send contact form email",
        details: error instanceof Error ?
          error.message : "Unknown error",
      });
    }
  });
});
