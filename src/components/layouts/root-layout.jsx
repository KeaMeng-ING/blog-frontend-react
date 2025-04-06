import Header from "./Header";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthContext } from "../../hook/useAuthContext";

export default function RootLayout() {
  const [darkMode, setDarkMode] = useState(true);
  const { user } = useAuthContext();

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  return (
    <>
      <Header
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        loggedIn={user ? true : false}
      />
      <Outlet />
    </>
  );
}
