import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Mail, Lock, User, Phone, MapPin, ArrowRight, Heart, Droplets, Activity } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'donor',
        bloodType: 'O+',
        city: '',
        phone: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();
    const { addToast } = useToast();

    const bloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

    const validateForm = () => {
        const { email, name, password, confirmPassword, phone, city } = formData;
        
        if (!name) return addToast('Please enter your full name', 'error');
        if (!city) return addToast('Please enter your city', 'error');
        if (!phone || phone.length < 10) return addToast('Please enter a valid phone number', 'error');
        
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
            addToast('Welcome to LifeLink!', 'success');
            navigate('/dashboard');
        } else {
            addToast(result.message, 'error');
        }
        setSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-outfit">
            {/* Soft decorative gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/3"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl relative z-10"
            >
                <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 md:p-12">
                    <div className="text-center mb-10">
                        <motion.div 
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-200"
                        >
                            <Heart className="text-white w-8 h-8 fill-current" />
                        </motion.div>
                        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">Join LifeLink</h1>
                        <p className="text-slate-500 text-sm font-medium uppercase tracking-[0.2em]">Connecting donors to save lives</p>
                    </div>

                    <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-8">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'donor' })}
                            className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${formData.role === 'donor' ? 'bg-white shadow-md text-red-600 scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Donor
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'hospital' })}
                            className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${formData.role === 'hospital' ? 'bg-white shadow-md text-red-600 scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Hospital
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm text-slate-700 outline-none focus:bg-white focus:border-red-600/30 focus:ring-4 focus:ring-red-600/5 transition-all"
                                    placeholder="Enter full name"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm text-slate-700 outline-none focus:bg-white focus:border-red-600/30 focus:ring-4 focus:ring-red-600/5 transition-all"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm text-slate-700 outline-none focus:bg-white focus:border-red-600/30 focus:ring-4 focus:ring-red-600/5 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm text-slate-700 outline-none focus:bg-white focus:border-red-600/30 focus:ring-4 focus:ring-red-600/5 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm text-slate-700 outline-none focus:bg-white focus:border-red-600/30 focus:ring-4 focus:ring-red-600/5 transition-all"
                                    placeholder="10-digit number"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">City</label>
                            <div className="relative group">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                                <input
                                    type="text"
                                    required
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm text-slate-700 outline-none focus:bg-white focus:border-red-600/30 focus:ring-4 focus:ring-red-600/5 transition-all"
                                    placeholder="Enter city"
                                />
                            </div>
                        </div>

                        {formData.role === 'donor' && (
                            <div className="md:col-span-2 space-y-3">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Droplets className="w-3 h-3 text-red-500" />
                                    Select Blood Type
                                </label>
                                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                                    {bloodTypes.map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, bloodType: type })}
                                            className={`py-3 rounded-xl font-bold text-xs transition-all duration-300 border ${formData.bloodType === type ? 'bg-red-600 text-white border-red-600 shadow-lg scale-110' : 'bg-white text-slate-600 border-slate-100 hover:border-red-200'}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <motion.button
                            type="submit"
                            disabled={submitting}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="md:col-span-2 bg-red-600 text-white py-5 rounded-2xl font-bold text-sm shadow-xl shadow-red-100 hover:bg-red-700 transition-all flex items-center justify-center gap-3 mt-6"
                        >
                            {submitting ? 'Registering Hero...' : 'Create Account'}
                            <ArrowRight className="w-4 h-4" />
                        </motion.button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-slate-50">
                        <button 
                            type="button"
                            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-100 py-3.5 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <i className="fab fa-google text-red-500"></i>
                            Sign in with Google
                        </button>
                        
                        <p className="mt-8 text-center text-slate-400 text-xs font-semibold">
                            Already part of the network? <Link to="/login" className="text-red-600 hover:underline">Sign In</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
