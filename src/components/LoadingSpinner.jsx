import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-[400px] bg-white  text-gray-900 dark:text-gray-100">
      <div className="w-12 h-12 rounded-full border-4 border-my-primary border-t-transparent animate-spin mb-4"></div>
      <h2 className="text-xl font-semibold text-my-primary">Loading</h2>
      <p className="text-black  mt-1">
        Please wait... This may take slightly longer if it's your first visit.
      </p>
    </div>
  );
};

export default LoadingSpinner;
