import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Mail, Lock, User, Briefcase, Phone, MapPin, ArrowRight, Github, Globe } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'candidate',
        city: '',
        phone: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();
    const { addToast } = useToast();

    const validateForm = () => {
        const { email, name, password, confirmPassword } = formData;
        
        if (!name) return addToast('Please enter your full name', 'error');
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return addToast('Please enter a valid email', 'error');

        if (password.length < 6) return addToast('Password must be at least 6 characters', 'error');

        if (password !== confirmPassword) return addToast('Passwords do not match', 'error');

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSubmitting(true);
        const result = await signup(formData);
        if (result.success) {
            addToast('Welcome to JobLuxe!', 'success');
            navigate('/dashboard');
        } else {
            addToast(result.message, 'error');
        }
        setSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-outfit">
            {/* Soft decorative gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/3"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 md:p-10">
                    <div className="text-center mb-10">
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200"
                        >
                            <Briefcase className="text-white w-6 h-6" />
                        </motion.div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Create Account</h1>
                        <p className="text-slate-500 text-sm">Join the next generation of professionals.</p>
                    </div>

                    <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'candidate' })}
                            className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${formData.role === 'candidate' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
                        >
                            Candidate
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'recruiter' })}
                            className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${formData.role === 'recruiter' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
                        >
                            Recruiter
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm text-slate-700 outline-none focus:bg-white focus:border-indigo-600/30 focus:ring-4 focus:ring-indigo-600/5 transition-all"
                                    placeholder="Alex Johnson"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm text-slate-700 outline-none focus:bg-white focus:border-indigo-600/30 focus:ring-4 focus:ring-indigo-600/5 transition-all"
                                    placeholder="alex@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm text-slate-700 outline-none focus:bg-white focus:border-indigo-600/30 focus:ring-4 focus:ring-indigo-600/5 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm text-slate-700 outline-none focus:bg-white focus:border-indigo-600/30 focus:ring-4 focus:ring-indigo-600/5 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={submitting}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 mt-4"
                        >
                            {submitting ? 'Creating account...' : 'Create Account'}
                            <ArrowRight className="w-4 h-4" />
                        </motion.button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-400 text-xs font-semibold">
                            Already have an account? <Link to="/login" className="text-indigo-600 hover:underline">Sign In</Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-center gap-6 grayscale opacity-40">
                    <Github className="w-5 h-5" />
                    <Globe className="w-5 h-5" />
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
