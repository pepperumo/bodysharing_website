# GitHub Copilot Instructions

## Changelog Management
- Whenever a significant change is made to the codebase (new feature, bug fix, refactor, dependency update), update the `CHANGELOG.md` file.
- Follow this format for changelog entries:
  
  ```md
  ## [Version] - YYYY-MM-DD
  ### Added
  - Brief description of new features.
  
  ### Changed
  - List of modifications or improvements.
  
  ### Fixed
  - Description of bug fixes.
  ```
- If no versioning system is in place, add changes under the latest `## Unreleased` section.
- Ensure changelog updates are part of commits when making relevant changes.

## React & TypeScript Best Practices

### Project Structure
- Use feature-based folder structure (e.g., `components`, `hooks`, `contexts`, `services`, `utils`).
- Keep all TypeScript types and interfaces in a dedicated `types/` directory or co-locate them with related components.

### TypeScript Conventions
- Use `React.FC<Props>` for functional components and define props explicitly.
- Prefer `useState<Type>` over implicit state typing.
- Avoid `any`; use specific types or `unknown` when necessary.
- Always type API responses with interfaces or TypeScript types.

### React Development Guidelines
- Use hooks instead of class components (`useState`, `useEffect`, `useMemo`, `useCallback`).
- Use React Query for data fetching and state synchronization.
- Use Zustand or Context API for global state management when Redux is not necessary.
- Prefer TailwindCSS over manually written CSS or inline styles.
- Follow accessibility best practices (e.g., `aria-*` attributes, semantic HTML).

### Code Formatting & Standards
- Use Prettier with ESLint for consistent formatting.
- Follow Airbnb or recommended ESLint rules for React.
- Use absolute imports for better module resolution (`import { Button } from "components/Button"`).
- Use descriptive variable and function names; avoid abbreviations.
- Avoid deeply nested components; extract reusable logic into hooks or utility functions.

## Commit Message Guidelines
- Follow conventional commit messages:
  - `feat: ` for new features
  - `fix: ` for bug fixes
  - `refactor: ` for code improvements
  - `docs: ` for documentation updates
  - `chore: ` for dependency updates

By following these instructions, Copilot should assist in maintaining an organized project with an up-to-date changelog while enforcing modern React TypeScript best practices.

## Steps to do before commiting
- Run all the github actions workflows locally and make sure they all pass