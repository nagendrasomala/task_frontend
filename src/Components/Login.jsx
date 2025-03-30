import React, { useState } from "react";
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const AuthPage = ({ isLogin }) => {
  const [formData, setFormData] = useState({ uid: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "https://task-backend-ureu.onrender.com/api/login" : "https://task-backend-ureu.onrender.com/api/register";
    try {
      const response = await axios.post(endpoint, formData);
      console.log(response.data)
      toast.success(response.data.message);
      localStorage.setItem("token",response.data.token);
      if (isLogin) navigate("/dashboard");
    } catch (error) {
        toast.error("Error: " + error.response?.data?.message || "Request failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="border p-8 rounded shadow-md w-80">
        <h2 className="text-center text-xl font-bold mb-4">
          {isLogin ? "Welcome back!" : "Create an account"}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="uid"
            placeholder="UID"
            value={formData.uid}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <button
            type="submit"
            className="w-full bg-blue-900 text-white p-2 rounded"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        <div className="text-center mt-4">
          {isLogin ? (
            <p>
              Don't have an account? <Link to="/register" className="text-blue-600">Register</Link>
            </p>
          ) : (
            <p>
              Already have an account? <Link to="/" className="text-blue-600">Login</Link>
            </p>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AuthPage;
