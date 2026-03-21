import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import ActivityFeed from '../components/ActivityFeed';
import ManageInventoryModal from '../components/ManageInventoryModal';
import Skeleton from '../components/Skeleton';
import ChatDialog from '../components/ChatDialog';
import CallModal from '../components/CallModal';
import RecentContacts from '../components/RecentContacts';
import BloodRequestsList from '../components/BloodRequestsList';
import BloodSupplyForm from '../components/BloodSupplyForm';
import GISMap from '../components/GISMap';
import API_BASE_URL from '../config/apiConfig';

const HospitalDashboard = () => {
    const { triggerNewRequest, refreshKey, user } = useOutletContext();
    const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
    const [mapMarkers, setMapMarkers] = useState([]);
    const [stats, setStats] = useState({
        activeRequests: 0,
        donorsResponded: 0,
        unitsCollected: 0,
        successRate: "0%"
    });
    const [inventory, setInventory] = useState([]);
    const [pendingDonations, setPendingDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fulfillingId, setFulfillingId] = useState(null);
    const [selectedDonor, setSelectedDonor] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isCallOpen, setIsCallOpen] = useState(false);
    const [showBloodSupplyForm, setShowBloodSupplyForm] = useState(false);
    const [requestsRefreshKey, setRequestsRefreshKey] = useState(0);

    const openChat = (donorName) => {
        setSelectedDonor(donorName);
        setIsChatOpen(true);
    };

    const openCall = (donorName) => {
        setSelectedDonor(donorName);
        setIsCallOpen(true);
    };

    const fetchData = async () => {
        try {
            const [statsRes, inventoryRes, pendingRes, reqsRes, supplyRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/stats`),
                axios.get(`${API_BASE_URL}/api/inventory`),
                axios.get(`${API_BASE_URL}/api/hospital/pending/${encodeURIComponent(user?.name)}`),
                axios.get(`${API_BASE_URL}/api/blood-requests`),
                axios.get(`${API_BASE_URL}/api/blood-supply`)
            ]);
            setStats(statsRes.data.hospitalStats);
            setInventory(inventoryRes.data);
            setPendingDonations(pendingRes.data);
            
            const markers = [
                ...reqsRes.data.filter(r => r.location).map(r => ({ ...r.location, title: r.requesterName, type: 'Request', bloodType: r.bloodType, units: r.units })),
                ...supplyRes.data.filter(s => s.location).map(s => ({ ...s.location, title: s.hospitalName, type: 'Supply', bloodType: s.bloodType, units: s.units }))
            ];
            setMapMarkers(markers);
        } catch (error) {
            console.error("Error fetching hospital data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFulfill = async (historyId) => {
        setFulfillingId(historyId);
        try {
            await axios.post(`${API_BASE_URL}/api/fulfill`, { historyId });
            fetchData();
        } catch (error) {
            console.error("Error fulfilling donation:", error);
        } finally {
            setFulfillingId(null);
        }
    };

    useEffect(() => {
        fetchData();
    }, [refreshKey]);

    if (loading) return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(n => <Skeleton key={n} className="h-32 w-full rounded-2xl" />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Skeleton className="h-96 lg:col-span-2 rounded-3xl" />
                <Skeleton className="h-96 rounded-3xl" />
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[100px] rounded-full"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none">Welcome, {user?.name || "Hospital"}</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-3 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                        {user?.city || "Bilaspur"} Regional Hub • Sector 7G
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 relative z-10">
                    <div className="text-right border-r border-gray-100 pr-4 hidden sm:block">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Rank</p>
                        <p className="text-xl font-black text-gray-900">#04 <span className="text-[10px] text-green-400">↑2</span></p>
                    </div>
                    <button
                        onClick={triggerNewRequest}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-900/20 transition-all hover:scale-105 active:scale-95 flex items-center"
                    >
                        <i className="fas fa-plus mr-2"></i> Emergency Request
                    </button>
                    <button
                        onClick={() => setShowBloodSupplyForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/20 transition-all hover:scale-105 active:scale-95 flex items-center"
                    >
                        <i className="fas fa-hand-holding-medical mr-2"></i> Post Supply
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                    { label: 'Active Requests', value: stats?.activeRequests, icon: 'exclamation-triangle', bg: 'bg-red-500/10', text: 'text-red-500' },
                    { label: 'Donors Responded', value: stats?.donorsResponded, icon: 'user-check', bg: 'bg-green-500/10', text: 'text-green-500' },
                    { label: 'Units Collected', value: stats?.unitsCollected, icon: 'tint', bg: 'bg-blue-500/10', text: 'text-blue-500' },
                    { label: 'Regional Success', value: stats?.successRate, icon: 'crown', bg: 'bg-yellow-500/10', text: 'text-yellow-500' },
                ].map((stat, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={index}
                        className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 hover:shadow-xl hover:-translate-y-1 transition-all group"
                    >
                        <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                            <i className={`fas fa-${stat.icon} ${stat.text} text-xl`}></i>
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                        <p className="text-3xl font-black text-gray-900 tracking-tighter">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden relative group">
                        <div className="px-10 py-8 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Geo-Coverage Terminal</h2>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Live donor proximity visualization</p>
                            </div>
                            <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active Sync</span>
                            </div>
                        </div>

                        <div className="relative h-[450px] bg-slate-50 overflow-hidden">
                            <GISMap 
                                center={user?.location ? [user.location.lat, user.location.lng] : [22.0797, 82.1391]} 
                                markers={mapMarkers}
                                zoom={12}
                            />
                        </div>
                    </div>

                    {/* New Action Center Section (Fills Empty Space Below Map) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { title: 'Fleet Logistics', desc: 'Manage blood transport vehicles', icon: 'truck-loading', color: 'text-blue-500', bg: 'bg-blue-50' },
                            { title: 'Donor Outreach', desc: 'Schedule regional blood drives', icon: 'bullhorn', color: 'text-purple-500', bg: 'bg-purple-50' },
                            { title: 'Lab Reports', desc: 'Review screening & testing results', icon: 'vials', color: 'text-green-500', bg: 'bg-green-50' },
                            { title: 'Crisis Response', desc: 'Activate regional emergency protocol', icon: 'shield-alt', color: 'text-red-500', bg: 'bg-red-50' }
                        ].map((action, i) => (
                            <motion.button
                                whileHover={{ scale: 1.02, y: -4 }}
                                whileTap={{ scale: 0.98 }}
                                key={i}
                                className="p-8 bg-white rounded-[2rem] border border-gray-100 text-left flex items-start group shadow-sm hover:shadow-xl transition-all"
                            >
                                <div className={`w-14 h-14 ${action.bg} rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform`}>
                                    <i className={`fas fa-${action.icon} ${action.color} text-xl`}></i>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-black text-gray-900 text-lg tracking-tight">{action.title}</h4>
                                    <p className="text-gray-400 font-bold text-xs mt-1 uppercase tracking-tight leading-relaxed">{action.desc}</p>
                                </div>
                                <i className="fas fa-arrow-right text-gray-200 self-center opacity-0 group-hover:opacity-100 transition-opacity ml-4"></i>
                            </motion.button>
                        ))}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="p-8 bg-gradient-to-br from-red-600 to-red-800 rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl shadow-red-200">
                        <div className="absolute -right-10 -top-10 opacity-10 rotate-12 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-700">
                            <i className="fas fa-exclamation-triangle text-9xl"></i>
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-widest mb-3">Urgent Need?</h3>
                        <p className="text-red-100 text-xs mb-8 font-bold leading-relaxed uppercase tracking-tight">Broadcast a critical alert to all eligible donors within 50km instantly.</p>
                        <button
                            onClick={triggerNewRequest}
                            className="w-full bg-white text-red-600 px-4 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transform hover:scale-105 active:scale-95 transition-all"
                        >
                            Broadcast Emergency
                        </button>
                    </div>

                    <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/30 flex justify-between items-center">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Blood Inventory</h2>
                            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                                <i className="fas fa-tint text-red-600 text-xs"></i>
                            </div>
                        </div>
                        <div className="p-8 space-y-8">
                            {Array.isArray(inventory) && inventory.map((item, i) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between items-end mb-3">
                                        <div>
                                            <span className="text-xl font-black text-gray-900 mr-2 tracking-tighter">{item.type}</span>
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${item.text} bg-white shadow-sm border border-gray-50`}>{item.status}</span>
                                        </div>
                                        <span className={`text-xl font-black ${item.text}`}>{item.units} <span className="text-[10px] text-gray-400 uppercase font-black">units</span></span>
                                    </div>
                                    <div className="w-full bg-gray-50 rounded-full h-4 border border-gray-100 p-[3px]">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(item.units / item.total) * 100}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className={`${item.bgColor} h-full rounded-full shadow-lg relative`}
                                        >
                                            <div className="absolute inset-0 bg-white/20 rounded-full h-1/2"></div>
                                        </motion.div>
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={() => setIsInventoryModalOpen(true)}
                                className="w-full mt-4 bg-gray-900 text-white hover:bg-black px-4 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-gray-200"
                            >
                                Manage Stock Inventory
                            </button>
                        </div>
                    </div>

                    <RecentContacts />
                </div>
            </div>

            <ManageInventoryModal
                isOpen={isInventoryModalOpen}
                onClose={() => {
                    setIsInventoryModalOpen(false);
                    fetchData();
                }}
                inventory={inventory}
                onRefresh={fetchData}
            />
            
            <ChatDialog isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} recipientName={selectedDonor || "Donor"} recipientId={null} />
            <CallModal isOpen={isCallOpen} onClose={() => setIsCallOpen(false)} recipientName={selectedDonor || "Donor"} phoneFallback="112" />
            <BloodSupplyForm isOpen={showBloodSupplyForm} onClose={() => setShowBloodSupplyForm(false)} onSuccess={() => setRequestsRefreshKey(k => k + 1)} />
        </motion.div>
    );
};

export default HospitalDashboard;
