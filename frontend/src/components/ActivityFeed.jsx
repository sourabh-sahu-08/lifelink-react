import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../config/apiConfig';

const ActivityFeed = ({ limit = 3 }) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/activity`);
                if (Array.isArray(response.data)) {
                    setActivities(response.data.slice(0, limit));
                }
            } catch (error) {
                console.error("Error fetching activity:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchActivity();
        const interval = setInterval(fetchActivity, 10000); // Polling for "live" feel
        return () => clearInterval(interval);
    }, [limit]);

    return (
        <div className="space-y-4">
            <AnimatePresence mode="popLayout">
                {Array.isArray(activities) && activities.map((activity, i) => (
                    <motion.div
                        key={activity.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center p-4 bg-gray-50/50 rounded-2xl border border-transparent hover:border-gray-100 hover:bg-white transition-all group"
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 shadow-sm ${activity.type === 'request' ? 'bg-red-100 text-red-600' :
                            activity.type === 'donation' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                            <i className={`fas fa-${activity.type === 'request' ? 'exclamation-circle' :
                                activity.type === 'donation' ? 'heart' : 'sync'
                                } text-sm`}></i>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-black text-gray-900 group-hover:text-red-600 transition-colors">{activity.user}</p>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{activity.action}</p>
                        </div>
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{activity.time}</span>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ActivityFeed;
