import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "../../hook/useAuthContext";

export default function Navbar() {
  const { user, logout } = useAuthContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="px-5 py-3 bg-white shadow-sm font-poppins">
      <nav className="flex justify-between items-center">
        <NavLink to="/">
          <img src="/logo.png" alt="logo" className="w-20" />
        </NavLink>
        <div className="flex items-center gap-5 text-black">
          {user ? (
            <>
              <div className="relative" ref={dropdownRef}>
                <div
                  onClick={toggleDropdown}
                  className="cursor-pointer flex items-center"
                >
                  <img
                    src={user.imageUrl}
                    alt="Profile"
                    className="w-8 rounded-full h-8 object-cover"
                  />
                </div>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                    <NavLink
                      to={`/profile/${user.userName}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </NavLink>
                    <NavLink
                      to="http://localhost:5174/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Admin Page
                    </NavLink>
                    <NavLink
                      to="/blog/create"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Create Blog
                    </NavLink>

                    <NavLink
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Settings
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <NavLink to="/sign-in">
                <button className="font-bold cursor-pointer">Log In</button>
              </NavLink>
              <NavLink to="/sign-up">
                <button className="font-bold cursor-pointer">
                  Get Started
                </button>
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
