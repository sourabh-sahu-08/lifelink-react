import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from '../components/Skeleton';
import { useOutletContext } from 'react-router-dom';

const Requests = () => {
    const { triggerResponse } = useOutletContext();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('All');

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/requests');
                setRequests(response.data);
            } catch (error) {
                console.error("Error fetching requests:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    const filteredRequests = (Array.isArray(requests) ? requests : []).filter(req => {
        const matchesSearch = req.hospital.toLowerCase().includes(search.toLowerCase()) ||
            req.bloodType.toLowerCase().includes(search.toLowerCase());
        const matchesType = filterType === 'All' || req.bloodType === filterType;
        return matchesSearch && matchesType;
    });

    const bloodTypes = ['All', 'O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
        >
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Blood Requests</h1>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2">Real-time emergency broadcast</p>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2 relative">
                        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        <input
                            type="text"
                            placeholder="Search by hospital or blood type..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-gray-700 focus:border-red-500 focus:bg-white transition-all outline-none"
                        />
                    </div>
                    <div className="relative">
                        <i className="fas fa-tint absolute left-4 top-1/2 -translate-y-1/2 text-red-500"></i>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-gray-700 focus:border-red-500 focus:bg-white transition-all outline-none appearance-none"
                        >
                            {bloodTypes.map(type => <option key={type} value={type}>{type === 'All' ? 'All Types' : type}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center justify-center bg-gray-50 rounded-2xl border border-gray-100">
                        <span className="font-black text-red-600">{filteredRequests.length}</span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Total Found</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3, 4, 5, 6].map(n => (
                        <div key={n} className="bg-white p-6 rounded-3xl space-y-4 shadow-xl border border-gray-100">
                            <Skeleton className="h-12 w-12 rounded-2xl" />
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-12 w-full mt-4" />
                        </div>
                    ))
                ) : filteredRequests.length > 0 ? (
                    <AnimatePresence>
                        {Array.isArray(filteredRequests) && filteredRequests.map((request) => (
                            <motion.div
                                key={request.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={`bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ${request.urgency === 'Critical' ? 'ring-2 ring-red-500 ring-opacity-20' : ''}`}
                            >
                                {request.urgency === 'Critical' && (
                                    <div className="absolute top-0 right-0 px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-xl animate-pulse">Critical</div>
                                )}

                                <div className="flex items-center mb-6">
                                    <div className={`blood-type-badge ${request.bloodType.includes('O') ? 'type-o' : request.bloodType.includes('A') ? 'type-a' : 'type-b'} shadow-lg group-hover:scale-110 transition-transform`}>
                                        {request.bloodType}
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="font-black text-gray-900 leading-tight">{request.hospital}</h3>
                                        <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">{request.distance} away</p>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-2xl">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Diagnosis / Reason</p>
                                        <p className="font-bold text-gray-700 text-sm line-clamp-2">{request.reason}</p>
                                    </div>

                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <span className="flex items-center"><i className="fas fa-tint mr-2 text-red-500"></i> {request.units} Units</span>
                                        <span className="flex items-center"><i className="fas fa-clock mr-2 text-blue-500"></i> {request.time}</span>
                                    </div>

                                    <button
                                        onClick={() => triggerResponse(request)}
                                        className="w-full bg-red-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-red-100 hover:bg-red-700 transition-all transform active:scale-[0.98]"
                                    >
                                        Respond Now
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                ) : (
                    <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-search text-gray-300 text-2xl"></i>
                        </div>
                        <h3 className="font-black text-gray-900">No requests found</h3>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Try adjusting your filters</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Requests;
