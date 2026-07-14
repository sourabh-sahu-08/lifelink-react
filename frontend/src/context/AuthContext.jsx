import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/apiConfig';

// Configure axios defaults for cross-origin cookie support
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/auth/me`);
                if (response.data.success) {
                    setUser(response.data.user);
                } else {
                    setUser(null);
                }
            } catch (err) {
                // Not logged in or session expired - this is expected for guests
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
            if (response.data.success) {
                setUser(response.data);
                return { success: true };
            }
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Login failed' 
            };
        }
    };

    const signup = async (userData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, userData);
            if (response.data.success) {
                setUser(response.data);
                return { success: true };
            }
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Signup failed' 
            };
        }
    };

    const googleLogin = async (credential) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/google`, { credential });
            if (response.data.success) {
                setUser(response.data);
                return { success: true };
            }
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Google login failed' 
            };
        }
    };

    const logout = async () => {
        try {
            await axios.get(`${API_BASE_URL}/api/auth/logout`);
            setUser(null);
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/api/auth/profile`, profileData);
            if (response.data.success) {
                setUser(prev => ({ ...prev, ...response.data }));
                return { success: true };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Profile update failed'
            };
        }
    };

    const updatePassword = async (passwordData) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/api/auth/password`, passwordData);
            if (response.data.success) {
                return { success: true };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Password update failed'
            };
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, googleLogin, updateProfile, updatePassword }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
