# Project Sothea Frontend
### Last Updated: 12 Apr, 2026

## Overview

This is the frontend for the patient management system for Project Sothea, and is to be set up in conjunction with the backend.  
The frontend is built with Vue 3 and TypeScript, using Vite as the build tool and Tailwind CSS for styling. It provides a web UI for managing patient records, the patient queue, and the pharmacy inventory.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v20+) - JavaScript runtime.
- [npm](https://www.npmjs.com/) - Package manager (bundled with Node.js).

## Installation and Setup

1. Clone the repository to your local machine: `git clone https://github.com/Project-Sothea/Sothea-Frontend.git`

2. Install dependencies: `npm install`

3. Create a `.env.local` file and set `VITE_API_URL` to point at the backend (see Configuration below).

4. Start the development server: `npm run dev`

The dev server is typically accessible at `http://localhost:5173`.

To expose the dev server on your local network (e.g. for mobile or tablet testing):

```sh
npm run dev -- --host
```

## Building for Production

```sh
npm run build
```

The output is placed in `dist/`. Copy this folder into the backend's root directory — the backend serves the frontend static files from `./dist` at `/`.

## Configuration

Create a `.env.local` file in the project root with the following variable:

| Variable        | Description                                              |
|-----------------|----------------------------------------------------------|
| `VITE_API_URL`  | Base URL for API requests (e.g. `http://localhost:3000/api`). Falls back to `/api` if not set. |

The API base URL is consumed in `src/shared/api/http.ts`.

## Common Issues

- **401 Unauthorized on every request**  
  The JWT token is stored in `sessionStorage` and is cleared when the tab is closed. Re-login to obtain a fresh token.

- **API requests failing in development**  
  If `VITE_API_URL` is not set, the dev proxy forwards `/api` to `http://localhost:3000` (configured in `vite.config.ts`). Ensure the backend is running on that port, or set `VITE_API_URL` explicitly.

---

## Developer Documentation

## Application Structure

The frontend is a single-page application (SPA) with client-side routing provided by Vue Router. All pages require authentication; unauthenticated users are redirected to `/sign-in`. The auth guard and route definitions live in `src/app/router/index.ts`.

### Pages and Routes

| Route                        | Page                      | Description                          |
|------------------------------|---------------------------|--------------------------------------|
| `/sign-in`                   | SignInPage                | Login page                           |
| `/patient-queue`             | PatientQueuePage          | Today's patient queue                |
| `/patient-directory`         | PatientDirectoryPage      | All patients across visits           |
| `/patient/new`               | PatientRecordPage         | Create a new patient                 |
| `/patient/:id/:vid`          | PatientRecordPage         | View/edit a patient visit record     |
| `/pharmacy`                  | PharmacyOverviewPage      | Pharmacy drug inventory overview     |
| `/pharmacy/drugs/:drugId`    | PharmacyDrugOverviewPage  | Per-drug batch and stock details     |
| `/pharmacy/batches/new`      | PharmacyCreateBatchPage   | Add a new drug batch                 |

## Directory Structure

```
.
├── README.md                          - Setup instructions and developer documentation.
├── index.html                         - SPA entry point.
├── vite.config.ts                     - Vite config: path aliases and dev proxy.
├── tailwind.config.js                 - Tailwind CSS configuration.
├── tsconfig.json
├── package.json
└── src/
    ├── index.css                      - Global styles and Tailwind directives.
    ├── shims-vue.d.ts                 - TypeScript shim for .vue files.
    ├── app/
    │   ├── main.ts                    - App entry point; mounts Vue app.
    │   ├── App.vue                    - Root component.
    │   └── router/
    │       └── index.ts               - Route definitions and global auth guard.
    ├── assets/                        - Static assets (SVG icons, images, CSS).
    ├── shared/
    │   ├── api/
    │   │   ├── http.ts                - Axios instance; handles auth headers and snake_case/camelCase conversion.
    │   │   └── handleApiError.ts      - Shared API error handler.
    │   ├── types/
    │   │   └── PatientVisitMeta.ts    - Shared type for patient+visit metadata.
    │   ├── ui/
    │   │   └── navigation/
    │   │       └── NavBar.vue         - Top navigation bar.
    │   └── utils/
    │       ├── age.ts                 - Age calculation utilities.
    │       └── date.ts                - Date formatting utilities.
    └── features/
        ├── auth/
        │   ├── api/auth.ts            - Login API call.
        │   ├── composables/
        │   │   └── useAuth.ts         - Auth state (token, login, logout) backed by sessionStorage.
        │   ├── pages/
        │   │   └── SignInPage.vue
        │   └── types/
        │       └── Profiles.tsx       - User role/profile types.
        ├── patient-queue/
        │   ├── api/queue.ts           - Queue API calls.
        │   ├── components/            - Table, toolbar, and row components.
        │   └── pages/
        │       └── PatientQueuePage.vue
        ├── patient-directory/
        │   ├── api/directory.ts       - Directory API calls.
        │   ├── components/            - Table, toolbar, and row components.
        │   └── pages/
        │       └── PatientDirectoryPage.vue
        ├── patient-record/
        │   ├── api/
        │   │   ├── patient.ts         - Patient CRUD API calls.
        │   │   ├── record.ts          - Per-category record API calls.
        │   │   ├── visit.ts           - Visit management API calls.
        │   │   └── photo.ts           - Patient photo upload API calls.
        │   ├── components/            - Per-category modals (Admin, Dental, DrConsult, etc.) and shared UI.
        │   ├── composables/
        │   │   ├── usePatientForm.ts  - Patient details form state and submission logic.
        │   │   ├── useAdminForm.ts    - Admin form state and submission logic.
        │   │   └── useAutoDraft.ts    - Auto-draft/save composable.
        │   ├── pages/
        │   │   └── PatientRecordPage.vue
        │   └── types/                 - TypeScript types for each patient data category.
        └── pharmacy/
            ├── api/
            │   ├── drug.ts            - Drug management API calls.
            │   ├── batch.ts           - Batch management API calls.
            │   └── prescription.ts    - Prescription API calls.
            ├── components/            - Drug, batch, and location modals.
            ├── pages/
            │   ├── PharmacyOverviewPage.vue
            │   ├── PharmacyDrugOverviewPage.vue
            │   └── PharmacyCreateBatchPage.vue
            └── types/                 - TypeScript types for Drug, Batch, Prescription.
```

## HTTP Client and Key Conventions

All API communication goes through the Axios instance in `src/shared/api/http.ts`:

- **Auth header**: The JWT token is read from `sessionStorage` and attached as `Authorization: Bearer <token>` on every request.
- **snake_case ↔ camelCase**: Outgoing request bodies are automatically converted from camelCase to snake_case. Incoming responses are converted from snake_case to camelCase. This keeps Vue components and TypeScript types in camelCase while the backend speaks snake_case.
- **401 handling**: A 401 response clears the token from `sessionStorage` and redirects to `/sign-in`.

## Authentication

Authentication state is managed by the `useAuth` composable in `src/features/auth/composables/useAuth.ts`. The JWT token is stored in `sessionStorage` — it survives page refreshes within the same tab but is cleared when the tab is closed.

The global router guard in `src/app/router/index.ts` enforces authentication on every route except `/sign-in`.

## Naming Conventions

TypeScript Types: PascalCase  
e.g. `PatientDetails`, `VitalStatistics`

Component Files: PascalCase  
e.g. `PatientRecordPage.vue`, `AdminModal.vue`

Composables: camelCase with `use` prefix  
e.g. `useAuth`, `usePatientForm`

API Modules: camelCase  
e.g. `patient.ts`, `record.ts`

JSON Fields (API boundary): snake_case — converted automatically by `http.ts`
