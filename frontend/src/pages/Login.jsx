import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('donor');
    const [submitting, setSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const { addToast } = useToast();

    const validateForm = () => {
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            addToast('Please enter a valid email address', 'error');
            return false;
        }

        if (!password) {
            addToast('Password is required', 'error');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setSubmitting(true);
        const result = await login(email, password);
        if (result.success) {
            addToast(`Login successful! Welcome back.`, 'success');
            navigate('/');
        } else {
            addToast(result.message, 'error');
        }
        setSubmitting(false);
    };

    return (
        <div className="min-h-screen animated-gradient flex items-center justify-center p-4 relative overflow-hidden">
            {/* Abstract decorative elements */}
            <div className="absolute top-[-10%] right-[-10%] w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-card w-full max-w-md overflow-hidden relative z-10 rounded-[2.5rem]"
            >
                <div className="p-10">
                    <div className="text-center mb-10">
                        <motion.div 
                            whileHover={{ rotate: -10, scale: 1.1 }}
                            className="w-20 h-20 bg-gradient-to-br from-red-600 to-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-500/20 rotate-3"
                        >
                            <i className="fas fa-tint text-white text-4xl"></i>
                        </motion.div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Welcome <span className="gradient-text">Back</span></h1>
                        <p className="text-gray-500 font-medium uppercase tracking-[0.2em] text-[10px]">Continue your life-saving journey</p>
                    </div>

                    <div className="flex p-1.5 bg-gray-200/30 backdrop-blur-md rounded-2xl mb-8 border border-white/20">
                        <button
                            type="button"
                            onClick={() => setRole('donor')}
                            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${role === 'donor' ? 'bg-white shadow-lg text-red-600 scale-[1.02]' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Donor Login
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('hospital')}
                            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${role === 'hospital' ? 'bg-white shadow-lg text-red-600 scale-[1.02]' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Hospital Portal
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Email Address</label>
                            <div className="relative group">
                                <i className="fas fa-envelope absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 z-20 group-focus-within:text-red-600 transition-colors text-lg"></i>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full glass-input rounded-2xl py-4 pl-12 pr-4 font-bold text-gray-700 outline-none relative z-10"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Password</label>
                            <div className="relative group">
                                <i className="fas fa-lock absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 z-20 group-focus-within:text-red-600 transition-colors text-lg"></i>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full glass-input rounded-2xl py-4 pl-12 pr-4 font-bold text-gray-700 outline-none relative z-10"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="text-right">
                            <a href="#" className="text-[10px] font-black text-red-600 uppercase tracking-widest hover:text-red-700 transition-colors flex items-center justify-end gap-1">
                                <i className="fas fa-question-circle"></i>
                                Forgot Password?
                            </a>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={submitting}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full bg-gradient-to-r from-red-600 to-rose-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-red-500/30 hover:shadow-red-500/40 transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-3"
                        >
                            {submitting ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-2"></i> Authenticating...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-sign-in-alt text-xl"></i>
                                    Sign In
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-gray-500 font-bold text-xs">
                            Don't have an account? <Link to="/signup" className="text-red-600 hover:underline">Create Account</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
