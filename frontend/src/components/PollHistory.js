import React from "react";

const PollHistory = ({ pollHistory, onBack }) => {
  console.log("=== POLL HISTORY COMPONENT DEBUG ===");
  console.log("PollHistory component rendered!");
  console.log("Received pollHistory:", pollHistory);
  console.log("pollHistory type:", typeof pollHistory);
  console.log("pollHistory is array:", Array.isArray(pollHistory));
  console.log("pollHistory length:", pollHistory?.length);
  console.log("Each poll in history:");
  pollHistory?.forEach((poll, index) => {
    console.log(`Poll ${index + 1}:`, {
      id: poll.id,
      question: poll.question,
      optionsCount: poll.options?.length,
      options: poll.options,
    });
  });
  console.log("onBack function:", onBack);
  console.log("===================================");

  const getTotalVotes = (options) => {
    return options.reduce((sum, option) => sum + option.count, 0);
  };

  return (
    <div className="fixed inset-0 bg-white">
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: "64px",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "32px",
          fontWeight: "bold",
          color: "black",
          textAlign: "center",
        }}
      >
        View Poll History
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        style={{
          position: "absolute",
          top: "62px",
          right: "48px",
          background: "#6B7280",
          color: "white",
          padding: "8px 24px",
          borderRadius: "8px",
          border: "none",
          fontSize: "16px",
          fontWeight: "500",
          cursor: "pointer",
        }}
      >
        Back
      </button>

      {/* Poll History Content */}
      <div
        style={{
          position: "absolute",
          top: "140px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "1000px",
          padding: "0 48px",
        }}
      >
        {!pollHistory || pollHistory.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: "#6B7280",
              fontSize: "18px",
              marginTop: "100px",
            }}
          >
            <p>No poll history available</p>
            <p style={{ fontSize: "14px", marginTop: "10px" }}>
              Debug: pollHistory = {JSON.stringify(pollHistory)}
            </p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "60px" }}
          >
            {pollHistory.map((poll, index) => {
              const totalVotes = getTotalVotes(poll.options);

              return (
                <div key={poll.id} style={{ width: "100%" }}>
                  {/* Question Title */}
                  <h3
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "black",
                      marginBottom: "24px",
                    }}
                  >
                    Question {index + 1}
                  </h3>

                  {/* Question Box */}
                  <div
                    style={{
                      width: "100%",
                      height: "60px",
                      backgroundColor: "#4B5563",
                      borderRadius: "8px 8px 0 0",
                      display: "flex",
                      alignItems: "center",
                      padding: "0 24px",
                      marginBottom: "0",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "20px",
                        fontWeight: "600",
                        color: "white",
                        margin: 0,
                      }}
                    >
                      {poll.question}
                    </h4>
                  </div>

                  {/* Results Container */}
                  <div
                    style={{
                      width: "100%",
                      border: "1px solid #E5E7EB",
                      backgroundColor: "white",
                      padding: "24px",
                      borderRadius: "0 0 8px 8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      {poll.options.map((option, optionIndex) => {
                        const percentage =
                          totalVotes > 0
                            ? Math.round((option.count / totalVotes) * 100)
                            : 0;

                        return (
                          <div
                            key={option.id}
                            style={{
                              width: "100%",
                              height: "48px",
                              borderRadius: "8px",
                              border: "1px solid #E5E7EB",
                              background: "#F8F8F8",
                              display: "flex",
                              alignItems: "center",
                              padding: "0 16px",
                              gap: "16px",
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
                                height: "48px",
                                width: `${percentage}%`,
                                background:
                                  "linear-gradient(to right, #7567D9, #4D0ACD)",
                                borderRadius: "8px",
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
                              {optionIndex + 1}
                            </div>

                            {/* Option Text */}
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: "500",
                                color: percentage > 15 ? "white" : "#111827",
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
                                color: percentage > 15 ? "white" : "#111827",
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
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PollHistory;
