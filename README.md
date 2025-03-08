# Bodysharing Website

This project is a React-based website for Bodysharing community. It is deployed on GitHub Pages and can be accessed [here](https://pepperumo.github.io/bodysharing_website).

## Getting Started

These instructions will help you set up and run the project on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/pepperumo/bodysharing_website.git
   cd bodysharing_website
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

### Running the Project

To start the development server, run:

```sh
npm start
```

This will start the React development server and open the project in your default web browser. The server will automatically reload if you make changes to the code.

### Building the Project

To create a production build of the project, run:

```sh
npm run build
```

This will create an optimized build of the project in the `build` directory.

### Deploying to GitHub Pages

The project is configured to deploy to GitHub Pages. To deploy the latest version, run:

```sh
npm run deploy
```

## Project Structure

The project follows a feature-based folder structure:

- `src/components`: Contains all the React components.
- `src/hooks`: Contains custom React hooks.
- `src/contexts`: Contains context providers for global state management.
- `src/services`: Contains services for API calls and other business logic.
- `src/utils`: Contains utility functions and helpers.
- `src/types`: Contains TypeScript types and interfaces.

## Contributing

If you would like to contribute to the project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix:

   ```sh
   git checkout -b feature-name
   ```

3. Make your changes and commit them with a descriptive commit message:

   ```sh
   git commit -m "feat: add new feature"
   ```

4. Push your changes to your forked repository:

   ```sh
   git push origin feature-name
   ```

5. Create a pull request to the main repository.

## License

This project is licensed under the MIT License.
