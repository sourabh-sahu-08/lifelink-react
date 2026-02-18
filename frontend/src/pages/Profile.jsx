import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from '../components/Skeleton';
import API_BASE_URL from '../config/apiConfig';

const Profile = ({ user }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        donations: 0,
        livesSaved: 0,
        avgResponse: 0,
        responseRate: "0%",
        cityRank: "--",
        activeRequests: 0,
        donorsResponded: 0,
        unitsCollected: 0,
        successRate: "0%"
    });

    const userType = user.role;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [histRes, statsRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/history/${user.id}`),
                    axios.get(`${API_BASE_URL}/api/stats`)
                ]);
                setHistory(histRes.data);
                setStats(userType === 'donor' ? statsRes.data.donorStats : statsRes.data.hospitalStats);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userType, user.id]);

    const userData = {
        name: user.name,
        email: user.email,
        phone: user.phone || "+91 XXXXX XXXXX",
        location: user.city || "Unknown",
        bloodType: user.bloodType || "N/A",
        joinedDate: "Jan 2024"
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8"
        >
            <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
                <div className="h-64 bg-gradient-to-r from-red-600 via-red-500 to-red-700 relative">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute -bottom-20 left-12 flex items-end">
                        <div className="h-40 w-40 rounded-[2.5rem] border-8 border-white shadow-2xl overflow-hidden bg-white">
                            <img
                                src={`https://ui-avatars.com/api/?name=${userData.name}&background=${userType === 'donor' ? 'ef4444' : '2563eb'}&color=fff&size=512`}
                                alt="Profile"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="ml-8 mb-6">
                            <h1 className="text-4xl font-black text-white drop-shadow-xl tracking-tight">{userData.name}</h1>
                            <p className="text-red-50 flex items-center font-bold text-sm mt-2">
                                <i className="fas fa-map-marker-alt mr-2 opacity-80"></i> {userData.location}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="pt-28 px-12 pb-12">
                    <div className="flex justify-between items-center mb-10">
                        <div className="flex space-x-3">
                            <span className="px-5 py-2 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-200">
                                {userType}
                            </span>
                            {userType === 'donor' && (
                                <span className="px-5 py-2 bg-yellow-400 text-yellow-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-yellow-100">
                                    GOLD MEMBER
                                </span>
                            )}
                        </div>
                        <button className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-gray-200">
                            Edit Profile
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 pb-4">Personal Information</h3>
                            <div className="space-y-6">
                                {[
                                    { icon: 'envelope', label: 'Email Address', value: user.email, color: 'text-red-500', bg: 'bg-red-50' },
                                    { icon: 'phone', label: 'Phone Number', value: user.phone, color: 'text-blue-500', bg: 'bg-blue-50' },
                                    { icon: 'tint', label: 'Blood Group', value: user.bloodType, color: 'text-purple-500', bg: 'bg-purple-50' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center group">
                                        <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center mr-5 transition-transform group-hover:scale-110 shadow-sm`}>
                                            <i className={`fas fa-${item.icon} ${item.color}`}></i>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
                                            <p className="font-black text-gray-900 mt-0.5">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-8">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 pb-4">Security & Settings</h3>
                            <div className="space-y-4">
                                {[
                                    { icon: 'lock', label: 'Change Password', color: 'text-gray-400' },
                                    { icon: 'bell', label: 'Notifications', color: 'text-gray-400' },
                                    { icon: 'shield-alt', label: 'Privacy Policy', color: 'text-gray-400' }
                                ].map((item, i) => (
                                    <button key={i} className="w-full text-left px-6 py-5 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all flex justify-between items-center group border border-transparent hover:border-gray-100">
                                        <div className="flex items-center">
                                            <i className={`fas fa-${item.icon} ${item.color} mr-4 group-hover:text-gray-900`}></i>
                                            <span className="font-black text-gray-700 text-sm uppercase tracking-widest">{item.label}</span>
                                        </div>
                                        <i className="fas fa-chevron-right text-gray-200 group-hover:text-gray-400"></i>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-xl p-12 border border-gray-100">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
                        <i className="fas fa-history text-red-500 mr-5"></i>
                        {userType === 'donor' ? 'Donation History' : 'Recent Blood Requests'}
                    </h2>
                    {loading ? <Skeleton className="h-6 w-24" /> : (
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{history.length} RECORDS</span>
                    )}
                </div>

                <div className="space-y-6">
                    {loading ? (
                        [1, 2, 3].map(n => <Skeleton key={n} className="h-24 w-full rounded-2xl" />)
                    ) : Array.isArray(history) && history.length > 0 ? (
                        history.map((item, i) => (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={item.id}
                                className="flex items-center justify-between p-6 border border-gray-50 rounded-3xl hover:border-red-100 transition-all bg-gray-50/20 hover:bg-white hover:shadow-lg group"
                            >
                                <div className="flex items-center">
                                    <div className={`w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center mr-6 border border-gray-50 group-hover:scale-110 transition-transform`}>
                                        <i className={`fas ${userType === 'donor' ? 'fa-tint text-red-500' : 'fa-hospital text-blue-500'} text-xl`}></i>
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-900 text-lg">{item.hospital}</p>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{item.date} • {item.type}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-gray-900 text-xl">{item.amount || '4 Units'}</p>
                                    <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${item.status === 'Completed' ? 'text-green-500' : 'text-blue-500'}`}>
                                        {item.status}
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-12 opacity-50">
                            <i className="fas fa-folder-open text-4xl mb-4"></i>
                            <p className="font-black uppercase tracking-widest text-xs">No records found</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default Profile;
