import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import * as z from "zod";

const schema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const AuthPage = ({ isLogin }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const endpoint = isLogin ? "https://task-backend-ureu.onrender.com/api/login" : "https://task-backend-ureu.onrender.com/api/register";
      const response = await axios.post(endpoint, data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      localStorage.setItem("token", data.token);
      if (isLogin) navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Request failed");
    },
  });

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="border p-8 rounded shadow-md w-80">
        <h2 className="text-center text-xl font-bold mb-4">
          {isLogin ? "Welcome back!" : "Create an account"}
        </h2>
        <form onSubmit={handleSubmit(mutation.mutate)}>
          <input
            type="email"
            {...register("email")}
            placeholder="Email"
            className="w-full p-2 border rounded mb-2"
          />
          <p className="text-red-500 text-sm">{errors.email?.message}</p>

          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className="w-full p-2 border rounded mb-2"
          />
          <p className="text-red-500 text-sm">{errors.password?.message}</p>

          <button type="submit" className="w-full bg-blue-900 text-white p-2 rounded">
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
