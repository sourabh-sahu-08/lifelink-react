import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../config/apiConfig';

const SUGGESTIONS = [
    "Am I eligible to donate?",
    "How do I request blood?",
    "Tell me about rewards",
    "How does LifeLink work?"
];

const ChatMessage = ({ msg }) => {
    const isBot = msg.sender === 'bot';
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex w-full mb-4 ${isBot ? 'justify-start' : 'justify-end'}`}
        >
            {isBot && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-500 to-rose-600 flex items-center justify-center mr-2 shadow-md flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                </div>
            )}
            <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                isBot 
                ? 'bg-white text-gray-800 rounded-tl-none border border-gray-100' 
                : 'bg-gradient-to-r from-red-600 to-rose-500 text-white rounded-tr-none'
            }`}>
                <p className="whitespace-pre-line">{msg.text}</p>
                <span className={`text-[10px] block mt-1 ${isBot ? 'text-gray-400' : 'text-red-100'}`}>
                    {msg.time}
                </span>
            </div>
        </motion.div>
    );
};

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm the LifeLink AI Assistant 🩸. How can I help you today?", sender: 'bot', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (text = input) => {
        if (!text.trim()) return;

        const userMsg = {
            id: Date.now(),
            text: text,
            sender: 'user',
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        };

        const currentMessages = [...messages, userMsg];
        setMessages(currentMessages);
        setInput('');
        setIsTyping(true);

        try {
            // Include up to last 4 messages for context (excluding the new one)
            const history = messages.slice(-4).map(m => ({ text: m.text, sender: m.sender }));
            
            const response = await fetch(`${API_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, history })
            });
            const data = await response.json();
            
            const botMsg = {
                id: Date.now() + 1,
                text: data.response || data.error || "Sorry, I encountered an error communicating with the brain.",
                sender: 'bot',
                time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error(error);
            const errorMsg = {
                id: Date.now() + 1,
                text: "Network error! Make sure the backend is running and connected.",
                sender: 'bot',
                time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="mb-4 w-80 sm:w-96 bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl overflow-hidden flex flex-col"
                        style={{ height: '500px', maxHeight: '80vh' }}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-4 flex items-center justify-between shadow-md z-10">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg leading-tight">LifeLink AI</h3>
                                    <span className="text-red-100 text-xs flex items-center">
                                        <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                                        Online
                                    </span>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="text-white/80 hover:text-white transition-colors p-1"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 scroll-smooth">
                            {messages.map((msg) => (
                                <ChatMessage key={msg.id} msg={msg} />
                            ))}
                            
                            {isTyping && (
                                <motion.div 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="flex w-full mb-4 justify-start"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-500 to-rose-600 flex items-center justify-center mr-2 shadow-md">
                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                        </svg>
                                    </div>
                                    <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Suggestions */}
                        {messages.length < 3 && !isTyping && (
                            <div className="px-4 pb-2 flex flex-wrap gap-2">
                                {SUGGESTIONS.map((sug, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSend(sug)}
                                        className="text-xs text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap shadow-sm"
                                    >
                                        {sug}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-100">
                            <form 
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="relative flex items-center"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your question..."
                                    className="w-full bg-slate-50 border border-gray-200 text-gray-800 text-sm rounded-full pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all shadow-inner"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isTyping}
                                    className={`absolute right-1 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                        input.trim() && !isTyping 
                                        ? 'bg-red-600 text-white shadow-md hover:bg-red-700 hover:scale-105' 
                                        : 'bg-transparent text-gray-400'
                                    }`}
                                >
                                    <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xl flex items-center justify-center relative group"
            >
                {isOpen ? (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                )}
                
                {/* Notification Badge */}
                {!isOpen && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></span>
                )}
            </motion.button>
        </div>
    );
};

export default Chatbot;
