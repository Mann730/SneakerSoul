import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { adminLogin } from "../services/adminServices";

function AdminLogin() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
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
        setError("");
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!form.email || !form.password) {
            setError("All fields are required");
            setLoading(false);
            return;
        }

        try {
            const response = await adminLogin(form);

            // Check if user is admin
            if (response.user.role !== "admin") {
                setError("Access denied. Admin credentials required.");
                setLoading(false);
                return;
            }

            // Store token and user info
            localStorage.setItem("adminToken", response.token);
            localStorage.setItem("adminUser", JSON.stringify(response.user));

            navigate("/admin/dashboard");
        } catch (error) {
            console.log("Login Error: ", error);
            setError(error.message || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-12 flex items-center justify-center"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mx-auto max-w-md w-full rounded-2xl bg-white/10 backdrop-blur-lg p-8 shadow-2xl ring-1 ring-white/20"
            >
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2 text-center mb-8"
                >
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-white">Admin Portal</h2>
                    <p className="text-sm text-gray-300">
                        Secure access for administrators only
                    </p>
                </motion.div>

                <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-6"
                    onSubmit={handleLogin}
                >
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="rounded-lg border border-red-400 bg-red-500/20 px-4 py-3 text-sm text-red-200"
                            role="alert"
                        >
                            {error}
                        </motion.div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-200">
                                Admin Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-gray-400 backdrop-blur-sm focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all"
                                placeholder="admin@sneakersoul.com"
                                value={form.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-gray-200">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-gray-400 backdrop-blur-sm focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all"
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-3 text-sm font-semibold text-white transition hover:from-purple-700 hover:to-pink-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 disabled:cursor-not-allowed disabled:opacity-60 shadow-lg"
                    >
                        {loading ? (
                            <>
                                <motion.span
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="mr-2"
                                >
                                    ⏳
                                </motion.span>
                                Authenticating...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </motion.button>

                    <div className="text-center text-sm text-gray-300">
                        <a className="font-semibold text-purple-300 hover:text-purple-200" href="/">
                            ← Back to Home
                        </a>
                    </div>
                </motion.form>
            </motion.div>
        </motion.div>
    );
}

export default AdminLogin;
