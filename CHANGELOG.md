# Changelog

All notable changes to the BodySharing website project will be documented in this file.

## Unreleased

### Added
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

### Fixed
- Removed unused imports in `AfterParty.tsx`, `Consent.tsx`, `Experience.tsx`, and `Home.tsx` to fix build errors.
- Fixed GitHub Actions build failure caused by TypeScript error: "Module '@testing-library/react' has no exported member 'screen'"
- Fixed GitHub Actions workflow to use Node.js 18 and sync package-lock.json
- Fixed deployment issue due to missing GitHub credentials.
