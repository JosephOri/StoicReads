# StoicReads

## Installation

To install the project dependencies, you can run the following command:
1. Clone the repo - In your terminal: <pre><code>git clone https://github.com/nitzanto/Foodies-WebApp.git</code></pre>

2. Set up MongoDB instance and Configure environment variables.

3. Navigate to the root dir.                                                

4. Install the dependencies for both the frontend and backend:  <pre><code>npm run install</code></pre>

5. Run the app - This command will start both the frontend and backend servers concurrently: <pre><code>npm run dev</code></pre>

## StoicReads App

#### Overview
StoicReads is a book rating and sharing application. This repository contains both the backend and frontend code for the application.

## Video Demo

[![Watch the video](assets/thumbnail.png)](assets/signup%20and%20commenting.mp4)

#### Technologies Used

##### Backend
- TypeScript
- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication
- Swagger for API documentation
- Jest for unit testing

##### Frontend
- React with Vite
- Google client O2Auth
- Google Books API for books data
- Material UI

#### Features

1. **Authentication**
    - User registration and login by username and password
    - Registration via Google
    - JWT authentication with Refresh token
    - Persistent login sessions
    - Logout functionality

2. **User Details**
    - Display user information including photo
    - Editing user information and photo

3. **Content Presentation**
    - Display content from an external REST source of Google Books API. This will include title, author name, and cover image.

4. **Content Sharing**
    - Upload text and picture content
    - View uploaded content
    - Update and delete uploaded content
    - View own uploaded content

5. **Comments**
    - Users can comment on others' content
    - Comments displayed separately with count on main screen

6. **Git Usage**
    - Utilize Git for version control with individual user profiles
    - Make small, descriptive commits

7. **API Documentation**
    - Documented API endpoints using Swagger

8. **Unit Testing**
    - Unit tests written for all server APIs using Jest

9. **TypeScript**
    - Entire project written in TypeScript

10. **Image Storage**
    - Images saved on server, not in database or external service, using Multer

11. **Deployment**
    - Application deployed on a server accessible from anywhere
    - HTTPS enabled
    - Application runs in background with PM2
    - Production mode configured using `NODE_ENV=production`
    - MongoDB used on server with protected connection
    - Entry to the application through specified domain
    - No external hosting services used


## Contributors
- [Nitzan Toledo](https://github.com/nitzanto)
- [Tomer Mizrahi](https://github.com/TomerMiz10)
- [Ori Joseph](https://github.com/JosephOri)
- [Omri Finegold](https://github.com/omrifinegold11)
