import { Button, Divider, TextField, Typography } from "@mui/material";
import LoginRegisterImg from "../assets/login-register-img.jpg";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import axios from "axios";

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Firebase User UID:", user.uid);

      const idToken = await user.getIdToken(); 

      await axios.post("https://it342-fundnote.onrender.com/api/users/register", {
        uid: user.uid,
        name: name,
      }, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      console.log('Signup successful and user data sent to backend! Yippiee');

      navigate("/login");
      
    } catch (error) {
      console.error("Signup Error:", error.message);
      setError(error.message);
    }
  };

  return (
    <>
      <div style={{ display: "flex", maxHeight: "100vh", overflow: "hidden" }}>
        <div style={{ width: "50%", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", alignItems: "center", }}>
          <div style={{ width: "400px" }}>
            <Typography sx={{ fontSize: "40px" }}>Get Started</Typography>
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

            <form onSubmit={handleSignup}>
              {/* NAME */}
              <TextField label="Name" type="text" variant="outlined" sx={{ width: "390px", borderRadius: "10px" }} value={name} onChange={(e) => setName(e.target.value)} required/>
              {/* EMAIL */}
              <TextField label="Email" type="email" variant="outlined" sx={{ width: "390px", marginTop: "30px", borderRadius: "10px" }} value={email} onChange={(e) => setEmail(e.target.value)} required/>
              {/* PASSWORD */}
              <TextField label="Password" type="password" variant="outlined" sx={{ width: "390px", marginTop: "30px", borderRadius: "10px" }} value={password} onChange={(e) => setPassword(e.target.value)} required/>
                
              <Button type="submit" variant="contained" sx={{ width: "390px", height: "50px", marginTop: "30px", backgroundColor: "#37513D", borderRadius: "10px" }}>
                Sign Up
              </Button>
            </form>
            <Typography sx={{ fontSize: "16px", marginTop: "30px", color: "#808080" }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#37513D", fontWeight: "Bold", textDecoration: "none", }}>Sign In</Link>
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

export default Signup;