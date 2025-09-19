# Live Polling System

A real-time polling application built with React, Express.js, and Socket.io that allows teachers to create polls and students to participate in them.

## Features

### Teacher Features

- Create new polls with multiple choice questions
- Set time limits for polls (15-60 seconds)
- View live polling results in real-time
- Ask new questions only when:
  - No question has been asked yet, or
  - All students have answered the previous question
- View poll history
- Remove students from the session
- Chat functionality with students

### Student Features

- Enter name on first visit (unique per tab)
- Submit answers to poll questions
- View live polling results after submission
- Maximum of 60 seconds to answer questions
- Chat functionality with other participants

## Technology Stack

- **Frontend**: React with Tailwind CSS
- **Backend**: Express.js with Socket.io
- **Real-time Communication**: WebSocket connections

## Installation and Setup

### Prerequisites

- Node.js (v14 or higher)
- npm

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
```

The backend server will run on `http://localhost:4000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend/myapp
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

1. **Start the Backend**: Run the backend server first
2. **Start the Frontend**: Run the React development server
3. **Open the Application**: Navigate to `http://localhost:3000`
4. **Select Role**: Choose between Teacher or Student
5. **For Students**: Enter your name to join the session
6. **For Teachers**: Create polls and monitor results

## UI Design

The application follows the exact Figma design specifications with:

- Dark gray background (`#1A1A1A`)
- White content cards with rounded corners
- Purple accent colors (`#7765DA`, `#5767D0`, `#4F0DCE`)
- Clean, modern typography using Inter font
- Responsive design for different screen sizes

## Project Structure

```
intervue/
├── backend/
│   ├── server.js          # Express server with Socket.io
│   ├── package.json       # Backend dependencies
│   └── node_modules/      # Backend dependencies
├── frontend/
│   └── myapp/
│       ├── src/
│       │   ├── components/    # React components
│       │   │   ├── WelcomeScreen.js
│       │   │   ├── StudentNameScreen.js
│       │   │   ├── TeacherPollCreation.js
│       │   │   ├── StudentPollInterface.js
│       │   │   ├── TeacherPollResults.js
│       │   │   ├── StudentPollResults.js
│       │   │   ├── PollHistory.js
│       │   │   └── KickedOutScreen.js
│       │   ├── App.js         # Main application component
│       │   ├── index.js       # Application entry point
│       │   └── index.css      # Tailwind CSS imports
│       ├── public/            # Static assets
│       └── package.json       # Frontend dependencies
└── README.md
```

## Key Features Implemented

✅ **Role Selection**: Welcome screen with Teacher/Student selection
✅ **Student Name Entry**: Unique name validation per session
✅ **Poll Creation**: Teacher can create polls with multiple options
✅ **Real-time Polling**: Live updates using Socket.io
✅ **Timer Functionality**: 60-second maximum time limit
✅ **Live Results**: Real-time result display with progress bars
✅ **Poll History**: View past poll results
✅ **Student Management**: Teachers can remove students
✅ **Chat System**: Basic chat interface (UI implemented)
✅ **Responsive Design**: Works on different screen sizes
✅ **Exact UI Match**: Follows Figma design specifications

## Socket Events

### Client to Server

- `join`: Join as teacher or student
- `create_poll`: Create a new poll
- `answer`: Submit poll answer
- `reveal_now`: Manually reveal results
- `kick`: Remove a student

### Server to Client

- `joined`: Confirmation of joining
- `snapshot`: Current state update
- `poll_started`: New poll created
- `revealed`: Results revealed
- `kicked`: Student removed
- `error_msg`: Error message

## Development Notes

- The application uses in-memory storage (no database)
- Socket connections are managed automatically
- State is synchronized across all connected clients
- Error handling for duplicate names and invalid operations
- Responsive design with Tailwind CSS utility classes

## Future Enhancements

- Database persistence for poll history
- User authentication system
- Advanced chat features
- Poll analytics and reporting
- Mobile app development
- Real-time notifications
