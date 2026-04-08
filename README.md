# Sothea Frontend

This is the frontend of the **Sothea Patient Management System**, developed to assist in managing patients during health screenings as part of Project Sothea. The frontend is built using Vue.js and is designed to be used in conjunction with the Sothea Backend.

## Project Setup

To set up the project on your local machine, follow these steps:

1. Clone the repository:

    ```sh
    git clone https://github.com/Project-Sothea/Sothea-Frontend.git
    cd sothea-frontend
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Compiles and hot-reloads for development

    ```sh
    npm run dev
    ```

    To expose the dev server on your local network (e.g. for mobile testing):

    ```sh
    npm run dev -- --host
    ```

This should launch a development server, typically available at [http://localhost:5173](http://localhost:5173).

> **Backend URL:** The API base URL is configured via the `VITE_API_URL` environment variable (see `src/shared/api/http.ts`). Create a `.env.local` file and set `VITE_API_URL=<your-backend-url>` to point at a local or remote backend. If `VITE_API_URL` is not set, requests fall back to `/api`.

## Development

The project is structured as a basic Vue.js application. You can make changes to the code inside the `src` directory.

## Project Screenshots
<div style="display: flex; justify-content: space-around;">
  <img src="https://github.com/Project-Sothea/Sothea-Frontend/blob/main/public/screenshot_home.png?raw=true" alt="Home Screenshot" width="45%" />
  <img src="https://github.com/Project-Sothea/Sothea-Frontend/blob/main/public/screenshot_addpatient.png?raw=true" alt="Add Patient Screenshot" width="45%" />
</div>