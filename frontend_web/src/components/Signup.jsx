import { Button, TextField, Typography } from "@mui/material";
import LoginRegisterImg from "../assets/login-register-img.jpg";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/Firebase";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Signed up:", userCredential.user);

      navigate("/login");
    } catch (error) {
      console.error("Signup Error:", error.message);
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
              type="email"
              variant="outlined"
              sx={{ width: "390px", marginTop: "50px" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {/* PASSWORD */}
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              sx={{ width: "390px", marginTop: "30px" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
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
