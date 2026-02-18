import React, { useState } from 'react';
import Navbar from './Navbar.jsx';
import { Outlet } from 'react-router-dom';
import RequestModal from './RequestModal.jsx';
import ResponseModal from './ResponseModal.jsx';
import { ToastProvider } from '../context/ToastContext.jsx';

const Layout = () => {
    const [userType, setUserType] = useState('donor');
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const triggerResponse = (req) => {
        setSelectedRequest(req || { hospital: "Emergency Center", bloodType: "O-", urgency: "Critical", distance: "2.1km", reason: "Multiple Trauma" });
        setIsResponseModalOpen(true);
    };

    return (
        <ToastProvider>
            <div className="min-h-screen bg-slate-50 transition-colors duration-500">
                <Navbar
                    userType={userType}
                    setUserType={setUserType}
                    onNewRequest={() => setIsRequestModalOpen(true)}
                    onEmergency={() => triggerResponse()}
                />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Outlet context={{ userType, triggerResponse, triggerNewRequest: () => setIsRequestModalOpen(true) }} />
                </main>

                <RequestModal
                    isOpen={isRequestModalOpen}
                    onClose={() => setIsRequestModalOpen(false)}
                    onRefresh={() => window.location.reload()}
                />
                <ResponseModal
                    isOpen={isResponseModalOpen}
                    onClose={() => setIsResponseModalOpen(false)}
                    request={selectedRequest}
                />
            </div>
        </ToastProvider>
    );
};

export default Layout;
