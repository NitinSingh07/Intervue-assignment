import React from "react";

const WelcomeScreen = ({ onRoleSelect }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl mx-auto">
        {/* Branding Tag */}
        <div className="flex justify-center pt-8">
          <div
            className="bg-primary-500 text-white px-4 py-2 rounded-full flex items-center gap-2"
            style={{
              background: "linear-gradient(to right, #7567D9, #4D0ACD)",
            }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium font-sans">Intervue Poll</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-8 py-12 text-center">
          <h1 className="text-4xl font-normal text-gray-900 mb-4 text-center leading-tight">
            Welcome to the{" "}
            <span className="font-black">Live Polling System</span>
          </h1>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto font-sans">
            Please select the role that best describes you to begin using the
            live polling system
          </p>

          {/* Role Selection Cards */}
          <div className="flex gap-6 justify-center mb-12 max-w-4xl mx-auto">
            {/* Student Card - Default selected as shown in image */}
            <div
              className="bg-white border-2 border-blue-500 rounded-2xl p-6 flex-1 max-w-md cursor-pointer hover:shadow-lg transition-all text-left"
              onClick={() => onRoleSelect("student")}
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
              className="bg-white border border-gray-300 rounded-2xl p-6 flex-1 max-w-md cursor-pointer hover:shadow-lg transition-all text-left"
              onClick={() => onRoleSelect("teacher")}
            >
              <h3 className="text-lg font-bold text-black mb-3">
                I'm a Teacher
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Submit answers and view live poll results in real-time.
              </p>
            </div>
          </div>

          {/* Continue Button - Always enabled as shown in image */}
          <button
            className=" text-white font-bold text-lg px-12 py-4 rounded-full hover:shadow-lg transition-shadow font-sans"
            onClick={() => onRoleSelect("student")}
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
