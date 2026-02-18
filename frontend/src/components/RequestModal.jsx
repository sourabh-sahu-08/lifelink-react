import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const RequestModal = ({ isOpen, onClose, onRefresh }) => {
    const { addToast } = useToast();
    const [formData, setFormData] = useState({
        bloodType: 'O-',
        units: 2,
        urgency: 'Urgent',
        reason: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const bloodTypes = ['O-', 'A+', 'B+', 'AB-', 'O+', 'A-', 'B-', 'AB+'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post('http://localhost:5000/api/requests', {
                hospital: "St. Mary's Hospital",
                ...formData
            });
            addToast(`Broadcasted ${formData.bloodType} request successfully!`, 'success');
            onRefresh();
            onClose();
        } catch (error) {
            console.error("Error creating request:", error);
            addToast("Failed to broadcast request.", 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-white"
                    >
                        <div className="bg-red-600 p-8 text-white relative">
                            <h2 className="text-3xl font-black uppercase tracking-tight">Create Request</h2>
                            <p className="text-red-100 text-xs font-bold uppercase tracking-widest mt-1 opacity-80">Emergency Blood Broadcast</p>
                            <button onClick={onClose} className="absolute top-8 right-8 text-white/80 hover:text-white transition-colors">
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Target Blood Type</label>
                                <div className="grid grid-cols-4 gap-3">
                                    {bloodTypes.map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, bloodType: type })}
                                            className={`py-3 rounded-xl border-2 font-black text-sm transition-all ${formData.bloodType === type ? 'border-red-600 bg-red-50 text-red-600 shadow-md' : 'border-gray-100 text-gray-400 hover:border-gray-200 hover:bg-gray-50'}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Units Required</label>
                                    <div className="flex items-center space-x-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, units: Math.max(1, formData.units - 1) })}
                                            className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-100"
                                        >
                                            <i className="fas fa-minus"></i>
                                        </button>
                                        <span className="flex-1 text-center font-black text-xl text-gray-900 leading-none">{formData.units}</span>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, units: formData.units + 1 })}
                                            className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-100"
                                        >
                                            <i className="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Urgency Level</label>
                                    <select
                                        value={formData.urgency}
                                        onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                                        className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-100 font-bold text-gray-700 outline-none focus:border-red-500 transition-colors appearance-none"
                                    >
                                        <option value="Critical">Critical (Immediate)</option>
                                        <option value="Urgent">Urgent (Today)</option>
                                        <option value="Normal">Normal (Scheduled)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Reason / Diagnosis</label>
                                <textarea
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    placeholder="e.g. Emergency Cardiac Surgery..."
                                    className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-100 font-bold text-gray-700 outline-none focus:border-red-500 transition-colors h-24 resize-none"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-red-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-red-200 hover:bg-red-700 transition-all transform active:scale-[0.98] disabled:opacity-50"
                            >
                                {submitting ? 'Broadcasting...' : 'Signal Emergency Alert'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default RequestModal;
