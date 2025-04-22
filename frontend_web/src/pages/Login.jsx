import { Button, TextField, Typography } from "@mui/material";
import LoginRegisterImg from "../assets/login-register-img.jpg";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/Firebase";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      console.log("Logged in. Token:", token);

      // Send token to the backend but its still gonna error
      // const response = await fetch("http://localhost:8080/api/protected", {
      //   method: "GET",
      //   headers: {
      //     Authorization: `Bearer ${token}`
      //   }
      // });
      // const data = await response.json();
      // console.log("Backend response:", data);
      navigate("/overview");
    } catch (error) {
      console.error("Login Error:", error.message);
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
          <Typography sx={{ fontSize: "40px" }}>Welcome back!</Typography>
          <Typography sx={{ fontSize: "16px", color: "#808080" }}>
            Glad to see you again
          </Typography>
          <Typography sx={{ fontSize: "16px", color: "#808080" }}>
            Login your account below
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
          <form onSubmit={handleLogin}>
            {/* EMAIL */}
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              sx={{ width: "390px", marginTop: "50px" }}
              value={email}
              onChange={(e) => setEmail(e.target.value) }
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
              Sign In
            </Button>
          </form>
          <Typography
            sx={{ fontSize: "16px", marginTop: "30px", color: "#808080" }}
          >
            Dont have an account?{" "}
            <Link
              to="/signup"
              style={{
                color: "#37513D",
                fontWeight: "Bold",
                textDecoration: "none",
              }}
            >
              Sign Up for free
            </Link>
          </Typography>
        </div>
      </div>
    </>
  );
};

export default Login;
