import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import DonorDashboard from './pages/DonorDashboard.jsx';
import HospitalDashboard from './pages/HospitalDashboard.jsx';
import Requests from './pages/Requests.jsx';
import Profile from './pages/Profile.jsx';
import Skeleton from './components/Skeleton.jsx';

// Wrapper to switch views based on context
const DashboardSwitcher = () => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    return user.role === 'donor' ? <DonorDashboard /> : <HospitalDashboard />;
};

const ProfileWrapper = () => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    return <Profile user={user} />;
};

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-slate-50"><Skeleton className="h-20 w-20 rounded-3xl" /></div>;
    if (!user) return <Navigate to="/login" />;
    return children;
};

function App() {
    return (
        <ToastProvider>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                        <Route index element={<DashboardSwitcher />} />
                        <Route path="requests" element={<Requests />} />
                        <Route path="profile" element={<ProfileWrapper />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </ToastProvider>
    );
}

export default App;
