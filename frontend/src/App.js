import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import WelcomeScreen from "./components/WelcomeScreen";
import StudentNameScreen from "./components/StudentNameScreen";
import TeacherPollCreation from "./components/TeacherPollCreation";
import StudentPollInterface from "./components/StudentPollInterface";
import TeacherPollResults from "./components/TeacherPollResults";
import StudentPollResults from "./components/StudentPollResults";
import PollHistory from "./components/PollHistory";
import KickedOutScreen from "./components/KickedOutScreen";

function App() {
  const [socket, setSocket] = useState(null);
  const [currentScreen, setCurrentScreen] = useState("welcome");
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState("");
  const [pollData, setPollData] = useState(null);
  const [students, setStudents] = useState([]);
  const [pollHistory, setPollHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [kickedOut, setKickedOut] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Use environment variable for backend URL, fallback to localhost for development
    const backendUrl =
      process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";
    const newSocket = io(backendUrl);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      setIsConnected(true);
    });

    newSocket.on("joined", (data) => {
      setUserRole(data.role);
      if (data.role === "student") {
        setCurrentScreen("student-poll");
      } else {
        setCurrentScreen("teacher-poll-creation");
      }
    });

    newSocket.on("snapshot", (data) => {
      console.log("=== SNAPSHOT RECEIVED ===");
      console.log("Full data:", data);
      console.log("History length:", data.history?.length || 0);
      console.log("All history items:", data.history);
      console.log("========================");

      setPollData(data.poll);
      setStudents(data.students);
      setPollHistory(data.history || []);
    });

    newSocket.on("poll_started", () => {
      if (userRole === "student") {
        setCurrentScreen("student-poll");
      } else {
        setCurrentScreen("teacher-poll-results");
      }
    });

    newSocket.on("revealed", () => {
      if (userRole === "student") {
        setCurrentScreen("student-poll-results");
      } else {
        setCurrentScreen("teacher-poll-results");
      }
    });

    newSocket.on("kicked", () => {
      console.log("=== STUDENT KICKED EVENT ===");
      console.log("Student received kicked event");
      console.log("Current role:", userRole);
      console.log("Setting kickedOut to true");
      setKickedOut(true);
      setCurrentScreen("kicked-out");
      console.log("Screen changed to kicked-out");
      console.log("===========================");
    });

    newSocket.on("error_msg", (message) => {
      alert(message);
    });

    return () => newSocket.close();
  }, [userRole]);

  const handleRoleSelection = (role) => {
    console.log("=== ROLE SELECTION ===");
    console.log("Selected role:", role);
    console.log("Socket connected:", socket?.connected);
    console.log("Socket ID:", socket?.id);

    if (role === "student") {
      setCurrentScreen("student-name");
    } else {
      setUserRole("teacher");
      if (socket && isConnected) {
        console.log("Emitting teacher join event...");
        socket.emit("join", { role: "teacher" });
        console.log("Teacher join event emitted");
      } else {
        console.log("ERROR: Socket not connected for teacher join");
      }
    }
    console.log("=====================");
  };

  const handleStudentNameSubmit = (name) => {
    console.log("=== STUDENT JOIN ===");
    console.log("Student name:", name);
    console.log("Socket connected:", socket?.connected);
    console.log("Socket ID:", socket?.id);

    setUserName(name);
    setUserRole("student");
    if (socket && isConnected) {
      console.log("Emitting student join event...");
      socket.emit("join", { role: "student", name });
      console.log("Student join event emitted");
    } else {
      console.log("ERROR: Socket not connected for student join");
    }
    console.log("===================");
  };

  const handleBackToWelcome = () => {
    setCurrentScreen("welcome");
    setUserRole(null);
    setUserName("");
    setPollData(null);
    setStudents([]);
    setPollHistory([]);
    setShowHistory(false);
    setKickedOut(false);
    setIsConnected(false);
  };

  if (!isConnected && currentScreen === "welcome") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Connecting to server...</p>
        </div>
      </div>
    );
  }

  // Show history has highest priority
  if (showHistory) {
    console.log("=== POLL HISTORY RENDER DEBUG ===");
    console.log("showHistory:", showHistory);
    console.log("pollHistory:", pollHistory);
    console.log("pollHistory length:", pollHistory.length);
    console.log("About to render PollHistory component");
    console.log("================================");

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 9999,
          backgroundColor: "white",
        }}
      >
        <PollHistory
          pollHistory={pollHistory}
          onBack={() => {
            console.log("Back button clicked - closing history");
            setShowHistory(false);
          }}
        />
      </div>
    );
  }

  if (kickedOut) {
    return <KickedOutScreen onBack={handleBackToWelcome} />;
  }

  if (currentScreen === "welcome") {
    return <WelcomeScreen onRoleSelect={handleRoleSelection} />;
  }

  if (currentScreen === "student-name") {
    return <StudentNameScreen onSubmit={handleStudentNameSubmit} />;
  }

  if (currentScreen === "teacher-poll-creation") {
    return (
      <TeacherPollCreation
        socket={socket}
        students={students}
        onPollCreated={() => setCurrentScreen("teacher-poll-results")}
        onShowHistory={() => setShowHistory(true)}
      />
    );
  }

  if (currentScreen === "teacher-poll-results") {
    return (
      <TeacherPollResults
        socket={socket}
        pollData={pollData}
        students={students}
        onShowHistory={() => setShowHistory(true)}
        onAskNewQuestion={() => {
          console.log("=== ASK NEW QUESTION ===");
          console.log("Changing screen to teacher-poll-creation");
          console.log("Current screen:", currentScreen);
          setCurrentScreen("teacher-poll-creation");
          setShowHistory(false); // Ensure history is closed
          console.log("Screen changed!");
          console.log("========================");
        }}
      />
    );
  }

  if (currentScreen === "student-poll") {
    return (
      <StudentPollInterface
        socket={socket}
        pollData={pollData}
        userName={userName}
      />
    );
  }

  if (currentScreen === "student-poll-results") {
    return <StudentPollResults pollData={pollData} />;
  }

  return <div>Loading...</div>;
}

export default App;
