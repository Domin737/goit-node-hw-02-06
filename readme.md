# Contact Management API

This is a Node.js-based REST API for managing contacts. It provides user authentication, contact management, and various other features.

## Application Overview

This application is a robust Contact Management System with user authentication. It allows users to sign up, log in, manage their profile, and perform CRUD operations on their contacts.

## Functionality

1. **User Authentication**
   - Sign up
   - Log in
   - Log out
   - Email verification
   - Password hashing for security

2. **User Profile Management**
   - Get current user info
   - Update user avatar
   - Update subscription status

3. **Contact Management**
   - List all contacts (with pagination and filtering)
   - Get a specific contact by ID
   - Add a new contact
   - Update an existing contact
   - Delete a contact
   - Update contact's favorite status

## Integrations

The application integrates with several external services and libraries:

1. **MongoDB**: For data storage
2. **Express.js**: Web application framework
3. **JWT (jsonwebtoken)**: For secure authentication
4. **Bcrypt.js**: For password hashing
5. **Joi**: For request validation
6. **Gravatar**: For default user avatars
7. **Jimp**: For image processing (avatar resizing)
8. **SendGrid**: For sending verification emails
9. **Cors**: For enabling Cross-Origin Resource Sharing
10. **Morgan**: For HTTP request logging

## How to Use Each Functionality

### User Authentication

1. **Sign Up**
   - Send a POST request to `/api/users/signup` with email and password in the request body.
   - A verification email will be sent to the provided email address.

2. **Email Verification**
   - Click the link in the verification email or send a GET request to `/api/users/verify/:verificationToken`.

3. **Resend Verification Email**
   - If you didn't receive the verification email, send a POST request to `/api/users/verify` with your email in the request body.

4. **Log In**
   - Send a POST request to `/api/users/login` with email and password in the request body.
   - You'll receive a JWT token to use for authenticated requests.

5. **Log Out**
   - Send a POST request to `/api/users/logout` with the JWT token in the Authorization header.

### User Profile Management

1. **Get Current User Info**
   - Send a GET request to `/api/users/current` with the JWT token in the Authorization header.

2. **Update User Avatar**
   - Send a PATCH request to `/api/users/avatars` with the new avatar image file.
   - The avatar will be resized to 250x250 pixels.

3. **Update Subscription**
   - Send a PATCH request to `/api/users` with the new subscription status ("starter", "pro", or "business") in the request body.

### Contact Management

1. **List Contacts**
   - Send a GET request to `/api/contacts`.
   - You can use query parameters for pagination (`page`, `limit`) and filtering by favorite status.

2. **Get Contact by ID**
   - Send a GET request to `/api/contacts/:contactId`.

3. **Add New Contact**
   - Send a POST request to `/api/contacts` with the contact details in the request body.

4. **Update Contact**
   - Send a PUT request to `/api/contacts/:contactId` with the updated contact details in the request body.

5. **Delete Contact**
   - Send a DELETE request to `/api/contacts/:contactId`.

6. **Update Contact's Favorite Status**
   - Send a PATCH request to `/api/contacts/:contactId/favorite` with the new favorite status in the request body.

## Running the Application

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables (check .env.example for required variables).

3. Run the server:
   - Production mode: `npm start`
   - Development mode: `npm run start:dev`

4. Run linter:
   - Check code: `npm run lint`
   - Fix linting issues: `npm run lint:fix`

Make sure to set up all required environment variables, especially for MongoDB connection and SendGrid API key, before running the application.