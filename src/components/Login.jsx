import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "../hook/useAuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { loading, setLoading, setUser } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://blog-backend-0th4.onrender.com/api/users/login",
        { email, password }
      );

      console.log(response.data);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: response.data.id,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          imageUrl: response.data.imageUrl,
          userName: response.data.username,
        })
      );

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;

      setUser({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        id: response.data.id,
        userName: response.data.username,
        imageUrl: response.data.imageUrl,
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("An error occurred during login. Please try again.");
        console.error("Login error:", error);
      }
    } finally {
      setLoading(false);
      navigate("/");
    }
  };
  return (
    <div className="bg-my-primary h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md">
        <div className="bg-black text-white p-6 text-center">
          <h1 className="text-2xl font-bold">LOGIN YOUR ACCOUNT</h1>
        </div>
        <form onSubmit={handleSubmit} className="grid w-full px-6 gap-4 mt-7">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
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
            <label className="font-bold mt-2 text-black" htmlFor="password">
              Password
            </label>
            <input
              className="py-2 px-2 outline-my-primary border-2 border-black rounded-sm"
              type="password"
              id="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <NavLink href="/forgot-password">
            <p className="text-my-primary font-bold text-right my-1">
              Forgot password?
            </p>
          </NavLink>
          <div>
            <button
              type="submit"
              className="bg-black text-white w-full py-3 rounded-lg font-bold hover:bg-gray-800 focus:ring-4 focus:ring-my-primary transition-all"
            >
              {loading ? "LOGGING IN..." : "LOG IN"}
            </button>
          </div>
        </form>

        <div className="h-[1px] bg-gray-300 my-5"></div>
        <div className="px-6"></div>
        <p className="text-center m-5 font-bold text-black">
          Don&apos;t have an account?
          <NavLink to="/sign-up">
            <span className="text-my-primary cursor-pointer"> Sign Up</span>
          </NavLink>
        </p>
      </div>
    </div>
  );
}
