/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from "firebase-functions";
import corsLib from "cors";
import {Resend} from "resend";

const corsHandler = corsLib({origin: true});

interface EmailPayload {
  to: string;
  from: string;
  subject: string;
  html: string;
}

export const sendEmail = functions.https.onRequest((request, response) => {
  return corsHandler(request, response, async () => {
    try {
      // Validate request method
      if (request.method !== "POST") {
        return response.status(405).json({error: "Method not allowed"});
      }

      // Extract the payload from the request body
      const {to, from, subject, html} = request.body as EmailPayload;

      // Validate the required fields
      if (!to || !from || !subject || !html) {
        return response.status(400).json({
          error: "Missing required fields: to, from, subject, html",
        });
      }

      // Initialize Resend with API key
      const resend = new Resend(functions.config().resend.api_key);

      // Send the email
      const result = await resend.emails.send({
        from,
        to,
        subject,
        html,
      });

      return response.status(200).json(result);
    } catch (error) {
      console.error("Error sending email:", error);
      return response.status(500).json({
        error: "Failed to send email",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });
});

export const sendContactFormEmail = functions.https.onRequest(
  (request, response) => {
    return corsHandler(request, response, async () => {
      try {
        // Validate request method
        if (request.method !== "POST") {
          return response.status(405).json({error: "Method not allowed"});
        }

        const {name, email, inquiryType, message, consent} = request.body;

        // Validate the required fields
        if (!name || !email || !inquiryType || !message || 
            consent === undefined) {
          return response.status(400).json({
            error: "Missing required form fields",
          });
        }

        // Initialize Resend with API key
        const resend = new Resend(functions.config().resend.api_key);
        const fromEmail = 
          functions.config().email.from || "contact@bodysharing.com";
        const adminEmail = 
          functions.config().email.admin || "admin@bodysharing.com";

        const inquiryTypeMap: Record<string, string> = {
          "membership": "Membership Application",
          "event": "Event Information",
          "safety": "Safety or Concern",
          "other": "Other Inquiry",
        };

        const inquiryTypeText = inquiryTypeMap[inquiryType] || inquiryType;
        
        // Email to the site admin with the form contents
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
            <p><small>This message was sent via the BodySharing contact
            form.</small></p>
          `,
        });
        
        // Confirmation email to the user
        const userResult = await resend.emails.send({
          to: email,
          from: fromEmail,
          subject: "Thank you for contacting BodySharing",
          html: `
            <h2>Thank You for Contacting BodySharing</h2>
            <p>Hello ${name},</p>
            <p>We have received your inquiry about
            "${inquiryTypeText}" and will get back to you shortly.</p>
            <p>For your records, here is a copy of your message:</p>
            <blockquote>${message.replace(/\n/g, "<br>")}</blockquote>
            <p>Best regards,<br>The BodySharing Team</p>
          `,
        });

        return response.status(200).json({
          success: true,
          message: "Emails sent successfully",
          id: userResult.data?.id,
        });
      } catch (error) {
        console.error("Error sending contact form email:", error);
        return response.status(500).json({
          error: "Failed to send contact form email",
          details: error instanceof Error ? 
            error.message : "Unknown error",
        });
      }
    });
  },
);
