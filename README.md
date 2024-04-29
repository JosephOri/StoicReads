# Foodies

Foodies project

## Installation

To install the project dependencies, you can run the following command:

<pre><code>npm install</code></pre>

This will install the dependencies for both the frontend and backend applications.

## Usage

To run the project in development mode, you can use the following command:

<pre><code>npm run dev</code></pre>


This command will start both the frontend and backend servers concurrently.

### Foodies App

#### Overview
Foodies is a restaurant rating and sharing application. This repository contains both the backend and frontend code for the application.

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
- TripAdvisor API for restaurant data

#### Features

1. **Authentication**
    - User registration and login by username and password
    - Registration via Google or Facebook
    - JWT authentication with Refresh token
    - Persistent login sessions
    - Logout functionality

2. **User Details**
    - Display user information including photo
    - Editing user information and photo

3. **Content Presentation**
    - Display content from an external REST source

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
    - Images saved on server, not in database or external service, using MongoDB

11. **Deployment**
    - Application deployed on a server accessible from anywhere
    - HTTPS enabled
    - Application runs in background with PM2
    - Production mode configured using `NODE_ENV=production`
    - MongoDB used on server with protected connection
    - Entry to the application through specified domain
    - No external hosting services used

12. **Design**
    - Implemented with a reasonable design layout

13. **Additional Content (for 3-4 developers)**
    - Implemented io.socket for real-time user-to-user communication
    - Check-ins saved in DB for persistence across sessions

#### Setup Instructions
1. Clone the repository.
2. Install dependencies for backend and frontend.
3. Set up MongoDB instance.
4. Configure environment variables.
5. Run backend and frontend servers.
6. Access the application via the specified domain.

### Screens in Figma
- [Link to Figma Screens](https://www.figma.com/file/yaZXJ4QHtN2n6gkiTtJEdo/Foodies?type=design&t=28b7JoZKdfAU6kah-6)

### JIRA Tasks
- **Epics**
    - User Authentication
    - User Profile Management
    - Content Management
    - Commenting System
    - Deployment and Hosting
- **Tasks**
    - Detailed tasks breakdown available in JIRA

### Work Breakdown
1. **Backend Development**
    - User Authentication APIs
    - User Profile APIs
    - Content Management APIs
    - Commenting System APIs
    - Unit Testing
    - Swagger Documentation
2. **Frontend Development**
    - Authentication UI
    - User Profile UI
    - Content Presentation UI
    - Content Sharing UI
    - Commenting UI
    - Integration with Backend APIs
3. **Design and Styling**
    - UI/UX Design
    - Layout Styling
4. **Deployment and Hosting**
    - Server Setup
    - HTTPS Configuration
    - Domain Configuration
    - PM2 Setup
5. **Testing and QA**
    - Manual Testing
    - Unit Testing
    - Bug Fixing
6. **Additional Features (if applicable)**
    - Implementation of io.socket
    - Persistence of Check-ins

## Contributors
- [Nitzan Toledo](https://github.com/nitzanto)
- [Tomer Mizrahi](https://github.com/TomerMiz10)
- [Ori Joseph](https://github.com/JosephOri)
- [Omri Finegold](https://github.com/omrifinegold11)