import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import API_BASE_URL from '../config/apiConfig';

const ChatDialog = ({ isOpen, onClose, recipientName, recipientId }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [conversationId, setConversationId] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen && user && recipientName) {
            // Get or create conversation
            const initChat = async () => {
                try {
                    const senderIdentifier = user.name || user.email; // Fallback
                    const res = await fetch(`${API_BASE_URL}/api/conversations`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ sender: senderIdentifier, receiver: recipientName })
                    });
                    const conv = await res.json();
                    setConversationId(conv._id);
                    
                    // Fetch existing messages
                    const msgRes = await fetch(`${API_BASE_URL}/api/messages/${conv._id}`);
                    const dbMessages = await msgRes.json();
                    setMessages(dbMessages);
                    scrollToBottom();
                } catch(e) { console.error("Chat init error", e); }
            };
            initChat();
        }
    }, [isOpen, user, recipientName]);

    // Simple polling for new messages when open
    useEffect(() => {
        if (!isOpen || !conversationId) return;
        const interval = setInterval(async () => {
            const res = await fetch(`${API_BASE_URL}/api/messages/${conversationId}`);
            if(res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [isOpen, conversationId]);

    useEffect(() => { scrollToBottom(); }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || !conversationId) return;

        const senderIdentifier = user.name || user.email;
        const newMsg = {
            conversationId,
            sender: senderIdentifier,
            text: input
        };

        // Optimistic update
        setMessages(prev => [...prev, { ...newMsg, _id: Date.now() }]);
        setInput('');

        try {
            await fetch(`${API_BASE_URL}/api/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMsg)
            });
            // Let polling sync it exactly, but optimistic is visually instantaneous
        } catch(err) {
            console.error(err);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                />
                
                <motion.div
                    initial={{ scale: 0.9, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 20, opacity: 0 }}
                    className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[85vh]"
                >
                    {/* Header */}
                    <div className="px-6 py-4 bg-gradient-to-r from-red-600 to-rose-600 flex justify-between items-center text-white shadow-md z-10">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg uppercase">
                                {recipientName.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg leading-tight">{recipientName}</h3>
                                <p className="text-red-100 text-xs flex items-center">
                                    <span className="w-2 h-2 rounded-full bg-green-400 mr-1 animate-pulse" /> 
                                    Active Now
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 bg-slate-50 p-4 overflow-y-auto space-y-4">
                        <p className="text-center text-xs text-gray-400 my-4">Conversation started with {recipientName}</p>
                        
                        {messages.map((m, i) => {
                            const isMe = m.sender === (user.name || user.email);
                            return (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    key={m._id || i}
                                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[75%] px-4 py-2 text-sm shadow-sm ${
                                        isMe 
                                        ? 'bg-gradient-to-br from-red-600 to-rose-500 text-white rounded-2xl rounded-tr-sm' 
                                        : 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm'
                                    }`}>
                                        <p>{m.text}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-slate-50 border border-gray-200 rounded-full px-4 py-3 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                        />
                        <button 
                            type="submit" 
                            disabled={!input.trim()}
                            className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <svg className="w-5 h-5 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </form>
                </motion.div>
            </div>
            )}
        </AnimatePresence>
    );
};

export default ChatDialog;
