import React from "react";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "../../hook/useAuthContext";

export default function Navbar() {
  const { user, logout } = useAuthContext();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="px-5 py-3 bg-white shadow-sm font-poppins">
      <nav className="flex justify-between items-center">
        <NavLink to="/">
          <img src="/logo.png" alt="logo" className="w-30" />
        </NavLink>
        <div className="flex items-center gap-5 text-black">
          {user ? (
            <>
              <NavLink to="/blog/create">
                <span className="font-bold ">Create</span>
              </NavLink>

              <NavLink
                className="font-bold cursor-pointer"
                onClick={handleLogout}
                to={"/"}
              >
                <span className="font-bold cursor-pointer">Log Out</span>
              </NavLink>

              {/* TODO: TO be Update */}
              <NavLink href="#">
                <span className="font-bold cursor-pointer">
                  {user.firstName}
                </span>
              </NavLink>
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
