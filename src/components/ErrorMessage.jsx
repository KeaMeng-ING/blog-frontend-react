import React from "react";

const ErrorMessage = ({ error }) => {
  return (
    <div class="flex items-center justify-center min-h-screen bg-my-primary">
      <div class="flex flex-col items-center p-6 bg-white rounded-2xl shadow-xl">
        <div class="text-red-600 bg-my-primary-100 rounded-full p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-24 h-24" // Use [className](http://_vscodecontentref_/6) instead of [class](http://_vscodecontentref_/7)
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2" // Use `strokeWidth` instead of [stroke-width](http://_vscodecontentref_/8)
          >
            <path
              strokeLinecap="round" // Use `strokeLinecap` instead of [stroke-linecap](http://_vscodecontentref_/9)
              strokeLinejoin="round" // Use `strokeLinejoin` instead of [stroke-linejoin](http://_vscodecontentref_/10)
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
