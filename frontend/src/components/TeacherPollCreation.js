import React, { useState } from "react";

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

const TeacherPollCreation = ({ socket, students, onPollCreated }) => {
  const [showParticipants, setShowParticipants] = React.useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [duration, setDuration] = useState(60);
  const [correctAnswers, setCorrectAnswers] = useState({});

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      const newCorrectAnswers = { ...correctAnswers };
      delete newCorrectAnswers[index];
      setCorrectAnswers(newCorrectAnswers);
    }
  };

  const handleCorrectAnswerChange = (optionIndex, isCorrect) => {
    setCorrectAnswers((prev) => ({
      ...prev,
      [optionIndex]: isCorrect,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validOptions = options.filter((opt) => opt.trim());
    if (question.trim() && validOptions.length >= 2) {
      socket.emit("create_poll", {
        question: question.trim(),
        options: validOptions,
        durationSec: duration,
      });
      onPollCreated();
    }
  };

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
    <div className="fixed inset-0 bg-white overflow-y-auto">
      {/* Chat/Participants Panel - Top Right - Only show when showParticipants is true */}
      {showParticipants && (
        <div
          style={{
            position: "fixed",
            bottom: "110px", // Above the floating button
            right: "32px", // Same right position as button
            width: "400px",
            height: "500px",
            background: "white",
            border: "2px solid #6366F1",
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
            {!students || students.length === 0 ? (
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

      <div className="max-w-[759px] pl-[123px] pt-[81px] min-h-[900px] relative">
        {/* Branding Tag */}
        <div className="mb-4">
          <div
            className="text-white px-4 py-1.5 rounded-full inline-flex items-center gap-2 text-sm"
            style={{
              background: "linear-gradient(to right, #7567D9, #4D0ACD)",
            }}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Intervue Poll</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="h-[100px] mb-4">
          <h1 className="text-3xl font-bold text-black mb-2">
            Let's Get Started
          </h1>
          <p className="text-base text-gray-600">
            you'll have the ability to create and manage polls, ask questions,
            and monitor your students' responses in real-time.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Question Input Section */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-lg font-medium text-black">
                Enter your question
              </label>
              <div className="relative inline-block">
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="appearance-none bg-gray-100 px-4 pr-8 py-2 rounded-lg text-base cursor-pointer"
                >
                  <option value={60}>60 seconds</option>
                  <option value={45}>45 seconds</option>
                  <option value={30}>30 seconds</option>
                  <option value={15}>15 seconds</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg h-[180px] relative">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Rahul Bajaj"
                maxLength={100}
                className="w-full h-full px-4 py-3 bg-transparent border-0 rounded-lg focus:outline-none resize-none text-base"
              />
              <div className="absolute bottom-2 right-3 text-sm text-gray-500">
                {question.length}/100
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Left Column - Edit Options */}
            <div>
              <label className="text-lg font-medium text-black mb-3 block">
                Edit Options
              </label>
              {options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 mb-2 bg-gray-100 rounded-lg"
                >
                  <div
                    className="w-8 h-8 text-white rounded-full flex items-center justify-center font-medium text-sm ml-2"
                    style={{
                      background: "linear-gradient(to right, #7567D9, #4D0ACD)",
                    }}
                  >
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder="Rahul Bajaj"
                    className="flex-1 px-3 py-2.5 bg-transparent border-0 rounded-lg focus:outline-none text-base"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addOption}
                className="text-[#5767D0] border border-[#5767D0] px-4 py-1.5 rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center gap-1 text-sm mt-2"
              >
                <span>+</span>
                Add More option
              </button>
            </div>

            {/* Right Column - Is it Correct */}
            <div>
              <label className="text-lg font-medium text-black mb-3 block">
                Is it Correct?
              </label>
              {options.map((_, index) => (
                <div key={index} className="mb-2 h-[44px] flex items-center">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${index}`}
                        id={`yes-${index}`}
                        checked={correctAnswers[index] === true}
                        onChange={() => handleCorrectAnswerChange(index, true)}
                        className="w-4 h-4"
                        style={{ accentColor: "#5767D0" }}
                      />
                      <label htmlFor={`yes-${index}`} className="text-base">
                        Yes
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${index}`}
                        id={`no-${index}`}
                        checked={correctAnswers[index] === false}
                        onChange={() => handleCorrectAnswerChange(index, false)}
                        className="w-4 h-4"
                        style={{ accentColor: "#5767D0" }}
                      />
                      <label htmlFor={`no-${index}`} className="text-base">
                        No
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Horizontal Line */}
          <div
            className="absolute w-full border-t border-gray-200"
            style={{ top: "730px" }}
          ></div>

          {/* Submit Button */}
          <button
            type="submit"
            className="text-white font-medium absolute hover:shadow-lg transition-all"
            style={{
              background: "linear-gradient(to right, #8F64E1, #1D68BD)",
              width: "233.93px",
              height: "57.58px",
              left: "1134px",
              top: "751px",
              borderRadius: "34px",
            }}
          >
            Ask Question
          </button>
        </form>
      </div>

      {/* Floating Message Button - Bottom Right */}
      {/* <button
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
        <svg
          style={{ width: "28px", height: "28px" }}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
        </svg>

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
      </button> */}
    </div>
  );
};

export default TeacherPollCreation;
