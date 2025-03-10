/**
 * Import function triggers from their respective submodules
 */

import * as admin from "firebase-admin";
import { submitContactForm } from "./emailFunctions.js";
import {
  submitEventApplication,
  getApplicationStatus,
  getApplicationsList,
  updateApplicationStatus,
  scanQrCode
} from "./applicationFunctions.js";
import { logger } from "./utils/logger.js";

// Initialize Firebase Admin SDK
if (admin.apps.length === 0) {
  logger.info("🔥 Initializing Firebase Admin SDK");
  admin.initializeApp();
}

// Export all the functions
export {
  // Email functions
  submitContactForm,
  
  // Application functions
  submitEventApplication,
  getApplicationStatus,
  getApplicationsList,
  updateApplicationStatus,
  scanQrCode
};
