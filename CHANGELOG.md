# Changelog

All notable changes to the BodySharing website project will be documented in this file.

## [Version] - 2025-03-09
### Changed
- Deployed updated Firebase Functions with mandatory toEmail parameter
- Enhanced error handling for contact form submissions
- Improved validation for email routing

## Unreleased

### Added
- Email service integration with Resend.com for contact form submissions
  - Created reusable email service with secure API key handling
  - Implemented custom useEmailSubmission hook for React components
  - Added automatic confirmation emails to users
  - Updated contact form to use the new email service
  - Made sender and admin email addresses configurable via environment variables
- Basic integration tests for key components:
  - Tests for Navbar component
  - Tests for ContactForm component
  - Tests for all page components (Home, HowItWorks, Experience, Testimonials, Contact)
- GitHub Actions CI workflow for automated testing
  - Tests run automatically on every commit to main/master branch
  - Tests run on pull requests targeting main/master branch
  - Test results are uploaded as artifacts for easy review
- GitHub Actions workflow to automatically deploy the newest version to gh-pages whenever changes are merged into the main branch.
- Added `.env` file with build configuration settings to prevent test file inclusion in production builds
- Added separate `tsconfig.build.json` to exclude test files from the build process
- Installed Jest type definitions to resolve build warnings.
- Firebase Functions implementation for sending emails through Resend API
  - Added sendEmail function for general email sending capabilities
  - Added sendContactFormEmail function specifically for contact form submissions
- Configurable logging system with emoji support and color coding
- Environment-based logging configuration (.env files)
- Verbose logging for email service with detailed request tracking
- Debug mode logging for development environment
- Dynamic email routing based on inquiry type in contact form
  - Contact form now dynamically routes emails to department-specific addresses
  - Added proper validation for destination email address

### Changed
- Testing infrastructure improved with additional dependencies:
  - Added @testing-library/react and @testing-library/user-event
  - Added MSW for API mocking capabilities
  - Added jest-environment-jsdom for DOM testing environment
- Updated @testing-library/react from v16.2.0 to v14.0.0 to fix build issues with the `screen` export
- Modified GitHub Actions workflow to set CI=false to prevent treating warnings as errors
- Updated build script in package.json to use tsconfig.build.json
- Combined build, test, and deploy steps into a single GitHub Actions workflow
- Updated GitHub Actions workflow to run build and test stages in parallel, ensuring both pass before proceeding to the deploy stage.
- Configured Git user name and email in GitHub Actions workflow to fix deployment issue.
- Updated the 'Contact Us' link text to 'Contact' in the Navbar component.
- Added test step before deployment to GitHub Pages in GitHub Actions workflow.
- Split the GitHub Actions workflow into three distinct jobs: build, test, and deploy, and set dependencies between them.
- Added TypeScript installation step in the test and deploy phases of the GitHub Actions workflow to ensure TypeScript is available during these phases.
- Updated GitHub Actions workflow to install dependencies before running the build command in the deploy step to fix missing `react-scripts` error.
- Updated GitHub Actions workflow to install TypeScript before running the build command in the deploy step to fix missing `typescript` module error.
- Updated GitHub Actions workflow to configure Git user identity before running the deploy command to fix missing author identity error.
- Updated email service to use real cloud function URL instead of local emulator URL.
- Updated Firebase Functions to v2 syntax
- Upgraded firebase-functions package to latest version
- Migrated cloud functions to 2nd Gen (GCFv2)
- Enhanced emailService with detailed logging and error tracking
- Improved error handling with detailed error messages in logs
- Modified sendContactFormEmail function to require toEmail parameter without fallbacks
- Enhanced error logging to show specific missing fields in contact form submissions

### Fixed
- Removed unused imports in `AfterParty.tsx`, `Consent.tsx`, `Experience.tsx`, and `Home.tsx` to fix build errors.
- Fixed GitHub Actions build failure caused by TypeScript error: "Module '@testing-library/react' has no exported member 'screen'"
- Fixed GitHub Actions workflow to use Node.js 18 and sync package-lock.json
- Fixed deployment issue due to missing GitHub credentials.
- Added TypeScript installation step in the GitHub Actions workflow to fix the module not found error during tests.
- Fixed GitHub Pages deployment configuration to ensure proper authentication and branch setup.
- Fixed TypeScript errors in Firebase Functions by correcting import syntax for cors package

## [Version] - 2023-10-05
### Changed
- Rebuilt and deployed to Firebase Hosting.
