import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from '../components/Skeleton';
import API_BASE_URL from '../config/apiConfig';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Profile = ({ user: propUser }) => {
    const { user: authUser, updateProfile, updatePassword } = useAuth();
    const user = propUser || authUser;
    const { addToast } = useToast();

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

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

    const [editForm, setEditForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        city: user?.city || '',
        bloodType: user?.bloodType || 'O+'
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const [notifSettings, setNotifSettings] = useState({
        emailAlerts: true,
        smsAlerts: true,
        emergencyPush: true
    });

    // Sync form data if user loads late
    useEffect(() => {
        if (user) {
            setEditForm({
                name: user.name || '',
                phone: user.phone || '',
                city: user.city || '',
                bloodType: user.bloodType || 'O+'
            });
        }
    }, [user]);

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    const userType = user.role;
    const userId = user.id || user._id;

    useEffect(() => {
        if (!userId) return;
        const fetchData = async () => {
            try {
                const [histRes, statsRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/history/${userId}`),
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
    }, [userType, userId]);

    const handleEditSave = async (e) => {
        e.preventDefault();
        const res = await updateProfile(editForm);
        if (res.success) {
            addToast('Profile updated successfully!', 'success');
            setIsEditModalOpen(false);
        } else {
            addToast(res.message, 'error');
        }
    };

    const handlePasswordSave = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
            addToast('Passwords do not match', 'error');
            return;
        }
        const res = await updatePassword({
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword
        });
        if (res.success) {
            addToast('Password changed successfully!', 'success');
            setIsPasswordModalOpen(false);
            setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        } else {
            addToast(res.message, 'error');
        }
    };

    const handleNotifSave = () => {
        addToast('Notification preferences saved!', 'success');
        setIsNotificationsModalOpen(false);
    };

    const handleSecurityClick = (label) => {
        if (label === 'Change Password') {
            setIsPasswordModalOpen(true);
        } else if (label === 'Notifications') {
            setIsNotificationsModalOpen(true);
        } else if (label === 'Privacy Policy') {
            setIsPrivacyModalOpen(true);
        }
    };

    const userData = {
        name: user.name,
        email: user.email,
        phone: user.phone || "+91 XXXXX XXXXX",
        location: typeof user.location === 'object' ? (user.city || `${user.location.lat}, ${user.location.lng}`) : (user.location || user.city || "Unknown"),
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
                    <div className="absolute -bottom-20 left-0 right-0 sm:left-12 sm:right-auto flex flex-col sm:flex-row items-center sm:items-end px-6 sm:px-0">
                        <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-[2rem] sm:rounded-[2.5rem] border-[6px] sm:border-8 border-white shadow-2xl overflow-hidden bg-white flex-shrink-0">
                            <img
                                src={`https://ui-avatars.com/api/?name=${userData.name}&background=${userType === 'donor' ? 'ef4444' : '2563eb'}&color=fff&size=512`}
                                alt="Profile"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="ml-0 mt-4 sm:ml-8 sm:mb-6 text-center sm:text-left">
                            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight">{userData.name}</h1>
                            <p className="text-gray-500 flex items-center justify-center sm:justify-start font-semibold text-sm mt-2">
                                <i className="fas fa-map-marker-alt mr-2 text-red-500"></i> {userData.location}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="pt-24 sm:pt-28 px-6 sm:px-12 pb-6 sm:pb-12">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-10">
                        <div className="flex space-x-3">
                            <span className="px-5 py-2 bg-red-600 text-white rounded-2xl font-semibold text-[10px] uppercase tracking-widest shadow-lg shadow-red-200">
                                {userType}
                            </span>
                            {userType === 'donor' && (
                                <span className="px-5 py-2 bg-yellow-400 text-yellow-900 rounded-2xl font-semibold text-[10px] uppercase tracking-widest shadow-lg shadow-yellow-100">
                                    GOLD MEMBER
                                </span>
                            )}
                        </div>
                        <button 
                            onClick={() => setIsEditModalOpen(true)}
                            className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-semibold text-xs uppercase tracking-widest hover:bg-black transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-gray-200 w-full sm:w-auto"
                        >
                            Edit Profile
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
                        <div className="space-y-8">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 pb-4">Personal Information</h3>
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
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
                                            <p className="font-bold text-gray-900 mt-0.5">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-8">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 pb-4">Security & Settings</h3>
                            <div className="space-y-4">
                                {[
                                    { icon: 'lock', label: 'Change Password', color: 'text-indigo-500', bg: 'bg-indigo-50', hover: 'hover:border-indigo-100 hover:shadow-indigo-100/50' },
                                    { icon: 'bell', label: 'Notifications', color: 'text-orange-500', bg: 'bg-orange-50', hover: 'hover:border-orange-100 hover:shadow-orange-100/50' },
                                    { icon: 'shield-alt', label: 'Privacy Policy', color: 'text-teal-500', bg: 'bg-teal-50', hover: 'hover:border-teal-100 hover:shadow-teal-100/50' }
                                ].map((item, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => handleSecurityClick(item.label)}
                                        className={`w-full text-left p-5 rounded-3xl bg-white hover:bg-gray-50/30 shadow-sm hover:shadow-lg transition-all flex justify-between items-center group border border-gray-100/50 ${item.hover}`}
                                    >
                                        <div className="flex items-center">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-6 ${item.bg} group-hover:scale-110 transition-transform`}>
                                                <i className={`fas fa-${item.icon} ${item.color} text-lg`}></i>
                                            </div>
                                            <span className="font-bold text-gray-800 text-sm uppercase tracking-widest">{item.label}</span>
                                        </div>
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 group-hover:bg-white border border-transparent group-hover:border-gray-200 transition-colors shadow-sm group-hover:shadow">
                                            <i className="fas fa-arrow-right text-gray-300 group-hover:text-gray-600 -rotate-45 group-hover:rotate-0 transition-all duration-300"></i>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-xl px-6 py-8 sm:p-12 border border-gray-100">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight flex items-center">
                        <i className="fas fa-history text-red-500 mr-3 sm:mr-5"></i>
                        {userType === 'donor' ? 'Donation History' : 'Recent Blood Requests'}
                    </h2>
                    {loading ? <Skeleton className="h-6 w-24" /> : (
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{history.length} RECORDS</span>
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
                                key={item._id || item.id}
                                className="flex items-center justify-between p-6 border border-gray-50 rounded-3xl hover:border-red-100 transition-all bg-gray-50/20 hover:bg-white hover:shadow-lg group"
                            >
                                <div className="flex items-center">
                                    <div className={`w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center mr-6 border border-gray-50 group-hover:scale-110 transition-transform`}>
                                        <i className={`fas ${userType === 'donor' ? 'fa-tint text-red-500' : 'fa-hospital text-blue-500'} text-xl`}></i>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-lg">{item.hospital}</p>
                                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mt-1">{item.date} • {item.type}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900 text-xl">{item.amount || '4 Units'}</p>
                                    <p className={`text-[10px] font-semibold uppercase tracking-widest mt-1 ${item.status === 'Completed' ? 'text-green-500' : 'text-blue-500'}`}>
                                        {item.status}
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-12 opacity-50">
                            <i className="fas fa-folder-open text-4xl mb-4"></i>
                            <p className="font-semibold uppercase tracking-widest text-xs">No records found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals Container */}
            <AnimatePresence>
                {/* 1. Edit Profile Modal */}
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 space-y-6"
                        >
                            <h3 className="text-2xl font-bold text-gray-900">Edit Profile</h3>
                            <form onSubmit={handleEditSave} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                                    <input 
                                        type="text" 
                                        value={editForm.name} 
                                        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 text-sm font-semibold text-gray-700" 
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
                                    <input 
                                        type="text" 
                                        value={editForm.phone} 
                                        onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 text-sm font-semibold text-gray-700" 
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">City</label>
                                    <input 
                                        type="text" 
                                        value={editForm.city} 
                                        onChange={e => setEditForm({ ...editForm, city: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 text-sm font-semibold text-gray-700" 
                                        required
                                    />
                                </div>
                                {userType === 'donor' && (
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Blood Type</label>
                                        <select 
                                            value={editForm.bloodType} 
                                            onChange={e => setEditForm({ ...editForm, bloodType: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 text-sm font-semibold text-gray-700 bg-white"
                                        >
                                            {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                <div className="flex gap-3 pt-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {/* 2. Change Password Modal */}
                {isPasswordModalOpen && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 space-y-6"
                        >
                            <h3 className="text-2xl font-bold text-gray-900">Change Password</h3>
                            <form onSubmit={handlePasswordSave} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Password</label>
                                    <input 
                                        type="password" 
                                        value={passwordForm.currentPassword} 
                                        onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 text-sm font-semibold text-gray-700" 
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">New Password</label>
                                    <input 
                                        type="password" 
                                        value={passwordForm.newPassword} 
                                        onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 text-sm font-semibold text-gray-700" 
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Confirm New Password</label>
                                    <input 
                                        type="password" 
                                        value={passwordForm.confirmNewPassword} 
                                        onChange={e => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 text-sm font-semibold text-gray-700" 
                                        required
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsPasswordModalOpen(false)}
                                        className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                                    >
                                        Update
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {/* 3. Notifications Modal */}
                {isNotificationsModalOpen && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 space-y-6"
                        >
                            <h3 className="text-2xl font-bold text-gray-900">Notification Settings</h3>
                            <div className="space-y-4">
                                {[
                                    { key: 'emailAlerts', label: 'Email Notifications', desc: 'Receive critical updates via email' },
                                    { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Direct alerts to your verified phone' },
                                    { key: 'emergencyPush', label: 'Emergency Push Alerts', desc: 'High-priority notifications for emergency requests' }
                                ].map(setting => (
                                    <div key={setting.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="pr-4">
                                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">{setting.label}</h4>
                                            <p className="text-[10px] text-slate-400 mt-1 font-semibold leading-relaxed">{setting.desc}</p>
                                        </div>
                                        <button 
                                            onClick={() => setNotifSettings({ ...notifSettings, [setting.key]: !notifSettings[setting.key] })}
                                            className={`w-12 h-6 rounded-full p-1 transition-colors flex-shrink-0 ${notifSettings[setting.key] ? 'bg-red-600' : 'bg-slate-300'}`}
                                        >
                                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${notifSettings[setting.key] ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                        </button>
                                    </div>
                                ))}
                                <div className="flex gap-3 pt-4">
                                    <button 
                                        onClick={() => setIsNotificationsModalOpen(false)}
                                        className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleNotifSave}
                                        className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* 4. Privacy Policy Modal */}
                {isPrivacyModalOpen && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 space-y-6"
                        >
                            <h3 className="text-2xl font-bold text-gray-900">Privacy Policy</h3>
                            <div className="max-h-[300px] overflow-y-auto pr-2 text-xs text-slate-500 space-y-4 font-semibold leading-relaxed">
                                <p><strong>1. Data Collection:</strong> We collect personal details such as your name, email address, phone number, city, and blood type to optimize the donation matching network.</p>
                                <p><strong>2. Geographic Location:</strong> Safe approximate locations are saved when you provide your city, enabling proximity calculation for critical blood supply and alert services.</p>
                                <p><strong>3. Third-party Sharing:</strong> We do not sell or lease your personal information. Relevant details are shown exclusively to verified health institutes or donors in your city during emergencies.</p>
                                <p><strong>4. Account Rights:</strong> You can edit your profile data or request account deletion at any time by contacting our support team.</p>
                            </div>
                            <button 
                                onClick={() => setIsPrivacyModalOpen(false)}
                                className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200"
                            >
                                I Understand
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Profile;
