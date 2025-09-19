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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto text-center">
        {/* Branding Tag */}
        <div className="mb-12">
          <div
            className="text-white px-6 py-2 rounded-full inline-flex items-center gap-2"
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
            <span className="font-medium">Intervue Poll</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Let's Get Started
          </h1>
          <p className="text-base text-gray-600 mb-12 max-w-md mx-auto leading-relaxed">
            If you're a student, you'll be able to{" "}
            <span className="font-bold text-gray-900">submit your answers</span>
            , participate in live polls, and see how your responses compare with
            your classmates
          </p>
        </div>

        {/* Name Input Form */}
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
          <div className="text-left mb-6">
            <label className="block text-base font-medium text-gray-900 mb-2">
              Enter your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Rahul Bajaj"
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 text-base placeholder-gray-500"
              style={{ "--tw-ring-color": "#5767D0" }}
              required
            />
          </div>

          <button
            type="submit"
            className="text-white font-medium text-base px-8 py-3 rounded-full hover:shadow-lg transition-all w-1/2"
            style={{
              background: "linear-gradient(to right, #7765DA, #5767D0)",
            }}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentNameScreen;
