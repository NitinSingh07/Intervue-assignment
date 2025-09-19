import React, { useState, useEffect } from "react";

const StudentPollInterface = ({ socket, pollData, userName }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    if (pollData) {
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
  }, [pollData]);

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

  if (!pollData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg mx-auto text-center">
          {/* Branding Tag */}
          <div className="mb-16">
            <div
              className="text-white px-6 py-2 rounded-full inline-flex items-center gap-2"
              style={{ backgroundColor: "#5767D0" }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">Intervue Poll</span>
            </div>
          </div>

          {/* Loading Spinner */}
          <div className="mb-12">
            <div
              className="animate-spin rounded-full h-20 w-20 border-4 border-transparent mx-auto mb-8"
              style={{
                borderTopColor: "#5767D0",
                borderRightColor: "#5767D0",
              }}
            ></div>
            <h2 className="text-2xl font-bold text-black mb-4">
              Wait for the teacher to ask questions..
            </h2>
          </div>

          {/* Chat Icon */}
          {/* <div className="fixed bottom-8 right-8">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
              style={{ backgroundColor: "#5767D0" }}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
          </div> */}
        </div>
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
