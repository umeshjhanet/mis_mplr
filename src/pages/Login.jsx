import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import { FaEye, FaUserLarge } from "react-icons/fa6";
import axios from "axios";
import { API_URL } from "./Api";
// import PasswordModal from './Components/PasswordModal';
import { ToastContainer } from "react-toastify";
import { useSearchParams } from "react-router-dom";
// import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);
  const [isLoading, setIsLoading] = useState(false);
  // const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // const params = new URLSearchParams(window.location.search);

  useEffect(
    () => {
      console.log("Full URL:", window.location.href); // Check the full URL
      console.log("Query Params:", window.location.search); // Check query string
      const token = searchParams.get("token"); // Get token from the URL
      // const token = localStorage.getItem('authToken');
      console.log("Retrieved token", token);
      if (token) {
        // If a token is present, validate it
        validateToken(token);
      }
    },
    [
      // searchParams, navigate
    ]
  );

  const validateToken = async (token) => {
    try {
      console.log("Sending token to backend:", token); // Log the token before sending

      // Send the token to the backend for validation
      const response = await axios.post(`${API_URL}/validate-token`, { token });

      if (response.data.valid) {
        // If token is valid, store it in localStorage
        console.log("Token validated, navigating to dashboard...");
        localStorage.setItem("authToken", token);
        navigate("/dashboard"); // Redirect to dashboard
      } else {
        console.log("Invalid token, redirecting to login...");
        navigate("/"); // Redirect to  if token is invalid
      }
    } catch (error) {
      console.error("Error validating token:", error);
      navigate("/"); // Navigate to login on error
    }
  };

  const isTokenValid = (token) => {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      return decoded.exp > Date.now() / 1000; // Check expiration
    } catch {
      return false;
    }
  };

  // Error messages
  const errors = {
    username: "Invalid user",
    password: "Invalid password",
    blank: "Please fill in all fields",
  };

  // Function to render error messages
  const renderErrorMessage = (name) =>
    errorMessages[name] && (
      <div className="error mt-1" style={{ marginLeft: "35px" }}>
        {errorMessages[name]}
      </div>
    );
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check for empty fields
    if (!username || !password) {
      setErrorMessages({ blank: errors.blank });
      return;
    }
    setIsLoading(true);
    // Send login request to backend
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: username,
        password: password,
      });

      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/client");

        // Set the userId and changePasswordRequired flag for the password modal
        // setUserId(data.user_id);
        // setIsChangePasswordRequired(data.isChangePasswordRequired);

        // if (data.isChangePasswordRequired) {
        //   setIsModalOpen(true); // Show password modal after login
        // } else {
        // navigateToDestination();
        // }
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          setErrorMessages({ password: errors.password }); // Invalid username or password
          setIsLoading(false);
        } else if (status === 403) {
          setErrorMessages({ password: errors.password }); // Incorrect password
          setIsLoading(false);
        } else if (status === 404) {
          setErrorMessages({ username: errors.username });
          setIsLoading(false);
        } else {
          setErrorMessages({
            unexpected: "An unexpected error occurred. Please try again later.",
          });
        }
      } else {
        setErrorMessages({
          unexpected: "An unexpected error occurred. Please try again later.",
        });
        setIsLoading(false);
      }
    }
  };

  const navigateToDestination = () => {
    const token = localStorage.getItem("authToken");

    const user = JSON.parse(localStorage.getItem("user"));

    if (token && isTokenValid(token)) {
      navigate("/");
    } else if (user && user.user_roles) {
      if (user.user_roles.includes("Cbsl User")) {
        navigate("/");
      } else if (user.user_roles.includes("Client")) {
        navigate("/client");
      } else {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  };

  // Toggle password visibility
  const handleToggle = () => {
    if (type === "password") {
      setIcon(eye);
      setType("text");
    } else {
      setIcon(eyeOff);
      setType("password");
    }
  };

  return (
    <>
      <div className="">
        <div
          style={{
            backgroundImage: "url('/login-background.png')",
            height: "100vh",
            marginTop: "0px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-5 col-md-6 col-sm-6"></div>
              <div className="col-lg-7 col-md-6 col-sm-6">
                <div className="form">
                  <form onSubmit={handleSubmit}>
                    <div className="login-card">
                      <div className="password-field mt-4 ms-2">
                        <span className="flex justify-around items-start">
                          <FaUserLarge
                            className="me-2"
                            size={20}
                            color="gray"
                          />
                        </span>
                        <input
                          type="text"
                          name="uname"
                          placeholder="Username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="password-inputbox"
                        />
                      </div>
                      {renderErrorMessage("username")}
                      <div className="password-field mt-3 ms-2">
                        <span
                          className="flex justify-around items-start"
                          onClick={handleToggle}
                        >
                          <FaEye
                            className="absolute me-2"
                            size={20}
                            style={{ color: "gray" }}
                          />
                          {/* <Icon
                            className="absolute me-2"
                            icon={eyeOff}
                            size={20}
                            style={{ color: "gray" }}
                          /> */}
                        </span>
                        <input
                          type={type}
                          name="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          autoComplete="current-password"
                          className="password-inputbox"
                        />
                      </div>
                      {renderErrorMessage("password")}
                      {renderErrorMessage("blank")}
                      <p
                        className="text-end mt-2 me-3"
                        style={{
                          color: "white",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        Forgot Password?
                      </p>
                      <button
                        type="submit"
                        className="btn login-btn"
                        style={{
                          backgroundColor: "#2d98d9",
                          color: "white",
                          width: "355px",
                          marginLeft: "10px",
                        }}
                        placeholder="Log In"
                        disabled={isLoading}
                      >
                        {isLoading ? "Logging In..." : "Log In"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* {isModalOpen && <PasswordModal onClose={handleCloseModal} userId={userId} />} */}
      <ToastContainer />
    </>
  );
};

export default Login;
