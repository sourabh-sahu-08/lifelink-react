import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import API_BASE_URL from '../config/apiConfig';

const ManageInventoryModal = ({ isOpen, onClose, inventory, onRefresh }) => {
    const [selectedType, setSelectedType] = useState(inventory[0]?.type || 'O-');
    const [units, setUnits] = useState(inventory.find(i => i.type === selectedType)?.units || 0);
    const [submitting, setSubmitting] = useState(false);
    const { addToast } = useToast();

    const handleUpdate = async () => {
        setSubmitting(true);
        try {
            await axios.post(`${API_BASE_URL}/api/inventory/update`, {
                type: selectedType,
                units: parseInt(units)
            });
            addToast(`Updated ${selectedType} inventory successfully!`, 'success');
            onRefresh();
            onClose();
        } catch (error) {
            console.error("Error updating inventory:", error);
            addToast("Failed to update inventory.", 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
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
                        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100"
                    >
                        <div className="bg-gray-900 p-8 text-white relative">
                            <h2 className="text-2xl font-black uppercase tracking-tight">Stock Management</h2>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Real-time Inventory Control</p>
                            <button onClick={onClose} className="absolute top-8 right-8 text-gray-500 hover:text-white">
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Select Blood Type</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {inventory.map(item => (
                                        <button
                                            key={item.type}
                                            onClick={() => {
                                                setSelectedType(item.type);
                                                setUnits(item.units);
                                            }}
                                            className={`py-3 rounded-xl border-2 font-black text-[10px] transition-all ${selectedType === item.type ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-lg shadow-blue-100' : 'border-gray-50 bg-gray-50 text-gray-400'}`}
                                        >
                                            {item.type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Adjust Unit Count</label>
                                <div className="flex items-center space-x-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <button
                                        onClick={() => setUnits(Math.max(0, units - 1))}
                                        className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center text-gray-900 hover:bg-gray-100"
                                    >
                                        <i className="fas fa-minus text-sm"></i>
                                    </button>
                                    <div className="flex-1 text-center">
                                        <span className="text-4xl font-black text-gray-900">{units}</span>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Status: {units < 5 ? 'Critical' : 'Stable'}</p>
                                    </div>
                                    <button
                                        onClick={() => setUnits(units + 1)}
                                        className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center text-gray-900 hover:bg-gray-100"
                                    >
                                        <i className="fas fa-plus text-sm"></i>
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleUpdate}
                                disabled={submitting}
                                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all transform active:scale-95 disabled:opacity-50"
                            >
                                {submitting ? 'Updating...' : 'Commit Changes'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ManageInventoryModal;
