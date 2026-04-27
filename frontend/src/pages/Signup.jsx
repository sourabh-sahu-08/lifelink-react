import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

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

    const validateForm = () => {
        const { email, phone, password, confirmPassword } = formData;
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            addToast('Please enter a valid email address', 'error');
            return false;
        }

        // Phone validation (10 digits)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            addToast('Please enter a valid 10-digit phone number', 'error');
            return false;
        }

        // Password complexity (Hard: Upper, Lower, Number, Special)
        // AND Max 6 characters
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{1,6}$/;
        if (!passwordRegex.test(password)) {
            if (password.length > 6) {
                addToast('Password must be maximum 6 characters', 'error');
            } else {
                addToast('Password must be "hard" (Include uppercase, lowercase, number, and special character)', 'error');
            }
            return false;
        }

        // Confirm password match
        if (password !== confirmPassword) {
            addToast('Passwords do not match', 'error');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setSubmitting(true);
        const result = await signup(formData);
        if (result.success) {
            addToast('Account created successfully!', 'success');
            navigate('/');
        } else {
            addToast(result.message, 'error');
        }
        setSubmitting(false);
    };

    const bloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

    return (
        <div className="min-h-screen animated-gradient flex items-center justify-center p-4 py-12 relative overflow-hidden">
            {/* Abstract decorative elements */}
            <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
            
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-card w-full max-w-2xl overflow-hidden relative z-10 rounded-[2.5rem]"
            >
                <div className="p-10 md:p-16">
                    <div className="text-center mb-12">
                        <motion.div 
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            className="w-20 h-20 bg-gradient-to-br from-red-600 to-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-500/20 -rotate-3"
                        >
                            <i className="fas fa-heart text-white text-4xl"></i>
                        </motion.div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Join <span className="gradient-text">LifeLink</span></h1>
                        <p className="text-gray-500 font-medium uppercase tracking-[0.2em] text-[10px]">Empowering Life Through Connection</p>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="md:col-span-2 flex p-1.5 bg-gray-200/30 backdrop-blur-md rounded-2xl mb-4 border border-white/20">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'donor' })}
                                className={`flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${formData.role === 'donor' ? 'bg-white shadow-lg text-red-600 scale-[1.02]' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <i className="fas fa-user-heart mr-2"></i> Donor
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'hospital' })}
                                className={`flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${formData.role === 'hospital' ? 'bg-white shadow-lg text-red-600 scale-[1.02]' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <i className="fas fa-hospital mr-2"></i> Hospital
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Full Name / Hospital Name</label>
                            <div className="relative group">
                                <i className="fas fa-id-card absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 z-20 group-focus-within:text-red-600 transition-colors text-lg"></i>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full glass-input rounded-2xl py-4 pl-12 pr-4 font-bold text-gray-700 outline-none relative z-10"
                                    placeholder="Enter name"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Email Address</label>
                            <div className="relative group">
                                <i className="fas fa-envelope absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 z-20 group-focus-within:text-red-600 transition-colors text-lg"></i>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full glass-input rounded-2xl py-4 pl-12 pr-4 font-bold text-gray-700 outline-none relative z-10"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Password (Hard & Max 6)</label>
                            <div className="relative group">
                                <i className="fas fa-lock absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 z-20 group-focus-within:text-red-600 transition-colors text-lg"></i>
                                <input
                                    type="password"
                                    required
                                    maxLength={6}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full glass-input rounded-2xl py-4 pl-12 pr-4 font-bold text-gray-700 outline-none relative z-10"
                                    placeholder="••••••"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Confirm Password</label>
                            <div className="relative group">
                                <i className="fas fa-shield-alt absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 z-20 group-focus-within:text-red-600 transition-colors text-lg"></i>
                                <input
                                    type="password"
                                    required
                                    maxLength={6}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full glass-input rounded-2xl py-4 pl-12 pr-4 font-bold text-gray-700 outline-none relative z-10"
                                    placeholder="••••••"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Phone Number</label>
                            <div className="relative group">
                                <i className="fas fa-phone absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 z-20 group-focus-within:text-red-600 transition-colors text-lg"></i>
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full glass-input rounded-2xl py-4 pl-12 pr-4 font-bold text-gray-700 outline-none relative z-10"
                                    placeholder="10-digit number"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">City</label>
                            <div className="relative group">
                                <i className="fas fa-map-marker-alt absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 z-20 group-focus-within:text-red-600 transition-colors text-lg"></i>
                                <input
                                    type="text"
                                    required
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full glass-input rounded-2xl py-4 pl-12 pr-4 font-bold text-gray-700 outline-none relative z-10"
                                    placeholder="Enter city"
                                />
                            </div>
                        </div>

                        {formData.role === 'donor' && (
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Blood Type</label>
                                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                                    {bloodTypes.map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, bloodType: type })}
                                            className={`py-3 rounded-xl font-bold text-xs transition-all duration-300 flex flex-col items-center justify-center gap-1 ${formData.bloodType === type ? 'bg-red-600 text-white shadow-lg scale-110' : 'bg-white/40 hover:bg-white/60 text-gray-700 border border-white/20'}`}
                                        >
                                            <i className={`fas fa-tint ${formData.bloodType === type ? 'text-white' : 'text-red-500'}`}></i>
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="md:col-span-2 pt-6">
                            <motion.button
                                type="submit"
                                disabled={submitting}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="w-full bg-gradient-to-r from-red-600 to-rose-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-red-500/30 hover:shadow-red-500/40 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {submitting ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin mr-2"></i> Initializing...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-user-plus text-xl"></i>
                                        Create Hero Account
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-gray-500 font-bold text-xs">
                            Already have an account? <Link to="/login" className="text-red-600 hover:underline">Sign In</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
