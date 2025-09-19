import React from "react";

const StudentPollResults = ({ pollData }) => {
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
        </div>
      </div>
    );
  }

  const totalVotes = pollData.options.reduce(
    (sum, option) => sum + option.count,
    0
  );

  console.log("=== VOTING RESULTS DEBUG ===");
  console.log("Poll Data:", pollData);
  console.log("Total Votes:", totalVotes);
  console.log(
    "Options with counts:",
    pollData.options.map((opt) => ({ text: opt.text, count: opt.count }))
  );
  console.log("============================");

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
          00:00
        </span>
      </div>

      {/* Question Box */}
      <div
        style={{
          position: "absolute",
          top: "275px",
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

      {/* Results Container - Same positioning as options */}
      <div
        style={{
          position: "absolute",
          top: "319px", // Just below question box
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

      {/* Wait Message */}
      <div
        style={{
          position: "absolute",
          top: "650px",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "18px",
          fontWeight: "500",
          color: "#111827",
          textAlign: "center",
        }}
      >
        Wait for the teacher to ask a new question..
      </div>
    </div>
  );
};

export default StudentPollResults;
