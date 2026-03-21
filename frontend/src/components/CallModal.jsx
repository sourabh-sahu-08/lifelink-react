import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CallModal = ({ isOpen, onClose, recipientName, phoneFallback }) => {
    const [callDuration, setCallDuration] = useState(0);
    const [isConnecting, setIsConnecting] = useState(true);

    useEffect(() => {
        let interval;
        if (isOpen) {
            // Simulate 3 seconds connecting time
            const timer = setTimeout(() => setIsConnecting(false), 3000);
            
            interval = setInterval(() => {
                if(!isConnecting) setCallDuration(prev => prev + 1);
            }, 1000);

            return () => { clearTimeout(timer); clearInterval(interval); };
        } else {
            setCallDuration(0);
            setIsConnecting(true);
        }
    }, [isOpen, isConnecting]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-lg"
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 50 }}
                    className="relative w-full max-w-sm flex flex-col items-center justify-center text-center space-y-8"
                >
                    <div className="text-white space-y-2">
                        <p className="text-lg font-light tracking-widest uppercase text-gray-400">
                            {isConnecting ? "Calling..." : "In Call"}
                        </p>
                        <h2 className="text-4xl font-bold">{recipientName}</h2>
                        {!isConnecting && <p className="text-xl font-mono text-green-400">{formatTime(callDuration)}</p>}
                    </div>

                    <div className="relative flex items-center justify-center w-40 h-40">
                        {isConnecting && (
                            <>
                                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-white/20 rounded-full" />
                                <motion.div animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }} className="absolute inset-0 bg-white/10 rounded-full" />
                            </>
                        )}
                        <div className="w-32 h-32 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center border-4 border-gray-600 shadow-2xl z-10 text-4xl font-bold text-gray-300 uppercase">
                            {recipientName.charAt(0)}
                        </div>
                    </div>

                    <div className="flex gap-6 mt-12">
                        {/* Open Native Dialer */}
                        {phoneFallback && (
                            <a href={`tel:${phoneFallback}`} className="w-16 h-16 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-all shadow-lg hover:scale-105">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </a>
                        )}

                        <button onClick={onClose} className="w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all hover:scale-105">
                            <svg className="w-8 h-8 transform rotate-135" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.516l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
                            </svg>
                        </button>
                    </div>
                </motion.div>
            </div>
            )}
        </AnimatePresence>
    );
};

export default CallModal;
