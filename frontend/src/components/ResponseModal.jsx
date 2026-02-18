import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import API_BASE_URL from '../config/apiConfig';

const ResponseModal = ({ isOpen, onClose, request }) => {
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const { addToast } = useToast();

    if (!request) return null;

    const handleConfirm = async () => {
        setSubmitting(true);
        try {
            await axios.post(`${API_BASE_URL}/api/respond`, {
                requestId: request.id,
                donorId: 1 // In a real app, this would be the logged-in user's ID
            });
            setStep(2);
            addToast(`Successfully responded to ${request.hospital}!`, 'success');
        } catch (error) {
            console.error("Error responding to request:", error);
            addToast("Failed to record response. Please try again.", 'error');
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
                        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-white"
                    >
                        {step === 1 ? (
                            <div className="p-8">
                                <div className="text-center mb-8">
                                    <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-4 border-4 border-red-50">
                                        <i className="fas fa-hospital text-3xl text-red-600"></i>
                                    </div>
                                    <h2 className="text-2xl font-black text-gray-900 leading-tight">Confirm Response to<br />{request.hospital}</h2>
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">{request.reason}</p>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Blood Type</span>
                                        <span className="px-3 py-1 bg-red-600 text-white rounded-lg font-black">{request.bloodType}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Distance</span>
                                        <span className="font-black text-gray-900">{request.distance}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Urgency</span>
                                        <span className="text-red-600 font-black">{request.urgency}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <button
                                        onClick={handleConfirm}
                                        disabled={submitting}
                                        className="w-full bg-red-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-red-200 hover:bg-red-700 transition-all transform active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {submitting ? 'Notifying Hospital...' : 'I am on my way'}
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="w-full py-4 text-gray-400 font-bold hover:text-gray-600 transition-colors"
                                    >
                                        Not now
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                                >
                                    <i className="fas fa-check text-4xl text-green-600"></i>
                                </motion.div>
                                <h2 className="text-2xl font-black text-gray-900 mb-2">You're a Hero!</h2>
                                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                                    Hospital has been notified of your response. Please reach the blood bank within 30 minutes.
                                </p>
                                <button
                                    onClick={() => { onClose(); setStep(1); }}
                                    className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all"
                                >
                                    Got it
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ResponseModal;
