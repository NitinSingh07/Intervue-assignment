import React from "react";

// Add CSS animation for slide-up effect
const slideUpKeyframes = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = slideUpKeyframes;
  document.head.appendChild(styleSheet);
}

const TeacherPollResults = ({
  socket,
  pollData,
  students,
  onShowHistory,
  onAskNewQuestion,
}) => {
  const [showParticipants, setShowParticipants] = React.useState(false);
  const totalVotes = pollData
    ? pollData.options.reduce((sum, option) => sum + option.count, 0)
    : 0;

  // If no poll data, teacher should go back to poll creation, not show waiting screen
  if (!pollData) {
    onAskNewQuestion();
    return null;
  }

  const handleKickStudent = (studentName) => {
    if (socket && studentName) {
      console.log("=== KICK STUDENT DEBUG ===");
      console.log("Kicking student:", studentName);
      console.log("Socket connected:", socket.connected);
      console.log("Socket ID:", socket.id);
      console.log("Emitting kick event...");
      socket.emit("kick", { name: studentName });
      console.log("Kick event emitted successfully");
      console.log("========================");
    } else {
      console.log("ERROR: Missing socket or studentName", {
        socket: !!socket,
        studentName,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-white">
      {/* Chat/Participants Panel - Only show when showParticipants is true */}
      {showParticipants && (
        <div
          style={{
            position: "fixed",
            bottom: "110px", // Above the floating button
            right: "32px", // Same right position as button
            width: "400px",
            height: "500px",
            background: "white",
            border: "2px solid #DFCCCC",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
            zIndex: 1001, // Higher than floating button
            animation: "slideUp 0.3s ease-out",
          }}
        >
          {/* Tab Headers */}
          <div
            style={{
              display: "flex",
              background: "white",
              borderBottom: "1px solid #E5E7EB",
            }}
          >
            <div
              style={{
                flex: 1,
                padding: "12px 16px",
                textAlign: "center",
                fontSize: "16px",
                fontWeight: "500",
                color: "#6B7280",
                cursor: "pointer",
                borderBottom: "2px solid transparent",
              }}
            >
              Chat
            </div>
            <div
              style={{
                flex: 1,
                padding: "12px 16px",
                textAlign: "center",
                fontSize: "16px",
                fontWeight: "600",
                color: "#6366F1",
                cursor: "pointer",
                borderBottom: "3px solid #6366F1",
                background: "#F8FAFC",
              }}
            >
              Participants
            </div>
          </div>

          {/* Participants Content */}
          <div
            style={{
              padding: "16px 0",
              height: "calc(100% - 60px)",
              overflowY: "auto",
            }}
          >
            {/* Name Header */}
            <div
              style={{
                padding: "0 20px 12px 20px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#6B7280",
                borderBottom: "1px solid #E5E7EB",
                marginBottom: "16px",
              }}
            >
              Name
            </div>

            {/* Participants List */}
            {students.length === 0 ? (
              <div
                style={{
                  padding: "20px",
                  textAlign: "center",
                  color: "#6B7280",
                  fontSize: "14px",
                }}
              >
                No participants connected
              </div>
            ) : (
              <div style={{ padding: "0 20px" }}>
                {students.map((studentName, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 0",
                      borderBottom:
                        index < students.length - 1
                          ? "1px solid #F3F4F6"
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      {/* Avatar Circle */}
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #6366F1, #8B5CF6)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        {studentName.charAt(0).toUpperCase()}
                      </div>

                      {/* Student Name */}
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: "500",
                          color: "#111827",
                        }}
                      >
                        {studentName}
                      </span>
                    </div>

                    {/* Kick Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("=== KICK BUTTON CLICKED ===");
                        console.log("Button clicked for student:", studentName);
                        console.log("Event:", e);
                        handleKickStudent(studentName);
                        console.log("===========================");
                      }}
                      style={{
                        background: "#EF4444",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "6px 12px",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = "#DC2626";
                        e.target.style.transform = "scale(1.05)";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = "#EF4444";
                        e.target.style.transform = "scale(1)";
                      }}
                    >
                      Kick
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* View Poll History Button */}
      <button
        onClick={() => {
          console.log("View Poll History clicked!");
          console.log("onShowHistory function:", onShowHistory);
          console.log("Current poll data:", pollData);
          onShowHistory();
        }}
        style={{
          position: "absolute",
          top: "62px",
          left: "1120px",
          background: "#8F64E1",
          height: "53px",
          width: "267px",
          borderRadius: "9999px",
          border: "none",
          color: "white",
          fontSize: "16px",
          fontWeight: "500",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        <svg
          style={{ width: "20px", height: "20px" }}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path
            fillRule="evenodd"
            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
            clipRule="evenodd"
          />
        </svg>
        View Poll history
      </button>

      {/* Question Title */}
      <div
        style={{
          position: "absolute",
          width: "105px",
          height: "28px",
          top: "269px",
          left: "364px",
          fontSize: "24px",
          fontWeight: "bold",
          color: "black",
        }}
      >
        Question
      </div>

      {/* Question Box */}
      <div
        style={{
          position: "absolute",
          top: "322px",
          left: "357px",
          width: "727px",
          height: "50px",
          background: "linear-gradient(to right, #343434, #6E6E6E)",
          borderRadius: "8px 8px 0 0",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
        }}
      >
        <h3
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "white",
            margin: 0,
          }}
        >
          {pollData.question}
        </h3>
      </div>

      {/* Results Container - Same positioning as StudentPollResults */}
      <div
        style={{
          position: "absolute",
          top: "372px", // Just below question box
          left: "357px",
          width: "727px",
          height: "293px", // Fixed height like image
          border: "1px solid #AF8FF1",
          backgroundColor: "white",
          padding: "12px 14px",
          borderRadius: "0 0 8px 8px",
        }}
      >
        {pollData.options.map((option, index) => {
          const percentage =
            totalVotes > 0 ? Math.round((option.count / totalVotes) * 100) : 0;

          return (
            <div
              key={option.id}
              style={{
                width: "100%",
                height: "53px",
                borderRadius: "9px",
                border: "1px solid #E5E7EB",
                background: "#F8F8F8",
                display: "flex",
                alignItems: "center",
                padding: "0 14px",
                gap: "14px",
                marginBottom:
                  index < pollData.options.length - 1 ? "14px" : "0",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Progress Bar Background */}
              <div
                style={{
                  position: "absolute",
                  left: "0px",
                  top: "0px",
                  height: "53px",
                  width: `${percentage}%`, // Actual percentage only
                  background: "#7765DA",
                  borderRadius: "9px",
                  transition: "width 0.8s ease",
                  zIndex: 1,
                }}
              ></div>

              {/* Number Circle */}
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "white",
                  color: "#7567D9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: "500",
                  position: "relative",
                  zIndex: 2,
                  border: "2px solid #7567D9",
                }}
              >
                {index + 1}
              </div>

              {/* Option Text */}
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  color: percentage > 15 ? "white" : "#111827", // White text when progress bar is wide enough
                  position: "relative",
                  zIndex: 3,
                  flex: 1,
                }}
              >
                {option.text}
              </span>

              {/* Percentage */}
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: percentage > 15 ? "white" : "#111827", // White text when progress bar is wide enough
                  position: "relative",
                  zIndex: 3,
                  minWidth: "40px",
                  textAlign: "right",
                }}
              >
                {percentage}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Ask New Question Button */}
      <button
        onClick={() => {
          console.log("Ask New Question clicked!");
          console.log("onAskNewQuestion function:", onAskNewQuestion);
          onAskNewQuestion();
        }}
        style={{
          position: "absolute",
          top: "704px",
          left: "785px",
          background: "linear-gradient(to right, #8F64E1, #1D68BD)",
          height: "58px",
          width: "306px",
          borderRadius: "9999px",
          border: "none",
          color: "white",
          fontSize: "16px",
          fontWeight: "600",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        <span style={{ fontSize: "18px" }}>+</span>
        Ask a new question
      </button>

      {/* Floating Message Button - Bottom Right */}
      <button
        onClick={() => setShowParticipants(!showParticipants)}
        style={{
          position: "fixed",
          bottom: "32px",
          right: "32px",
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background: "#1D68BD",
          border: "none",
          color: "white",
          cursor: "pointer",
          boxShadow: "0 8px 25px rgba(99, 102, 241, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => {
          e.target.style.transform = "scale(1.1)";
          e.target.style.boxShadow = "0 12px 35px rgba(99, 102, 241, 0.4)";
        }}
        onMouseOut={(e) => {
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = "0 8px 25px rgba(99, 102, 241, 0.3)";
        }}
      >
        {/* Message/Chat Icon */}
        <svg
          style={{ width: "28px", height: "28px" }}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
        </svg>

        {/* Notification Badge - Show student count */}
        {students && students.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              background: "#EF4444",
              color: "white",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: "600",
              border: "2px solid white",
            }}
          >
            {students.length}
          </div>
        )}
      </button>
    </div>
  );
};

export default TeacherPollResults;
