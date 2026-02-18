import React, { useState } from 'react';
import Navbar from './Navbar.jsx';
import { Outlet } from 'react-router-dom';
import RequestModal from './RequestModal.jsx';
import ResponseModal from './ResponseModal.jsx';
import { ToastProvider } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const Layout = () => {
    const { user } = useAuth();
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const triggerResponse = (req) => {
        setSelectedRequest(req || { hospital: "Emergency Center", bloodType: "O-", urgency: "Critical", distance: "2.1km", reason: "Multiple Trauma" });
        setIsResponseModalOpen(true);
    };

    const handleRefresh = () => setRefreshKey(prev => prev + 1);

    return (
        <ToastProvider>
            <div className="min-h-screen bg-slate-50 transition-colors duration-500">
                <Navbar
                    onNewRequest={() => setIsRequestModalOpen(true)}
                    onEmergency={() => triggerResponse()}
                />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Outlet context={{
                        userType: user?.role,
                        user,
                        triggerResponse,
                        triggerNewRequest: () => setIsRequestModalOpen(true),
                        refreshKey,
                        handleRefresh
                    }} />
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
            </div>
        </ToastProvider>
    );
};

export default Layout;
