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
        role: 'donor',
        bloodType: 'O+',
        city: '',
        phone: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();
    const { addToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100"
            >
                <div className="p-10 md:p-16">
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-100 -rotate-3">
                            <i className="fas fa-heart text-white text-3xl"></i>
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Join LifeLink</h1>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Become a hero in your community</p>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="md:col-span-2 flex p-1 bg-gray-50 rounded-2xl mb-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'donor' })}
                                className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${formData.role === 'donor' ? 'bg-white shadow-md text-red-600' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <i className="fas fa-user-heart mr-2"></i> Donor
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'hospital' })}
                                className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${formData.role === 'hospital' ? 'bg-white shadow-md text-red-600' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <i className="fas fa-hospital mr-2"></i> Hospital
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Full Name / Hospital Name</label>
                            <div className="relative">
                                <i className="fas fa-id-card absolute left-5 top-1/2 -translate-y-1/2 text-gray-300"></i>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-gray-700 focus:border-red-500 focus:bg-white transition-all outline-none"
                                    placeholder="Enter name"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email Address</label>
                            <div className="relative">
                                <i className="fas fa-envelope absolute left-5 top-1/2 -translate-y-1/2 text-gray-300"></i>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-gray-700 focus:border-red-500 focus:bg-white transition-all outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Phone Number</label>
                            <div className="relative">
                                <i className="fas fa-phone absolute left-5 top-1/2 -translate-y-1/2 text-gray-300"></i>
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-gray-700 focus:border-red-500 focus:bg-white transition-all outline-none"
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">City</label>
                            <div className="relative">
                                <i className="fas fa-map-marker-alt absolute left-5 top-1/2 -translate-y-1/2 text-gray-300"></i>
                                <input
                                    type="text"
                                    required
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-gray-700 focus:border-red-500 focus:bg-white transition-all outline-none"
                                    placeholder="Enter city"
                                />
                            </div>
                        </div>

                        {formData.role === 'donor' && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Blood Type</label>
                                <div className="relative">
                                    <i className="fas fa-tint absolute left-5 top-1/2 -translate-y-1/2 text-red-500"></i>
                                    <select
                                        value={formData.bloodType}
                                        onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-gray-700 focus:border-red-500 focus:bg-white transition-all outline-none appearance-none"
                                    >
                                        {bloodTypes.map(type => <option key={type} value={type}>{type}</option>)}
                                    </select>
                                </div>
                            </div>
                        )}

                        <div className="md:col-span-2 pt-6">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-red-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-red-100 hover:bg-red-700 transition-all transform active:scale-[0.98] disabled:opacity-50"
                            >
                                {submitting ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin mr-2"></i> Creating Account...
                                    </>
                                ) : 'Create Hero Account'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-gray-400 font-bold text-xs">
                            Already have an account? <Link to="/login" className="text-red-600 hover:underline">Sign In</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
