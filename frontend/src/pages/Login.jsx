import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Mail, Lock, Heart, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();
    const { addToast } = useToast();

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log('Google login success tokenResponse:', tokenResponse);
            setSubmitting(true);
            const result = await googleLogin(tokenResponse.access_token);
            console.log('Google login result:', result);
            if (result.success) {
                addToast('Welcome back to LifeLink!', 'success');
                navigate('/');
            } else {
                addToast(result.message, 'error');
            }
            setSubmitting(false);
        },
        onError: (error) => {
            console.error('Google login error:', error);
            addToast('Google login failed. Please try again.', 'error');
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const result = await login(email, password);
        if (result.success) {
            addToast('Welcome back to LifeLink!', 'success');
            navigate('/');
        } else {
            addToast(result.message, 'error');
        }
        setSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-outfit">
            {/* Soft decorative gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/3"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 md:p-12">
                    <div className="text-center mb-10">
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-200"
                        >
                            <Heart className="text-white w-8 h-8 fill-current" />
                        </motion.div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Welcome Back</h1>
                        <p className="text-slate-500 text-sm font-medium">Continue your life-saving mission.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm text-slate-700 outline-none focus:bg-white focus:border-red-600/30 focus:ring-4 focus:ring-red-600/5 transition-all"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
                                <Link to="/forgot-password" text="Forgot Password?" className="text-[10px] font-bold text-red-600 uppercase tracking-widest hover:underline">Forgot?</Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-sm text-slate-700 outline-none focus:bg-white focus:border-red-600/30 focus:ring-4 focus:ring-red-600/5 transition-all"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-600 transition-colors focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={submitting}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-red-100 hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                        >
                            {submitting ? 'Authenticating...' : 'Sign In'}
                            <ArrowRight className="w-4 h-4" />
                        </motion.button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-slate-50">
                        <button 
                            type="button"
                            onClick={() => handleGoogleLogin()}
                            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-100 py-3.5 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <i className="fab fa-google text-red-500"></i>
                            Sign in with Google
                        </button>
                        
                        <p className="mt-8 text-center text-slate-400 text-xs font-semibold">
                            Don't have an account? <Link to="/signup" className="text-red-600 hover:underline">Register Now</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
