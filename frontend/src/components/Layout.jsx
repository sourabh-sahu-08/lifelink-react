import React, { useState } from 'react';
import Navbar from './Navbar.jsx';
import { Outlet, useLocation } from 'react-router-dom';
import RequestModal from './RequestModal.jsx';
import ResponseModal from './ResponseModal.jsx';
import { ToastProvider } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Chatbot from './Chatbot.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const triggerResponse = (req) => {
        setSelectedRequest(req || { id: 1, hospital: "Emergency Center", bloodType: "O-", urgency: "Critical", distance: "2.1km", reason: "Multiple Trauma" });
        setIsResponseModalOpen(true);
    };

    const handleRefresh = () => setRefreshKey(prev => prev + 1);

    return (
        <ToastProvider>
            <div className="min-h-screen bg-slate-50 transition-colors duration-500 selection:bg-red-100 selection:text-red-600">
                <Navbar
                    onNewRequest={() => setIsRequestModalOpen(true)}
                    onEmergency={() => triggerResponse()}
                />
                
                {/* Fixed Background Gradients */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                    <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-red-100/40 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[30vw] h-[30vw] bg-blue-100/30 rounded-full blur-[100px]"></div>
                </div>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-32 lg:pb-12 relative z-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            <Outlet context={{
                                userType: user?.role,
                                user,
                                triggerResponse,
                                triggerNewRequest: () => setIsRequestModalOpen(true),
                                refreshKey,
                                handleRefresh
                            }} />
                        </motion.div>
                    </AnimatePresence>
                </main>

                <RequestModal
                    isOpen={isRequestModalOpen}
                    onClose={() => setIsRequestModalOpen(false)}
                    onRefresh={handleRefresh}
                />
                <ResponseModal
                    isOpen={isResponseModalOpen}
                    onClose={() => setIsResponseModalOpen(false)}
                    request={selectedRequest}
                    onRefresh={handleRefresh}
                />
                
                <Chatbot />
            </div>
        </ToastProvider>
    );
};

export default Layout;
