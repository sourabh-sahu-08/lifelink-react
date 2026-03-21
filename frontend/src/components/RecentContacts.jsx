import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config/apiConfig';
import ChatDialog from './ChatDialog';
import CallModal from './CallModal';

const RecentContacts = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isCallOpen, setIsCallOpen] = useState(false);

    useEffect(() => {
        const fetchConversations = async () => {
            if (!user) return;
            try {
                const userIdentifier = user.name || user.email;
                const res = await axios.get(`${API_BASE_URL}/api/conversations/${encodeURIComponent(userIdentifier)}`);
                setConversations(res.data);
            } catch(e) { console.error("Error fetching conversations", e); }
        };
        fetchConversations();
        const interval = setInterval(fetchConversations, 5000);
        return () => clearInterval(interval);
    }, [user]);

    const openChat = (contactName) => {
        setSelectedContact(contactName);
        setIsChatOpen(true);
    };

    const openCall = (contactName) => {
        setSelectedContact(contactName);
        setIsCallOpen(true);
    };

    return (
        <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-6">
            <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-4 flex items-center justify-between">
                <span><i className="fas fa-address-book mr-3 text-blue-500"></i> Direct Messages</span>
                <span className="bg-blue-50 px-2 py-1 rounded text-blue-600">{conversations.length}</span>
            </h3>
            
            <div className="space-y-3 overflow-y-auto max-h-[200px] pr-1">
                {conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center opacity-50 py-6">
                        <i className="fas fa-inbox text-3xl text-gray-300 mb-2"></i>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Inbox is Empty</p>
                    </div>
                ) : (
                    conversations.map(conv => {
                        const userIdentifier = user.name || user.email;
                        const otherParticipant = conv.participants.find(p => p !== userIdentifier) || "Unknown User";
                        
                        return (
                            <div key={conv._id} className="p-4 bg-slate-50 rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between group hover:bg-white hover:border-blue-100 hover:shadow-lg transition-all gap-4">
                                <div className="flex items-center space-x-4 flex-1 w-full min-w-0">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center font-black text-blue-600 text-xs flex-shrink-0">
                                        {otherParticipant.charAt(0)}{otherParticipant.split(' ')[1]?.[0] || ''}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-black text-gray-900 truncate">{otherParticipant}</p>
                                        <p className="text-[10px] text-gray-400 font-bold truncate">
                                            {conv.lastMessage || "Started a new conversation..."}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button 
                                        onClick={() => openCall(otherParticipant)}
                                        className="w-10 h-10 rounded-full bg-green-50 text-green-600 hover:bg-green-500 hover:text-white flex items-center justify-center transition-all hover:shadow-md"
                                        title="Call Contact"
                                    >
                                        <i className="fas fa-phone text-xs"></i>
                                    </button>
                                    <button 
                                        onClick={() => openChat(otherParticipant)}
                                        className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all hover:shadow-md"
                                        title="Message Contact"
                                    >
                                        <i className="fas fa-comment text-xs"></i>
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <ChatDialog isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} recipientName={selectedContact || "Contact"} recipientId={null} />
            <CallModal isOpen={isCallOpen} onClose={() => setIsCallOpen(false)} recipientName={selectedContact || "Contact"} phoneFallback="112" />
        </div>
    );
};

export default RecentContacts;
