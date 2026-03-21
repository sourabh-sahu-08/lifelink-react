import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config/apiConfig';
import { useToast } from '../context/ToastContext';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const BloodRequestForm = ({ isOpen, onClose, onSuccess }) => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [form, setForm] = useState({ bloodType: '', units: 1, urgency: 'Normal', reason: '', city: user?.city || '' });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async e => {
        e.preventDefault();
        if (!form.bloodType) return addToast('Please select a blood type', 'error');
        setSubmitting(true);
        try {
            await axios.post(`${API_BASE_URL}/api/blood-requests`, {
                ...form,
                requesterName: user?.name || user?.email,
                requesterRole: user?.role || 'donor',
            });
            addToast('Blood request posted successfully!', 'success');
            setForm({ bloodType: '', units: 1, urgency: 'Normal', reason: '', city: user?.city || '' });
            onSuccess?.();
            onClose();
        } catch (err) {
            addToast('Failed to submit request', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
                    <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }} className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">Request Blood</h2>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Post an emergency blood need</p>
                            </div>
                            <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Blood Type Needed *</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {BLOOD_TYPES.map(bt => (
                                        <button type="button" key={bt} onClick={() => setForm(p => ({ ...p, bloodType: bt }))}
                                            className={`py-3 rounded-2xl font-black text-sm border-2 transition-all ${form.bloodType === bt ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-200' : 'border-gray-100 text-gray-500 hover:border-red-300'}`}>
                                            {bt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Units Needed</label>
                                    <input type="number" name="units" min={1} max={20} value={form.units} onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 font-black text-gray-900 focus:outline-none focus:border-red-500 transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Urgency</label>
                                    <select name="urgency" value={form.urgency} onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 font-black text-gray-900 focus:outline-none focus:border-red-500 transition-all">
                                        <option>Normal</option>
                                        <option>Urgent</option>
                                        <option>Critical</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">City</label>
                                <input type="text" name="city" value={form.city} onChange={handleChange} placeholder="Your city..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 focus:outline-none focus:border-red-500 transition-all" />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Reason / Notes</label>
                                <textarea name="reason" value={form.reason} onChange={handleChange} rows={3} placeholder="Brief description (e.g. surgery, accident)..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 focus:outline-none focus:border-red-500 transition-all resize-none" />
                            </div>

                            <button type="submit" disabled={submitting}
                                className="w-full bg-red-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-red-200 hover:bg-red-700 transition-all disabled:opacity-50">
                                {submitting ? <><i className="fas fa-spinner fa-spin mr-2"></i>Posting...</> : 'Post Blood Request'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default BloodRequestForm;
