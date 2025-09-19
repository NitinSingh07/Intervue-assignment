import React from "react";

const KickedOutScreen = ({ onBack }) => {
  console.log("=== KICKED OUT SCREEN RENDERED ===");
  console.log("onBack function:", onBack);
  console.log("================================");

  return (
    <div className="fixed inset-0 bg-white">
      {/* Branding Tag */}
      <div
        style={{
          position: "absolute",
          top: "382px",
          left: "643px",
          height: "31px",
          width: "154px",
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
          <span style={{ fontWeight: "500" }}>Intervue Poll</span>
        </div>
      </div>

      {/* Main Content Container */}
      <div
        style={{
          position: "absolute",
          top: "439px",
          left: "230px",
          width: "981px",
          height: "103px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "36px",
            fontWeight: "400",
            color: "#111827",
            marginBottom: "16px",
            margin: "0 0 16px 0",
          }}
        >
          You've been Kicked out !
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "#6B7280",
            margin: "0",
            lineHeight: "1.5",
          }}
        >
          Looks like the teacher had removed you from the poll system .Please
        </p>
        <p
          style={{
            fontSize: "16px",
            color: "#6B7280",
            margin: "0",
            lineHeight: "1.5",
          }}
        >
          Try again sometime.
        </p>
      </div>
    </div>
  );
};

export default KickedOutScreen;
