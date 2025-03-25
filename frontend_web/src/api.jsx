import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/auth"; // REPLACE LATER

// SIGNUP
export const signup = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/signup`, { email, password });
        console.log("Signup successful:", response.data);
    } catch (error) {
        console.error("Signup failed:", error.response?.data || error.message);
    }
};

// LOGIN
export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
        console.log("Login successful, Token:", response.data.token);
        return response.data.token;
    } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
    }
};
