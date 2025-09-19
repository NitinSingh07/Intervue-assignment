import React, { useState, useEffect } from "react";

const StudentPollInterface = ({ socket, pollData, userName }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);

  // Check if poll is active and not revealed
  const isPollActive =
    pollData &&
    !pollData.revealed &&
    pollData.endsAt &&
    Date.now() < pollData.endsAt;

  useEffect(() => {
    if (isPollActive) {
      // Calculate remaining time from endsAt (more accurate than duration)
      let teacherTime = 15; // default

      if (pollData.endsAt) {
        // Calculate remaining seconds from endsAt timestamp
        const remaining = Math.max(
          0,
          Math.ceil((pollData.endsAt - Date.now()) / 1000)
        );
        teacherTime = remaining;
      } else {
        // Fallback to duration fields
        teacherTime =
          pollData.durationSec ||
          pollData.timer ||
          pollData.duration ||
          pollData.timeLimit ||
          pollData.time ||
          15;
      }

      console.log("=== TIMER DEBUG ===");
      console.log("Full pollData:", pollData);
      console.log("pollData.endsAt:", pollData.endsAt);
      console.log("Current time:", Date.now());
      console.log("Calculated remaining time:", teacherTime);
      console.log("==================");

      // Force update timer every second with real remaining time
      const updateInterval = setInterval(() => {
        if (pollData.endsAt) {
          const remaining = Math.max(
            0,
            Math.ceil((pollData.endsAt - Date.now()) / 1000)
          );
          setTimeLeft(remaining);
          if (remaining <= 0) {
            clearInterval(updateInterval);
          }
        }
      }, 100); // Update every 100ms for accuracy
      setTimeLeft(teacherTime);

      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(interval);
        clearInterval(updateInterval);
      };
    }
  }, [isPollActive, pollData]);

  const handleOptionSelect = (optionId) => {
    if (!hasAnswered && timeLeft > 0) {
      setSelectedOption(optionId);
    }
  };

  const handleSubmit = () => {
    if (selectedOption && !hasAnswered) {
      socket.emit("answer", { optionId: selectedOption });
      setHasAnswered(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Show loading screen if no active poll is available
  if (!isPollActive) {
    return (
      <div className="fixed inset-0 bg-white">
        {/* Branding Tag - Frame 427319795 specs */}
        <div
          style={{
            position: "absolute",
            top: "359px",
            left: "667px",
            width: "134px",
            height: "31px",
          }}
        >
          <div
            style={{
              background: "linear-gradient(to right, #7565D9, #4D0ACD)",
              color: "white",
              padding: "9px 9px",
              borderRadius: "24px",
              display: "flex",
              alignItems: "center",
              gap: "7px",
              height: "100%",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <svg
              style={{ width: "16px", height: "16px" }}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                clipRule="evenodd"
              />
            </svg>
            <span style={{ fontWeight: "600", fontSize: "14px" }}>
              Intervue Poll
            </span>
          </div>
        </div>

        {/* Loading Spinner - Ellipse 1022 specs */}
        <div
          style={{
            position: "absolute",
            top: "430px",
            left: "706px",
            width: "57px",
            height: "58px",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              border: "4px solid transparent",
              borderTop: "4px solid #500ECE",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          ></div>
        </div>

        {/* Wait Message - Text specs */}
        <div
          style={{
            position: "absolute",
            top: "522px",
            left: "366px",
            width: "737px",
            height: "42px",
            fontSize: "33px",
            fontWeight: "600",
            color: "#000000",
            textAlign: "center",
            lineHeight: "100%",
            letterSpacing: "0%",
          }}
        >
          Wait for the teacher to ask questions..
        </div>

        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white">
      {/* Question Number */}
      <div
        style={{
          position: "absolute",
          top: "216px",
          left: "357px",
          fontSize: "24px",
          fontWeight: "bold",
          color: "black",
        }}
      >
        Question {pollData.questionNumber || 1}
      </div>

      {/* Timer */}
      <div
        style={{
          position: "absolute",
          top: "215px",
          left: "535px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "#EF4444",
        }}
      >
        <svg
          style={{ width: "20px", height: "20px" }}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "18px",
            color: "#EF4444",
          }}
        >
          {formatTime(timeLeft)}
        </span>
      </div>

      {/* Question Box */}
      <div
        style={{
          position: "absolute",
          top: "269px",
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

      {/* Options Container - No extra space */}
      <div
        style={{
          position: "absolute",
          top: "319px", // Just below question box
          left: "357px",
          width: "727px",
          height: "293px", // Dynamic height based on options
          border: "1px solid #AF8FF1",
          backgroundColor: "white",
          padding: "12px 14px",
          borderRadius: "0 0 8px 8px",
        }}
      >
        {pollData.options.map((option, index) => (
          <div
            key={option.id}
            onClick={() => handleOptionSelect(option.id)}
            style={{
              width: "100%",
              height: "53px",
              borderRadius: "9px",
              border:
                selectedOption === option.id
                  ? "2px solid #A855F7"
                  : "1px solid #E5E7EB",
              background: selectedOption === option.id ? "white" : "#F8F8F8",
              display: "flex",
              alignItems: "center",
              padding: "0 14px",
              gap: "14px",
              cursor: hasAnswered ? "not-allowed" : "pointer",
              opacity: hasAnswered ? 0.5 : 1,
              marginBottom: index < pollData.options.length - 1 ? "14px" : "0",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "linear-gradient(to right, #7567D9, #4D0ACD)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              {index + 1}
            </div>
            <span
              style={{
                fontSize: "16px",
                fontWeight: "500",
                color: "#111827",
              }}
            >
              {option.text}
            </span>
          </div>
        ))}
      </div>

      {/* Submit Button - Positioned to not overlap */}
      {!hasAnswered && (
        <button
          onClick={handleSubmit}
          disabled={!selectedOption || timeLeft === 0}
          style={{
            position: "absolute",
            top: "651px",
            left: "850px",
            background: "linear-gradient(to right, #8F64E1, #1D68BD)",
            width: "233.93px",
            height: "57.58px",
            borderRadius: "34px",
            border: "none",
            color: "white",
            fontSize: "16px",
            fontWeight: "600",
            cursor:
              !selectedOption || timeLeft === 0 ? "not-allowed" : "pointer",
            opacity: !selectedOption || timeLeft === 0 ? 0.5 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Submit
        </button>
      )}
    </div>
  );
};

export default StudentPollInterface;
