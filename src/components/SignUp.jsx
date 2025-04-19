import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "../hook/useAuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const { loading, setLoading, setUser } = useAuthContext();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    console.log(userName);

    try {
      const response = await axios.post(
        "https://blog-backend-0th4.onrender.com/api/users/signup",
        { firstName, lastName, userName, email, password }
      );

      console.log(response.data);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: response.data.id,
          firstName: response.data.firstName,
          imageUrl: response.data.imageUrl,
          userName: response.data.username,
        })
      );

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;

      setUser({
        firstName: response.data.firstName,
        id: response.data.id,
        userName: response.data.username,
        imageUrl: response.data.imageUrl,
      });

      navigate("/");
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || "Registration failed");
      } else {
        setError("An error occurred during registration. Please try again.");
        console.error("Signup error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-my-primary h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md">
        <div className="bg-black text-white p-6 text-center">
          <h1 className="text-2xl font-bold">CREATE AN ACCOUNT</h1>
        </div>
        <form onSubmit={handleSubmit} className="grid w-full px-6 gap-4 mt-7">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="font-bold text-black" htmlFor="firstName">
                First Name
              </label>
              <input
                className="py-2 px-2 outline-my-primary border-2 border-black rounded-sm"
                type="text"
                id="firstName"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <label className="font-bold text-black" htmlFor="lastName">
                Last Name
              </label>
              <input
                className="py-2 px-2 outline-my-primary border-2 border-black rounded-sm"
                type="text"
                id="lastName"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <label className="font-bold text-black" htmlFor="userName">
              Username
            </label>
            <input
              className="py-2 px-2 outline-my-primary border-2 border-black rounded-sm"
              type="text"
              id="userName"
              placeholder="johndoe123"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="font-bold text-black" htmlFor="email">
              Email
            </label>
            <input
              className="py-2 px-2 outline-my-primary border-2 border-black rounded-sm"
              type="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="font-bold text-black" htmlFor="password">
              Password
            </label>
            <input
              className="py-2 px-2 outline-my-primary border-2 border-black rounded-sm"
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="font-bold text-black" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              className="py-2 px-2 outline-my-primary border-2 border-black rounded-sm"
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="bg-black text-white w-full py-3 rounded-lg font-bold hover:bg-gray-800 focus:ring-4 focus:ring-my-primary transition-all"
            >
              {loading ? "SIGNING UP..." : "SIGN UP"}
            </button>
          </div>
        </form>

        <div className="h-[1px] bg-gray-300 my-5"></div>
        <p className="text-center m-5 font-bold text-black">
          Already have an account?
          <NavLink to="/sign-in">
            <span className="text-my-primary cursor-pointer"> Log In</span>
          </NavLink>
        </p>
      </div>
    </div>
  );
}
