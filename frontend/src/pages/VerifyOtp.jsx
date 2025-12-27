import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { verifyOtp as verifyOtpAPI } from '../services/authServices';

function VerifyOtp() {
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
        // Get email from localStorage
        const registerEmail = localStorage.getItem('registerEmail');
        if (!registerEmail) {
            // If no email found, redirect to register
            navigate('/register');
        } else {
            setEmail(registerEmail);
        }
    }, [navigate]);

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            setLoading(false);
            return;
        }

        try {
            const response = await verifyOtpAPI({ email, otp });
            
            // Store token in localStorage
            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
            }
            
            // Clear register email
            localStorage.removeItem('registerEmail');
            
            alert("OTP verified successfully! You are now registered.");
            navigate('/home');
        } catch (error) {
            console.log("Verification Error: ", error);
            setError(error.message || error.error || "Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = () => {
        // Redirect back to register to resend OTP
        navigate('/register');
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
                        Verify OTP
                    </motion.p>
                    <motion.h2
                        variants={itemVariants}
                        className="text-3xl font-bold text-slate-900"
                    >
                        Complete your signup
                    </motion.h2>
                    <motion.p
                        variants={itemVariants}
                        className="text-sm text-slate-600"
                    >
                        We&apos;ve sent a 6-digit OTP to <strong className="font-semibold">{email}</strong>
                    </motion.p>
                </motion.div>
                <motion.form
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="mt-8 space-y-6"
                    onSubmit={handleVerifyOtp}
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
                    
                    <motion.div
                        variants={itemVariants}
                        whileFocus={{ scale: 1.02 }}
                        className="space-y-2"
                    >
                        <label htmlFor="otp" className="text-sm font-medium text-slate-800">OTP</label>
                        <motion.input
                            id="otp"
                            name="otp"
                            type="text"
                            maxLength="6"
                            required
                            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-center text-xl tracking-[0.35em] text-slate-900 shadow-sm focus:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
                            placeholder="000000"
                            value={otp}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                setOtp(value);
                                setError('');
                            }}
                            whileFocus={{ scale: 1.05 }}
                        />
                        <motion.div
                            className="flex justify-center gap-2 mt-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className={`h-2 w-2 rounded-full ${
                                        i < otp.length ? 'bg-indigo-600' : 'bg-slate-300'
                                    }`}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: i < otp.length ? 1 : 0.5 }}
                                    transition={{ type: "spring", stiffness: 500 }}
                                />
                            ))}
                        </motion.div>
                    </motion.div>

                    <motion.button
                        variants={itemVariants}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-60 shadow-lg"
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
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </motion.button>

                    <motion.div
                        variants={itemVariants}
                        className="text-center text-sm text-slate-600"
                    >
                        <p>
                            Didn&apos;t receive OTP?{' '}
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="font-semibold text-slate-900 hover:text-slate-700"
                                onClick={handleResendOtp}
                            >
                                Resend OTP
                            </motion.button>
                        </p>
                    </motion.div>
                </motion.form>
            </motion.div>
        </motion.div>
    );
}

export default VerifyOtp;
