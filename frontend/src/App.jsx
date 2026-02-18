import React from 'react';
import { Routes, Route, Navigate, useOutletContext } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import DonorDashboard from './pages/DonorDashboard.jsx';
import HospitalDashboard from './pages/HospitalDashboard.jsx';
import Requests from './pages/Requests.jsx';
import Profile from './pages/Profile.jsx';

// Wrapper to switch views based on context
const DashboardSwitcher = () => {
    const { userType } = useOutletContext();
    return userType === 'donor' ? <DonorDashboard /> : <HospitalDashboard />;
};

const ProfileWrapper = () => {
    const { userType } = useOutletContext();
    return <Profile userType={userType} />;
};

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<DashboardSwitcher />} />
                <Route path="requests" element={<Requests />} />
                <Route path="profile" element={<ProfileWrapper />} />
            </Route>
        </Routes>
    );
}

export default App;
