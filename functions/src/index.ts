/**
 * Import function triggers from their respective submodules
 */

import {logger} from "./utils/logger.js";
import {sendEmail, sendContactFormEmail} from "./emailFunctions.js";

logger.info("🚀 Initializing Cloud Functions");

export {
  sendEmail,
  sendContactFormEmail,
};
