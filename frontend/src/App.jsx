import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import DonorDashboard from './pages/DonorDashboard.jsx';
import HospitalDashboard from './pages/HospitalDashboard.jsx';
import Requests from './pages/Requests.jsx';
import Profile from './pages/Profile.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Wrapper to switch views based on context (LifeLink legacy)
const DashboardSwitcher = () => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    return user.role === 'donor' || user.role === 'candidate' ? <DonorDashboard /> : <HospitalDashboard />;
};

function App() {
    return (
        <ToastProvider>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    
                    {/* JobLuxe Modern Dashboard */}
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    
                    {/* LifeLink Legacy Routes */}
                    <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                        <Route index element={<DashboardSwitcher />} />
                        <Route path="requests" element={<Requests />} />
                        <Route path="profile" element={<Profile user={null} />} /> {/* Profile will use context */}
                    </Route>

                    {/* Redirect unknown routes to dashboard */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </ToastProvider>
    );
}

export default App;
