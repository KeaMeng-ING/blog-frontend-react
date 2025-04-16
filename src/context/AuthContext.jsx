import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on page load
    const loadUser = () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        // Set axios default headers
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(JSON.parse(storedUser));
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, setLoading, setUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
