import { Button, Divider, TextField, Typography, Box } from "@mui/material";
import LoginRegisterImg from "../assets/login-register-img.jpg";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/Firebase";
import fundnoteLogo from '../assets/FundNoteLogo.png';

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

      navigate("/overview");
    } catch (error) {
      console.error("Login Error:", error.message);
    }
  };

  return (
    <>
      <div style={{ display: "flex", maxHeight: "100vh", overflow: "hidden" }}>
        <div style={{ width: "50%", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", alignItems: "center", }}>
          <div style={{ width: "400px" }}>
            <Box
              component="img"
              src={fundnoteLogo} // Update this path accordingly
              alt="FundNote Logo"
              sx={{ height: 100, p: 1}}
            />
            <Typography sx={{ fontSize: "35px" }}>Get Started</Typography>
            <Typography sx={{ fontSize: "16px", color: "#808080" }}>
              Welcome to FundNote
            </Typography>
            <Typography sx={{ fontSize: "16px", color: "#808080" }}>
              Let's create your account
            </Typography>
            
            <Button variant="outlined" sx={{ width: "390px", height: "50px", marginTop: "30px", backgroundColor: "white", color: "black", borderColor: "#BEBEBE", "&:hover": { backgroundColor: "#f5f5f5", borderColor: "black" }, borderRadius: "10px", }}>
              Sign In with Google
            </Button>

            <Divider sx={{ my: 3, mx: "auto", width: "390px" }}><Typography sx={{ color: "#878787" }}>or</Typography></Divider>

            <form onSubmit={handleLogin}>
              {/* EMAIL */}
              <TextField label="Email" type="email" variant="outlined" sx={{ width: "390px", marginTop: "10px", borderRadius: "10px" }} value={email} onChange={(e) => setEmail(e.target.value)} required/>
              {/* PASSWORD */}
              <TextField label="Password" type="password" variant="outlined" sx={{ width: "390px", marginTop: "30px", borderRadius: "10px" }} value={password} onChange={(e) => setPassword(e.target.value)} required/>

              <Button type="submit" variant="contained" sx={{ width: "390px", height: "50px", marginTop: "30px", backgroundColor: "#37513D", borderRadius: "10px" }}>
                Sign In
              </Button>
            </form>
            <Typography sx={{ fontSize: "16px", marginTop: "30px", color: "#808080" }} >
              Don't have an account?{" "}
              <Link to="/signup" style={{ color: "#37513D", fontWeight: "Bold", textDecoration: "none", }}>Sign Up for Free</Link>
            </Typography>
          </div>
        </div>
        <div style={{ width: "50%", padding: "20px" }}>
          <img src={LoginRegisterImg} alt="Signup" style={{ width: "100%", height: "100%", borderRadius: "10px" }}/>
        </div>
      </div>
    </>
  );
};

export default Login;