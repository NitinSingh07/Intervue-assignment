import React, { useState } from "react";

const StudentNameScreen = ({ onSubmit }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-white">
      {/* Branding Tag - Frame 427319795 specs */}
      <div
        style={{
          position: "absolute",
          top: "253px",
          left: "643px",
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

      {/* Main Title - Frame 2 specs */}
      <div
        style={{
          position: "absolute",
          top: "310px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "737px",
          height: "50px",
          fontSize: "40px",
          fontWeight: "400",
          color: "#000000",
          textAlign: "center",
          lineHeight: "100%",
          letterSpacing: "0%",
        }}
      >
        Let's <span style={{ fontWeight: "600" }}>Get Started</span>
      </div>

      {/* Description Text - Frame 3 specs */}
      <div
        style={{
          position: "absolute",
          top: "372px",
          left: "339.53px",
          width: "762px",
          height: "69px",
          fontSize: "19px",
          fontWeight: "400",
          color: "black",
          textAlign: "center",
          lineHeight: "25px",
        }}
      >
        If you're a student, you'll be able to{" "}
        <span style={{ fontWeight: "600" }}>submit your answers</span>,
        participate in live polls, and see how your responses compare with your
        classmates
      </div>

      {/* Enter your Name Label - Frame 427320128 specs */}
      <div
        style={{
          position: "absolute",
          top: "472px",
          left: "483.53px",
          fontSize: "16px",
          fontWeight: "500",
          color: "black",
        }}
      >
        Enter your Name
      </div>

      {/* Name Input - Frame 427320128 specs */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Rahul Bajaj"
          style={{
            position: "absolute",
            top: "507px",
            left: "483.53px",
            width: "507px",
            height: "60px",
            background: "#F5F5F5",
            border: "none",
            padding: "0 20px",
            fontSize: "16px",
            fontWeight: "400",
            color: "black",
            outline: "none",
            boxSizing: "border-box",
          }}
          required
        />

        {/* Continue Button - Group 289665 specs */}
        <button
          type="submit"
          style={{
            position: "absolute",
            top: "613px",
            left: "611.53px",
            width: "233.93px",
            height: "57.58px",
            background: "linear-gradient(to right, #8F64E1, #1D68BD)",
            color: "white",
            border: "none",
            borderRadius: "34px",
            fontSize: "18px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default StudentNameScreen;
