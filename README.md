# Devtation Server - Backend for Developer Project Showcase Platform

The Devtation Server is the backend component of the Devtation platform, built to handle user authentication, project management, file uploads, and interactions between developers. It is built with **Node.js**, **Express**, and integrates with **MongoDB**, **Firebase**, and **AWS S3** for a robust and scalable backend infrastructure.

---

## Live Demo

The Devtation Server powers the live version of Devtation, accessible here:  
👉 [https://devtation.api.rohanworks.com/api](https://devtation.api.rohanworks.com/api)



---

## Features

1. **User Authentication**:
   - Secure user registration and login using **Firebase** and **JWT (JSON Web Tokens)**.
   - Password hashing with **bcrypt** for enhanced security.

2. **Project Management**:
   - CRUD operations for projects (Create, Read, Update, Delete).
   - Store project details in **MongoDB** with **Mongoose** for schema management.

3. **File Uploads**:
   - Upload project assets (e.g., images, videos) to **AWS S3**.
   - Use **Multer** for handling multipart/form-data and **Sharp** for image processing.

4. **API Endpoints**:
   - RESTful APIs for user authentication, project management, and file uploads.
   - CORS-enabled for seamless integration with the Devtation Client.

5. **Scalability**:
   - Designed to handle high traffic with **AWS EC2** and **Nginx**.
   - Automated CI/CD pipeline for streamlined deployments using **Github Actions**.

---

## Technologies Used

- **Backend**: Node.js, Express, Mongoose (for MongoDB), Firebase (authentication).
- **File Storage**: AWS S3 (with `@aws-sdk/client-s3` for SDK integration).
- **Image Processing**: Sharp.
- **Authentication**: JWT, bcrypt, Firebase Admin SDK.
- **Middleware**: Cors, Morgan (logging), Cookie-parser, Multer (file uploads).
- **Deployment**: Docker, Nginx, AWS EC2, CI/CD pipeline.

---

## How to Run Locally

1. **Prerequisites**:
   - Ensure Node.js and npm are installed on your system.
   - Clone the repository:
     ```bash
     git clone https://github.com/scythrine05/Devtation-server.git
     cd Devtation-server
     ```

2. **Install Dependencies**:
   - Run the following command to install all dependencies:
     ```bash
     npm install
     ```

3. **Set Up Environment Variables**:
   - Create a `.env` file in the root directory and add the following variables:
     ```env
     CLIENT_URLS=devtation-client-urls(http://localhost:5173)
     MONGODB_URI=your-mongodb-connection-string
     GOOGLE_APPLICATION_CREDENTIALS_PATH=your-firebase-service.json
     AWS_S3_BUCKET_NAME=your-s3-bucket-name
     AWS_S3_REGION=your-s3-region
     AWS_S3_ACCESS_KEY=your-s3-access-key
     AWS_S3_SECRET_KEY=your-s3-secret-key
     NODE_ENV=your-server-state
     RECAPTCHA_SITE_SECRET=your-google-recaptcha-site-secret
     ```

4. **Start the Server**:
   - Run the development server:
     ```bash
     npm start
     ```
   - The server will be available at `http://localhost:5000`.

---

## Contributing

Feel free to open issues or submit pull requests for improvements. Happy coding!