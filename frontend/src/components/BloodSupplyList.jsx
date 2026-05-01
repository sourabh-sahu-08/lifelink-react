import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config/apiConfig';
import { useToast } from '../context/ToastContext';
import ChatDialog from './ChatDialog';

const bloodTypeColors = { 'A+': 'bg-red-500', 'A-': 'bg-red-700', 'B+': 'bg-blue-500', 'B-': 'bg-blue-700', 'AB+': 'bg-purple-500', 'AB-': 'bg-purple-700', 'O+': 'bg-green-500', 'O-': 'bg-green-700' };

const BloodSupplyList = ({ refreshKey }) => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [supply, setSupply] = useState([]);
    const [loading, setLoading] = useState(true);
    const [claimingId, setClaimingId] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const openChat = (userName) => {
        setSelectedUser(userName);
        setIsChatOpen(true);
    };

    const fetchSupply = async () => {
        try {
            const params = user?.location ? { lat: user.location.lat, lng: user.location.lng } : {};
            const res = await axios.get(`${API_BASE_URL}/api/blood-supply`, { params });
            setSupply(res.data);
        } catch(e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchSupply(); }, [refreshKey]);

    const handleClaim = async (id) => {
        setClaimingId(id);
        try {
            await axios.post(`${API_BASE_URL}/api/blood-supply/${id}/claim`, { claimerName: user?.name || user?.email });
            addToast('Blood supply claimed! Hospital will be notified.', 'success');
            fetchSupply();
        } catch(e) { addToast('Failed to claim supply', 'error'); }
        finally { setClaimingId(null); }
    };

    if (loading) return <div className="text-center py-8 text-gray-400 text-sm">Checking available supply...</div>;

    return (
        <div className="space-y-4">
            {supply.length === 0 ? (
                <div className="text-center py-10 opacity-50 flex flex-col items-center">
                    <i className="fas fa-tint-slash text-4xl text-gray-300 mb-3"></i>
                    <p className="text-xs text-gray-400 font-bold uppercase">No blood supply available currently</p>
                </div>
            ) : (
                supply.map((s, i) => (
                    <motion.div key={s._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className="p-4 bg-slate-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-lg hover:border-blue-100 transition-all group">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className={`w-12 h-12 ${bloodTypeColors[s.bloodType] || 'bg-gray-500'} rounded-2xl flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-lg`}>
                                    {s.bloodType}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-gray-900 text-sm truncate">{s.hospitalName}</p>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold mt-0.5">{s.units} units available {s.city ? `• ${s.city}` : ''}</p>
                                    {s.expiryDate && <p className="text-[9px] text-orange-500 font-bold mt-0.5"><i className="fas fa-clock mr-1"></i>Expires: {s.expiryDate}</p>}
                                    {s.notes && <p className="text-xs text-gray-500 mt-1 truncate">{s.notes}</p>}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 flex-shrink-0">
                                <button onClick={() => handleClaim(s._id)} disabled={claimingId === s._id}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[9px] font-semibold uppercase tracking-widest hover:bg-black transition-all shadow-sm disabled:opacity-50">
                                    {claimingId === s._id ? <i className="fas fa-spinner fa-spin"></i> : 'Claim'}
                                </button>
                                <button onClick={() => openChat(s.hospitalName)}
                                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[9px] font-semibold uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-sm flex items-center justify-center">
                                    <i className="fas fa-comment mr-1"></i> Message
                                </button>
                            </div>
                        </div>
                        <p className="text-[9px] text-gray-300 mt-2 font-bold">Posted {new Date(s.createdAt).toLocaleDateString()}</p>
                    </motion.div>
                ))
            )}
            <ChatDialog isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} recipientName={selectedUser || "Hospital"} recipientId={null} />
        </div>
    );
};

export default BloodSupplyList;
