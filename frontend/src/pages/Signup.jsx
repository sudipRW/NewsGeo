import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import eye from "../assets/eye.png";
import closeEye from "../assets/close-eye.png";
import NewsGeoLogo from "../assets/logo.jpg";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const passwordPattern = /^(?=.*\d)(?=.*[.!@#$%^&*])(?=.*[A-Z]).{8,}$/;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() && !password.trim() && !confirmPassword.trim()) {
      setError("All fields are required");
      return;
    }

    if (!email.match(emailPattern)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password.match(passwordPattern)) {
      setError(
        "Password must contain at least 8 characters, one uppercase, one number, and one special character"
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    axios
      .post("http://localhost:3001/signup", { email, password })
      .then((res) => {
        setSuccessMessage(
          "Account created successfully. Please Sign in to continue"
        );
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/signin");
        }, 2000);
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError("An error occurred. Please try again later.");
        }
      });
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleConfirmPasswordPaste = (e) => {
    e.preventDefault();
  };

  return (
    <div className="signup flex justify-center items-center h-screen bg-white">
      <img
        src={NewsGeoLogo}
        alt="Logo"
        className="absolute top-0 right-0 mt-4 mr-4"
      />
      <form onSubmit={handleSubmit} className="p-8 w-96 flex flex-col" noValidate>
        <h2 className="text-2xl font-bold mb-4 text-left">Sign Up</h2>
        <p className="text-[#a7a7a7] text-left pb-8">
          Sign up to build the backbone of a system that captures the pulse of
          global events.
        </p>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {successMessage && (
          <p className="text-green-500 mb-4">{successMessage}</p>
        )}
        <div className="mb-4">
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`form-input mt-1 block w-full rounded shadow-[0_3px_10px_rgb(0,0,0,0.2)] ${
              error && !email.match(emailPattern)
                ? "border-red-500 border-2"
                : "border-gray-500"
            } px-4 py-2`}
            placeholder="Email"
          />
        </div>
        <div className="mb-4">
          <div className="relative">
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`form-input mt-1 block w-full rounded shadow-[0_3px_10px_rgb(0,0,0,0.2)] ${
                error && !password.match(passwordPattern)
                  ? "border-red-500 border-2"
                  : "border-gray-500"
              } px-4 py-2`}
              placeholder="Password"
            />
          </div>
        </div>
        <div className="mb-6">
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onPaste={handleConfirmPasswordPaste}
              className={`form-input mt-1 block w-full rounded shadow-[0_3px_10px_rgb(0,0,0,0.2)] ${
                error && password !== confirmPassword
                  ? "border-red-500 border-2"
                  : "border-gray-500"
              } px-4 py-2`}
              placeholder="Confirm Password"
            />
            <button
              type="button"
              className="absolute top-2 right-2 text-gray-500"
              onClick={toggleShowConfirmPassword}
            >
              {showConfirmPassword ? (
                <img
                  src={eye}
                  style={{ width: "20px", height: "20px" }}
                  alt="Hide"
                />
              ) : (
                <img
                  src={closeEye}
                  style={{ width: "20px", height: "20px" }}
                  alt="Show"
                />
              )}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="bg-black text-white font-bold py-2 px-7 rounded text-center self-center"
        >
          Sign up
        </button>
        <p className="text-[#a7a7a7] py-5 ">
          Already have an account?{" "}
          <Link to="/signin" className="text-black font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
