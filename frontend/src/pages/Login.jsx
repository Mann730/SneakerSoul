import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { loginUser } from "../services/authServices";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser(form);

      // Store token and user data
      if (response.token) {
        // Check if user is admin
        if (response.user.role === "admin") {
          // Store admin credentials
          localStorage.setItem("adminToken", response.token);
          localStorage.setItem("adminUser", JSON.stringify(response.user));

          // Redirect to admin dashboard
          navigate("/admin/dashboard");
        } else {
          // Regular user login
          localStorage.setItem("token", response.token);
          localStorage.setItem("user", JSON.stringify(response.user));

          // Notify other tabs
          window.dispatchEvent(new Event("storage"));

          navigate("/home");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-12 overflow-x-hidden">
      <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
        <div className="space-y-2 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-800">
            Welcome back
          </p>
          <h2 className="text-3xl font-bold text-slate-900">Login</h2>
          <p className="text-sm text-slate-600">
            Access your account and continue exploring.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-800">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-800">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="Your password"
                value={form.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default Login;
