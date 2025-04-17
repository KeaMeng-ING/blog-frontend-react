import React from "react";

const ErrorMessage = ({ error }) => {
  return (
    <div class="flex items-center justify-center min-h-screen bg-my-primary">
      <div class="flex flex-col items-center p-6 bg-white rounded-2xl shadow-xl">
        <div class="text-red-600 bg-my-primary-100 rounded-full p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-24 h-24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <p class="mt-4 text-xl font-semibold text-red-700">{error}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;
