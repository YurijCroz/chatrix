import React, { useState } from "react";
import api from "../api/axiosConfig";

export const LoginRegistration = ({
  setIsOpen,
}: {
  setIsOpen: (open: boolean) => void;
}) => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const endpoint = isLoginMode ? "/chat/login" : "/chat/registration";
      const payload = isLoginMode
        ? { email, password }
        : { firstName, email, password };

      const response = await api.post(endpoint, payload);
    } catch (error) {
      console.error(`${isLoginMode ? "Login" : "Registration"} failed:`, error);
    } finally {
      window.location.reload();
    }
  };

  return (
    <div className="loginRegistration">
      <h2 className="modalTitle">{isLoginMode ? "Login" : "Registration"}</h2>
      <form className="modalForm" onSubmit={handleSubmit}>
        {!isLoginMode && (
          <div className="inputGroup">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required={!isLoginMode}
              className="modalInput"
            />
          </div>
        )}
        <div className="inputGroup">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="modalInput"
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="modalInput"
          />
        </div>
        <button type="submit" className="submitButton">
          {isLoginMode ? "Login" : "Register"}
        </button>
      </form>
      <button
        onClick={() => setIsLoginMode(!isLoginMode)}
        className="toggleButton"
      >
        Switch to {isLoginMode ? "Registration" : "Login"}
      </button>
      <button onClick={() => setIsOpen(false)} className="closeButton">
        Close
      </button>
    </div>
  );
};
