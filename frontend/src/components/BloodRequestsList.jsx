import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config/apiConfig';
import { useToast } from '../context/ToastContext';
import ChatDialog from './ChatDialog';

const urgencyColor = { Critical: 'text-red-600 bg-red-50 border-red-200', Urgent: 'text-orange-600 bg-orange-50 border-orange-200', Normal: 'text-green-600 bg-green-50 border-green-200' };

const BloodRequestsList = ({ refreshKey }) => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [respondingId, setRespondingId] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const openChat = (userName) => {
        setSelectedUser(userName);
        setIsChatOpen(true);
    };

    const fetchRequests = async () => {
        try {
            const params = user?.location ? { lat: user.location.lat, lng: user.location.lng } : {};
            const res = await axios.get(`${API_BASE_URL}/api/blood-requests`, { params });
            setRequests(res.data);
        } catch(e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchRequests(); }, [refreshKey]);

    const handleRespond = async (id) => {
        setRespondingId(id);
        try {
            await axios.post(`${API_BASE_URL}/api/blood-requests/${id}/respond`, { responderName: user?.name || user?.email });
            addToast('Great! You have responded to this blood request.', 'success');
            fetchRequests();
        } catch (e) { addToast('Failed to respond', 'error'); }
        finally { setRespondingId(null); }
    };

    if (loading) return <div className="text-center py-8 text-gray-400 text-sm">Loading requests...</div>;

    return (
        <div className="space-y-4">
            {requests.length === 0 ? (
                <div className="text-center py-10 opacity-50 flex flex-col items-center">
                    <i className="fas fa-check-circle text-4xl text-green-300 mb-3"></i>
                    <p className="text-xs text-gray-400 font-bold uppercase">No Open Requests right now</p>
                </div>
            ) : (
                requests.map((req, i) => (
                    <motion.div key={req._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className="p-4 bg-slate-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-lg hover:border-red-100 transition-all group">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-lg">
                                    {req.bloodType}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="font-black text-gray-900 text-sm">{req.requesterName}</p>
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border ${urgencyColor[req.urgency] || urgencyColor.Normal}`}>{req.urgency}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold mt-0.5 truncate">{req.units} units needed {req.city ? `• ${req.city}` : ''}</p>
                                    {req.reason && <p className="text-xs text-gray-500 mt-1 truncate">{req.reason}</p>}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 flex-shrink-0">
                                <button onClick={() => handleRespond(req._id)} disabled={respondingId === req._id}
                                    className="px-4 py-2 bg-red-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-sm disabled:opacity-50">
                                    {respondingId === req._id ? <i className="fas fa-spinner fa-spin"></i> : 'Provide'}
                                </button>
                                <button onClick={() => openChat(req.requesterName)}
                                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-sm flex items-center justify-center">
                                    <i className="fas fa-comment mr-1"></i> Message
                                </button>
                            </div>
                        </div>
                        <p className="text-[9px] text-gray-300 mt-2 font-bold">Posted {new Date(req.createdAt).toLocaleDateString()}</p>
                    </motion.div>
                ))
            )}
            <ChatDialog isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} recipientName={selectedUser || "User"} recipientId={null} />
        </div>
    );
};

export default BloodRequestsList;
