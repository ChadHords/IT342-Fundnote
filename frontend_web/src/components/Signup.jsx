import { Button, TextField, Typography } from "@mui/material";
import LoginRegisterImg from "../assets/login-register-img.jpg";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { signup } from "../api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // THIS WONT WORK YET. WAIT FOR THE SPRING TO FIREBASE TO AVOID CONFLICT (25/03/2025)
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const data = await signup(email, password);
      setMessage(data.message || "Signup successful!");
    } catch (error) {
      setMessage("Signup failed. Try again.");
    }
  };

  return (
    <>
      <div style={{ display: "flex", maxHeight: "100vh", overflow: "hidden" }}>
        <div style={{ width: "50%" }}>
          <img
            src={LoginRegisterImg}
            alt="Login"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div
          style={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: "40px" }}>Get Started</Typography>
          <Typography sx={{ fontSize: "16px", color: "#808080" }}>
            Welcome to FundNote
          </Typography>
          <Typography sx={{ fontSize: "16px", color: "#808080" }}>
            Let's create your account
          </Typography>
          <Button
            variant="outlined"
            sx={{
              width: "390px",
              height: "50px",
              marginTop: "50px",
              backgroundColor: "white",
              color: "black",
              borderColor: "#BEBEBE",
              "&:hover": { backgroundColor: "#f5f5f5", borderColor: "black" },
            }}
          >
            Continue with Google
          </Button>
          <form onSubmit={handleSignup}>
            {/* EMAIL */}
            <TextField
              label="Email"
              variant="outlined"
              sx={{ width: "390px", marginTop: "50px" }}
            />
            {/* PASSWORD */}
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              sx={{ width: "390px", marginTop: "30px" }}
            />
            <Button
              variant="contained"
              component={Link}
              to="/overview"
              sx={{
                width: "390px",
                height: "50px",
                marginTop: "30px",
                backgroundColor: "#37513D",
              }}
            >
              Sign Up
            </Button>
          </form>
          <Typography
            sx={{ fontSize: "16px", marginTop: "30px", color: "#808080" }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#37513D",
                fontWeight: "Bold",
                textDecoration: "none",
              }}
            >
              Sign In
            </Link>
          </Typography>
        </div>
      </div>
    </>
  );
};

export default Login;
