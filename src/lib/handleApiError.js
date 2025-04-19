export const handleApiError = (error, logout, setError) => {
  if (error.response?.data === "Forbidden") {
    logout(); // Log the user out if the error is "Forbidden"
  } else {
    console.error("API Error:", error);
    if (setError) {
      setError("An error occurred. Please try again later.");
    }
  }
};
