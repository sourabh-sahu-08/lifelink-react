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

    const handleSubmit = async (e) => {
        e.preventDefault();
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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden border border-gray-100"
            >
                <div className="p-10">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-100 rotate-3">
                            <i className="fas fa-tint text-white text-3xl"></i>
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Welcome Back</h1>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Continue your life-saving journey</p>
                    </div>

                    <div className="flex p-1 bg-gray-50 rounded-2xl mb-8">
                        <button
                            type="button"
                            onClick={() => setRole('donor')}
                            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${role === 'donor' ? 'bg-white shadow-md text-red-600' : 'text-gray-400'}`}
                        >
                            Donor Login
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('hospital')}
                            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${role === 'hospital' ? 'bg-white shadow-md text-red-600' : 'text-gray-400'}`}
                        >
                            Hospital Portal
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email Address</label>
                            <div className="relative">
                                <i className="fas fa-envelope absolute left-5 top-1/2 -translate-y-1/2 text-gray-300"></i>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-gray-700 focus:border-red-500 focus:bg-white transition-all outline-none"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Password</label>
                            <div className="relative">
                                <i className="fas fa-lock absolute left-5 top-1/2 -translate-y-1/2 text-gray-300"></i>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-gray-700 focus:border-red-500 focus:bg-white transition-all outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="text-right">
                            <a href="#" className="text-[10px] font-black text-red-600 uppercase tracking-widest hover:text-red-700">Forgot Password?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-red-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-red-100 hover:bg-red-700 transition-all transform active:scale-[0.98] disabled:opacity-50 mt-4"
                        >
                            {submitting ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-2"></i> Signing In...
                                </>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-gray-400 font-bold text-xs">
                            Don't have an account? <Link to="/signup" className="text-red-600 hover:underline">Create Account</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
