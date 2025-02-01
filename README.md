# Task Manager - CS50x Final Project

## Video Demo: [URL to your video demo]

## Description

Task Manager is a modern, responsive web application built with React and Node.js that helps users organize and track their daily tasks efficiently. The application features a clean, intuitive interface with real-time updates and smooth animations.

### Key Features

- User authentication and secure login
- Create, read, update, and delete tasks
- Real-time task status updates
- Optimistic UI updates for better user experience
- Responsive design that works on both desktop and mobile devices
- Dark/Light theme support
- Error handling and user feedback

## Technologies Used

- Frontend:
  - React.js
  - Context API for state management
  - CSS3 with modern animations
  - Bootstrap for responsive design
- Backend:
  - Node.js
  - Express.js
  - MongoDB for data storage
  - JWT for authentication

## Setup and Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn package manager

### Backend Setup

1. Clone the repository

```bash
git clone [your-repository-url]
```

2. Navigate to the server directory

```bash
cd server
```

3. Install dependencies

```bash
npm install
```

4. Create a .env file with the following variables

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

5. Start the server

```bash
npm start
```

### Frontend Setup

1. Navigate to the client directory

```bash
cd client
```

2. Install dependencies

```bash
npm install
```

3. Create a .env file with the following variables

```
REACT_APP_API_URL=http://localhost:5000
```

4. Start the development server

```bash
npm start
```

## Usage

1. Register a new account or login with existing credentials
2. Add new tasks using the input field at the top
3. Mark tasks as complete by clicking the checkbox
4. Delete tasks using the delete button
5. View your active and completed tasks in separate sections
6. Toggle between light and dark themes using the theme switcher

## Project Structure

```
task-manager/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/      # Context providers
│   │   ├── api/          # API integration
│   │   └── styles/       # CSS styles
│   └── public/           # Static files
└── server/               # Backend Node.js application
    ├── controllers/      # Route controllers
    ├── models/          # Database models
    ├── routes/          # API routes
    └── middleware/      # Custom middleware
```

## Design Choices

- Used React for its component-based architecture and efficient rendering
- Implemented JWT authentication for secure user sessions
- Chose MongoDB for its flexibility with document-based storage
- Implemented optimistic updates for better user experience
- Used CSS media queries for responsive design
- Incorporated error handling and loading states for better UX

## Future Improvements

- Task categories and labels
- Due dates and reminders
- Task priority levels
- Collaborative task sharing
- Data export functionality
- Push notifications

## About the Developer

This project was created by [Your Name] as a final project for CS50x. It represents the culmination of learning web development concepts and implementing them in a real-world application.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- CS50x teaching staff
- React documentation
- MongoDB documentation
- Bootstrap framework
