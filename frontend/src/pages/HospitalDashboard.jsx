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
            <div className="glass-card mb-12 p-10 rounded-[3rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 blur-[120px] rounded-full group-hover:bg-red-600/10 transition-all duration-1000"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full"></div>
                
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 relative z-10">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Welcome back, {user?.name || "Hospital"}</h1>
                        <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] mt-4 flex items-center">
                            <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-3 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                            {user?.city || "Bilaspur"} Central Hub • System Online
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="text-right border-r border-slate-100 pr-6 hidden sm:block">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Global Impact Rank</p>
                            <p className="text-2xl font-black text-slate-900 tracking-tighter italic">#04 <span className="text-xs text-green-500 ml-1">↑2</span></p>
                        </div>
                        <button
                            onClick={triggerNewRequest}
                            className="btn-primary flex items-center px-8 py-5"
                        >
                            <i className="fas fa-plus mr-2 text-sm"></i> Emergency Request
                        </button>
                        <button
                            onClick={() => setShowBloodSupplyForm(true)}
                            className="btn-secondary flex items-center px-8 py-5 border-blue-100 text-blue-600 hover:text-blue-700"
                        >
                            <i className="fas fa-hand-holding-medical mr-2 text-sm"></i> Post Supply
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {[
                    { label: 'Active Requests', value: stats?.activeRequests, icon: 'exclamation-triangle', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
                    { label: 'Donors Responded', value: stats?.donorsResponded, icon: 'user-check', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
                    { label: 'Units Collected', value: stats?.unitsCollected, icon: 'tint', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                    { label: 'Success Rate', value: stats?.successRate, icon: 'crown', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
                ].map((stat, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={index}
                        className={`bg-white rounded-[2.5rem] shadow-sm border ${stat.border} p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group`}
                    >
                        <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform shadow-sm`}>
                            <i className={`fas fa-${stat.icon} ${stat.color} text-xl`}></i>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 leading-none">{stat.label}</p>
                        <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden relative group">
                        <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center group-hover:bg-white transition-colors">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Geo-Coverage Terminal</h2>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2">Live Radar Visualization</p>
                            </div>
                            <div className="flex items-center space-x-3 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-100">
                                <span className="flex h-2.5 w-2.5 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                </span>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Sync</span>
                            </div>
                        </div>

                        <div className="relative h-[480px] bg-slate-50 overflow-hidden">
                            <GISMap 
                                center={user?.location ? [user.location.lat, user.location.lng] : [22.0797, 82.1391]} 
                                markers={mapMarkers}
                                zoom={12}
                            />
                        </div>
                    </div>

                    {/* Action Center Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            { title: 'Fleet Logistics', desc: 'Blood transport monitoring', icon: 'truck-loading', color: 'text-blue-600', bg: 'bg-blue-50' },
                            { title: 'Donor Outreach', desc: 'Schedule regional drives', icon: 'bullhorn', color: 'text-purple-600', bg: 'bg-purple-50' },
                            { title: 'Lab Reports', desc: 'Screening & test results', icon: 'vials', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { title: 'Crisis Protocol', desc: 'Activate emergency mode', icon: 'shield-alt', color: 'text-rose-600', bg: 'bg-rose-50' }
                        ].map((action, i) => (
                            <motion.button
                                whileHover={{ scale: 1.02, y: -4 }}
                                whileTap={{ scale: 0.98 }}
                                key={i}
                                className="p-8 bg-white rounded-[2.5rem] border border-slate-100 text-left flex items-start group shadow-sm hover:shadow-2xl transition-all duration-500"
                            >
                                <div className={`w-16 h-16 ${action.bg} rounded-[1.5rem] flex items-center justify-center mr-6 group-hover:rotate-6 transition-transform shadow-sm`}>
                                    <i className={`fas fa-${action.icon} ${action.color} text-xl`}></i>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-black text-slate-900 text-xl tracking-tight leading-none mb-2">{action.title}</h4>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-tight leading-relaxed">{action.desc}</p>
                                </div>
                                <i className="fas fa-chevron-right text-slate-200 self-center opacity-0 group-hover:opacity-100 transition-all ml-4 group-hover:translate-x-1"></i>
                            </motion.button>
                        ))}
                    </div>
                </div>

                <div className="space-y-10">
                    <div className="p-10 bg-gradient-to-br from-red-600 to-rose-700 rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl shadow-red-200">
                        <div className="absolute -right-12 -top-12 opacity-10 rotate-12 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-1000">
                            <i className="fas fa-exclamation-triangle text-[12rem]"></i>
                        </div>
                        <h3 className="text-2xl font-black tracking-tight mb-4 leading-none">Emergency Broadcast</h3>
                        <p className="text-red-100 text-sm mb-10 font-medium leading-relaxed">Broadcast a critical alert to all eligible donors within the regional sector instantly.</p>
                        <button
                            onClick={triggerNewRequest}
                            className="btn-secondary w-full text-red-600 hover:text-red-700 border-none px-4 py-5"
                        >
                            Trigger Alert
                        </button>
                    </div>

                    <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden group">
                        <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center group-hover:bg-white transition-colors">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Stock Inventory</h2>
                            <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center border border-red-100">
                                <i className="fas fa-tint text-red-600 text-sm"></i>
                            </div>
                        </div>
                        <div className="p-10 space-y-10">
                            {Array.isArray(inventory) && inventory.map((item, i) => (
                                <div key={i} className="group/item">
                                    <div className="flex justify-between items-end mb-4">
                                        <div>
                                            <span className="text-2xl font-black text-slate-900 mr-3 tracking-tighter">{item.type}</span>
                                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-xl shadow-sm border border-white ${item.text} bg-slate-50`}>{item.status}</span>
                                        </div>
                                        <span className={`text-2xl font-black ${item.text} tracking-tighter`}>{item.units} <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest ml-1">Units</span></span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-5 border border-slate-200/50 p-1 group-hover/item:shadow-inner transition-all">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(item.units / item.total) * 100}%` }}
                                            transition={{ duration: 1.5, ease: "circOut" }}
                                            className={`${item.bgColor} h-full rounded-full shadow-lg relative overflow-hidden`}
                                        >
                                            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] animate-[shimmer-anim_2s_infinite]"></div>
                                        </motion.div>
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={() => setIsInventoryModalOpen(true)}
                                className="w-full mt-6 btn-secondary border-slate-200 text-slate-900 px-4 py-5"
                            >
                                Manage Hub Inventory
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
