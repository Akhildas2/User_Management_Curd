# CRUDify – A simple, responsive user management system.

A fully‑responsive User Management System (“CRUDify”) with **Admin** and **User** roles, built with **Angular** (Frontend) and **Node.js**, **Express.js**, **MongoDB**, **TypeScript** (Backend). Includes advanced features like JWT authentication, Nodemailer integration, and Cloudinary image management.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Features

### Admin Features

- **User Management**: Add/Edit/Delete users with role-based access
- **Verification System**: Verify/Unverify users
- **Access Control**: Block/Unblock users accounts
- **Dashboard**: Visualize user statistics and activity insights using dynamic charts
- **Advanced Search**: Filter users by status/role

### User Features

- **Authentication**:
  - Register with email verification
  - Login/Logout
  - Forgot Password & Reset via Email
- **Profile Management**:
  - Add/Edit/Delete personal details
  - Upload profile images (Cloudinary integration)
- **Settings**:
  - Change password securely
  - Contact support form for assistance
  - Access to Help Center / FAQ section

### Common Features

- JWT-based Authentication
- Fully Responsive Design
- Email Notifications (Nodemailer)
- Type Safety with TypeScript

---

## Technologies Used

### Frontend

- **Angular CLI**: Version 18.2.1
- **TypeScript**
- **RxJS**
- **Angular Material**

### Backend

- **Node.js**
- **Express.js**
- **MongoDB**
- **TypeScript**
- **JWT Authentication**
- **Nodemailer**
- **Bcrypt**
- **Cloudinary API**

---

## Getting Started

### Prerequisites

- **Node.js** (version 16 or higher)
- **Angular CLI** (version 18.2.1)
- **MongoDB** (local or cloud instance)

### Installation

1. Clone the repository:

```bash
https://github.com/Akhildas2/crudify.git
cd crudify
```

2. Install dependencies

- frontend:

```bash
cd frontend
npm install
```

- backend:

```bash
cd ../backend
npm install
```

### Environment Setup

- Create `.env` file in `/backend`:

```bash
PORT =<your-port>
CLIENT_URL =<your-client-url>
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
MONGO_URI=<your-mongo-connection-string>
JWT_SECRET=<your-jwt-secret>
REFRESH_TOKEN_SECRET=<your-refresh-token>
ACCESS_TOKEN_SECRET=<your-access-token>
SMTP_HOST=<smtp-host>
SMTP_PORT=<smtp-port>
SMTP_USER=<smtp-username>
SMTP_PASS=<smtp-password>
SMTP_FROM=<smtp-from>
```

- Angular also supports environment files under client/src/environments/

```bash
export const environment = {
  production: false,
  apiUrl: 'http://localhost:<Port>',
  userApiUrl: 'http://localhost:<Port>/api/user',
  adminApiUrl: 'http://localhost:<Port>/api/admin'
};
```

### Running the Application

#### Frontend

1. Navigate to the `frontend` directory:

```bash
   cd frontend
```

2. Start the development server:

```bash
ng serve
```

3. Open your browser and go to: http://localhost:4200

#### Backend

1. Navigate to the `backend` directory:

```bash
   cd backend
```

2. Start the development server:

```bash
npm run dev
```

3. The backend will run on: http://localhost:3333

---

## Project Structure

```bash
crudify/
├── frontend/                             # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/                     # Route guards, interceptors, core services
│   │   │   │   ├── guards/
│   │   │   │   ├── interceptors/
│   │   │   │   └── services/
│   │   │   ├── features/                 # Feature modules
│   │   │   │   ├── admin/
│   │   │   │   ├── auth/
│   │   │   │   ├── common/
│   │   │   │   └── user/
│   │   │   ├── shared/                   # Reusable components, models, services, validators
│   │   │   │   ├── components/
│   │   │   │   ├── models/
│   │   │   │   ├── services/
│   │   │   │   └── validators/
│   │   │   └── store/                    # State management using NgRx
│   │   │       ├── actions/
│   │   │       ├── effects/
│   │   │       ├── reducers/
│   │   │       ├── selectors/
│   │   │       └── state/
│   │   ├── environments/
│   │   ├── app.module.ts
│   │   └── material.module.ts           # Angular Material components
│   ├── index.html
│   ├── angular.json
│   └── package.json

├── backend/                              # Node.js + Express Backend
│   ├── src/
│   │   ├── config/                       # App config & DB connection
│   │   ├── controllers/                  # Request handlers
│   │   ├── helpers/                      # Utility functions (email, Cloudinary, etc.)
│   │   ├── interfaces/                   # TypeScript interfaces & types
│   │   ├── middlewares/                 # Authentication, error handlers
│   │   ├── routes/                       # Route definitions
│   │   ├── services/                     # Business logic
│   │   └── server.ts                     # App entry point
│   ├── .env                              # Environment variables
│   ├── tsconfig.json
│   ├── package.json
│   └── package-lock.json

```

## API Reference

All endpoints are prefixed with:  
`/api`

---

### 🔐 Auth Routes

| Method | Endpoint           | Description                |
| ------ | ------------------ | -------------------------- |
| POST   | `/register`        | Register a new user        |
| POST   | `/login`           | User login                 |
| POST   | `/logout`          | Logout current user        |
| POST   | `/refresh-token`   | Refresh JWT access token   |
| POST   | `/forgot-password` | Send password reset email  |
| POST   | `/reset-password`  | Reset password using token |

---

### 👤 User Routes

| Method | Endpoint                   | Description                       |
| ------ | -------------------------- | --------------------------------- |
| GET    | `/user/:id`                | Get user by ID                    |
| PUT    | `/user`                    | Update user data                  |
| DELETE | `/user/:id`                | Delete user                       |
| POST   | `/user/upload-photo`       | Upload profile photo (Cloudinary) |
| POST   | `/user/:id/changePassword` | Change user password              |

---

### 🛠 Admin Routes

| Method | Endpoint                 | Description                               |
| ------ | ------------------------ | ----------------------------------------- |
| GET    | `/admin/users`           | Get list of all users                     |
| GET    | `/admin/user/:id`        | Get a specific user by ID                 |
| POST   | `/admin/user`            | Create a new user (supports image upload) |
| PUT    | `/admin/user`            | Update existing user (supports image)     |
| DELETE | `/admin/user/:id`        | Delete a user by ID                       |
| PATCH  | `/admin/user/:id`        | Block or Unblock a user                   |
| PATCH  | `/admin/user/verify/:id` | Verify or Unverify a user                 |

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:

```bash
git checkout -b feature-name
```

3. Commit your changes:

```bash
git commit -m "Add feature"
```

4. Push the branch:

```bash
git push origin feature-name
```

5. Open a Pull Request.

## License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.

## Contact

For questions, suggestions, or feedback, please reach out:

- **Author:** akhildas.p
- **GitHub:** [Akhildas2](https://github.com/Akhildas2)
- **Email:** akhildasaki12@gmail.com

  Happy coding with CRUDify! and thank you for exploring.
