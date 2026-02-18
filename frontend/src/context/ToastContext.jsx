import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 5000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-8 right-8 z-[200] space-y-4">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 50, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                            className={`flex items-center p-4 rounded-2xl shadow-2xl border ${toast.type === 'success'
                                    ? 'bg-white border-green-100 text-green-800'
                                    : toast.type === 'error'
                                        ? 'bg-red-50 border-red-100 text-red-800'
                                        : 'bg-blue-50 border-blue-100 text-blue-800'
                                }`}
                        >
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center mr-3 ${toast.type === 'success' ? 'bg-green-100' : toast.type === 'error' ? 'bg-red-100' : 'bg-blue-100'
                                }`}>
                                <i className={`fas fa-${toast.type === 'success' ? 'check' : toast.type === 'error' ? 'exclamation' : 'info'
                                    }`}></i>
                            </div>
                            <p className="font-bold text-sm pr-8">{toast.message}</p>
                            <button onClick={() => removeToast(toast.id)} className="ml-auto text-gray-400 hover:text-gray-600">
                                <i className="fas fa-times"></i>
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};
