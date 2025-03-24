import { TextField, Typography } from "@mui/material";
import LoginRegisterImg from "../assets/login-register-img.jpg";
import React from "react";

const Login = () => {
    return (
      <>
      <div style={{ display: "flex", maxHeight: "100vh", overflow: "hidden" }}>
        <div style={{ width: "50%" }}>
            <img src={LoginRegisterImg} alt="Login" style={{ width: "100%", height: "100%" }} />
        </div>
        <div style={{ width: "50%", textAlign: "center"}}>
            <Typography sx={{ fontSize: "40px" }}>Welcome back!</Typography>
            <Typography sx={{ fontSize: "16px", opacity: "50%" }}>Glad to see you again</Typography>
            <Typography sx={{ fontSize: "16px", opacity: "50%" }}>Login your account below</Typography>
            <TextField label="Email" variant="outlined" sx={{ width: "390px" }} />
        </div>
      </div>
      </>
    );
  };
  
  export default Login;