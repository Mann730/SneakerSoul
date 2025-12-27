import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { registerUser } from '../services/authServices.js';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error on input change
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      await registerUser(form);
      // Store email in localStorage for OTP verification
      localStorage.setItem("registerEmail", form.email);
      alert("OTP sent to your email for verification.");
      navigate("/verify-otp");
    } catch (error) {
      console.log("Registration Error: ", error);
      setError(
        error.message || error.error || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 px-4 py-12 overflow-x-hidden max-w-full"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-slate-200"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-2 text-center"
        >
          <motion.p
            variants={itemVariants}
            className="text-sm font-semibold uppercase tracking-wide text-slate-800"
          >
            Create your account
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold text-slate-900"
          >
            Join us now
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-sm text-slate-600"
          >
            Get access to exclusive offers and faster checkout.
          </motion.p>
        </motion.div>

        <motion.form
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-8 space-y-6"
          onSubmit={handleRegister}
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              role="alert"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            <motion.div
              variants={itemVariants}
              whileFocus={{ scale: 1.02 }}
              className="space-y-2"
            >
              <label htmlFor="name" className="text-sm font-medium text-slate-800">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileFocus={{ scale: 1.02 }}
              className="space-y-2"
            >
              <label htmlFor="email" className="text-sm font-medium text-slate-800">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileFocus={{ scale: 1.02 }}
              className="space-y-2"
            >
              <label htmlFor="password" className="text-sm font-medium text-slate-800">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
                placeholder="Password (min 6 characters)"
                value={form.password}
                onChange={handleChange}
              />
            </motion.div>
          </div>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-60 shadow-lg"
          >
            {loading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mr-2"
              >
                ⏳
              </motion.span>
            ) : null}
            {loading ? "Registering..." : "Register"}
          </motion.button>

          <motion.div
            variants={itemVariants}
            className="text-center text-sm text-slate-600"
          >
            <p>
              Already have an account?{" "}
              <a className="font-semibold text-slate-900 hover:text-slate-700" href="/login">
                Sign in
              </a>
            </p>
          </motion.div>
        </motion.form>
      </motion.div>
    </motion.div>
  );
}

export default Register;
