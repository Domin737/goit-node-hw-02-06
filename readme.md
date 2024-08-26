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
   - Filter contacts by favorite status
   - Paginate contact list

## API Endpoints

### User Authentication

1. **Register User**
   ```
   POST http://localhost:3000/api/users/signup
   Content-Type: application/json
   {
     "email": "example@example.com",
     "password": "examplepassword"
   }
   ```

2. **Login User**
   ```
   POST http://localhost:3000/api/users/login
   Content-Type: application/json
   {
     "email": "example@example.com",
     "password": "examplepassword"
   }
   ```

3. **Get Current User**
   ```
   GET http://localhost:3000/api/users/current
   Authorization: Bearer [your_token]
   ```

4. **Logout User**
   ```
   GET http://localhost:3000/api/users/logout
   Authorization: Bearer [your_token]
   ```

### Contact Management

1. **List Contacts**
   ```
   GET http://localhost:3000/api/contacts
   Authorization: Bearer [your_token]
   ```

2. **Get Single Contact**
   ```
   GET http://localhost:3000/api/contacts/{contact_id}
   Authorization: Bearer [your_token]
   ```

3. **Add Contact**
   ```
   POST http://localhost:3000/api/contacts
   Content-Type: application/json
   {
     "name": "John Doe",
     "email": "example@example.com",
     "phone": "123-456-789"
   }
   Authorization: Bearer [your_token]
   ```

4. **Delete Contact**
   ```
   DELETE http://localhost:3000/api/contacts/{contact_id}
   Authorization: Bearer [your_token]
   ```

5. **Update Contact**
   ```
   PUT http://localhost:3000/api/contacts/{contact_id}
   Content-Type: application/json
   {
     "name": "John Doe",
     "email": "new_email@example.com",
     "phone": "987-654-321"
   }
   Authorization: Bearer [your_token]
   ```

6. **Filter Contacts**
   ```
   GET http://localhost:3000/api/contacts?favorite=true
   Authorization: Bearer [your_token]
   ```

7. **Paginate Contacts**
   ```
   GET http://localhost:3000/api/contacts?page=1&limit=10
   Authorization: Bearer [your_token]
   ```

### User Profile Management

1. **Update Subscription**
   ```
   PATCH http://localhost:3000/api/users/subscription
   Content-Type: application/json
   {
     "subscription": "pro"
   }
   Authorization: Bearer [your_token]
   ```

## Expected and Unexpected Responses

When using the application, you can expect the following types of responses:

### Expected Responses:

1. **Successful operations**: HTTP status codes in the 2xx range (e.g., 200 OK, 201 Created) with a JSON response body containing the requested data or a success message.
2. **Authentication responses**: 
   - Successful login/signup: 200 OK with a token in the response body.
   - Successful logout: 204 No Content.
3. **Pagination**: When listing contacts, expect a response with an array of contacts and metadata about the pagination (total count, current page, etc.).

### Unexpected Responses:

1. **Bad Request (400)**: When the request is malformed or contains invalid data.
2. **Unauthorized (401)**: When trying to access protected routes without a valid token.
3. **Forbidden (403)**: When trying to access or modify resources that don't belong to the authenticated user.
4. **Not Found (404)**: When trying to access a resource that doesn't exist.
5. **Internal Server Error (500)**: For unexpected server-side errors.

All error responses will include a JSON body with an "error" field describing the issue.

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

## Automated Tests

This application includes automated tests to ensure its functionality. The tests are written using Jest and Supertest.

### Running Tests

To run the automated tests, follow these steps:

1. Make sure you have all the dependencies installed:
   ```
   npm install
   ```

2. Set up the test environment variables in the `.env.test` file. At minimum, you need to set the following variables:
   - `DB_TEST_HOST`: The MongoDB connection string for your test database
   - `JWT_SECRET`: A secret key for JWT token generation
   - `SENDGRID_API_KEY`: Your SendGrid API key for email functionality
   - `SENDGRID_FROM_EMAIL`: The email address to use as the sender for verification emails

3. Run the tests using the following command:
   ```
   npm test
   ```

### Test Coverage

The tests cover the following functionalities:

1. **User Authentication**
   - User registration (signup)
   - User login
   - User logout
   - Email verification
   - Resend verification email

2. **User Profile**
   - Retrieving current user information
   - Updating user subscription

3. **Contact Management**
   - Creating a new contact
   - Retrieving all contacts (including pagination and filtering)
   - Retrieving a single contact
   - Updating a contact
   - Deleting a contact
   - Updating a contact's favorite status

4. **Input Validation**
   - Ensuring proper validation for all API endpoints

5. **Authorization**
   - Verifying that protected routes require authentication

### Test Environment

The tests use a separate test database specified in the `.env.test` file. This ensures that your development or production database is not affected by the tests.

### Continuous Integration

It's recommended to run these tests as part of your CI/CD pipeline to ensure that new changes don't break existing functionality.

### Troubleshooting Tests

If you encounter issues with the tests:

1. Make sure your `.env.test` file is properly configured with the correct database connection string, JWT secret, and SendGrid settings.
2. Ensure that the test database is accessible and that you have the necessary permissions.
3. Check that all dependencies are properly installed by running `npm install` again.
4. If you're getting timeout errors, you may need to increase the timeout in the test file (currently set to 20000ms).
5. For email-related tests, ensure that your SendGrid API key is valid and has the necessary permissions.

Remember to never use your production database for testing. Always use a separate test database to prevent any unintended data manipulation in your production environment.

## Author

This project was created by Paweł Dominiak (p.dominiak.pd@gmail.com) as part of the GoIT Poland - Fullstack Developer course.

## Project Context

This Contact Management API was developed as a learning project within the GoIT Poland - Fullstack Developer course. It serves as a practical application of Node.js, Express.js, and MongoDB concepts, demonstrating skills in building RESTful APIs, implementing authentication and authorization, and working with databases.