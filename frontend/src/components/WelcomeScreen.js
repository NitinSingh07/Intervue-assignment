import React, { useState } from "react";

const WelcomeScreen = ({ onRoleSelect }) => {
  const [selectedRole, setSelectedRole] = useState("student"); // Default to student as shown in design

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl mx-auto">
        {/* Branding Tag */}
        <div className="flex justify-center pt-8">
          <div
            className=" text-white px-4 py-2 rounded-full flex items-center gap-2"
            style={{
              background: "linear-gradient(to right, #7565D9, #4D0ACD)",
              width: "137px",
              height: "31px",
            }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                clipRule="evenodd"
              />
            </svg>
            <span
              className="font-medium font-sans"
              style={{
                fontSize: "14px",
                fontWeight: "600",
                width: "134px",
                height: "18px",
              }}
            >
              Intervue Poll
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-20 text-center" style={{}}>
          <h1
            className="text-gray-900 mb-4 text-center justify-center  leading-tight"
            style={{
              fontSize: "40px",
              fontWeight: "400",
              width: "737px",
              top: "289px",
              left: "243px",
              height: "30px",
            }}
          >
            Welcome to the{" "}
            <span
              className="font-black"
              style={{
                fontSize: "40px",
                fontWeight: "600",
                width: "737px",
                height: "30px",
              }}
            >
              Live Polling System
            </span>
          </h1>
          <p className="text-lg text-gray-600 mb-12  mx-auto font-normal">
            Please select the role that best describes you to begin using the
            live polling system
          </p>

          {/* Role Selection Cards */}
          <div className="flex gap-6 justify-center mb-12 max-w-4xl mx-auto">
            {/* Student Card */}
            <div
              className={`bg-white border-2 ${
                selectedRole === "student"
                  ? "border-blue-500"
                  : "border-gray-300"
              } rounded-2xl p-6 flex-1 max-w-md cursor-pointer hover:shadow-lg transition-all text-left`}
              onClick={() => handleRoleSelect("student")}
            >
              <h3 className="text-lg font-bold text-black mb-3">
                I'm a Student
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry
              </p>
            </div>

            {/* Teacher Card */}
            <div
              className={`bg-white border-2 ${
                selectedRole === "teacher"
                  ? "border-blue-500"
                  : "border-gray-300"
              } rounded-2xl p-6 flex-1 max-w-md cursor-pointer hover:shadow-lg transition-all text-left`}
              onClick={() => handleRoleSelect("teacher")}
            >
              <h3 className="text-lg font-bold text-black mb-3">
                I'm a Teacher
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Submit answers and view live poll results in real-time.
              </p>
            </div>
          </div>

          {/* Continue Button */}
          <button
            className=" text-white font-bold text-lg px-12 py-4 rounded-full hover:shadow-lg transition-shadow font-sans"
            onClick={() => onRoleSelect(selectedRole)}
            style={{
              background: "linear-gradient(to right, #8F64E1, #1D68BD)",
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
