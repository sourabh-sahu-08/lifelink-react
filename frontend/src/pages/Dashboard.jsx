import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Heart, Droplets, Activity, LogOut, Search, Bell, MapPin, Clock, ChevronRight, Users, Calendar } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();

    const stats = [
        { label: 'Blood Requests', value: '12', icon: Droplets, color: 'text-red-600', bg: 'bg-red-50' },
        { label: 'Lives Saved', value: '34', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50' },
        { label: 'Active Donors', value: '1.2k', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'City Rank', value: '#04', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    const urgentRequests = [
        { id: 1, hospital: 'Apollo Central', bloodType: 'O-', units: '2 Units', distance: '1.2km', time: '10 mins ago' },
        { id: 2, hospital: 'City Care', bloodType: 'A+', units: '5 Units', distance: '3.5km', time: '25 mins ago' },
        { id: 3, hospital: 'Red Cross Bilaspur', bloodType: 'B+', units: '1 Unit', distance: '0.8km', time: '1h ago' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-outfit flex">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-slate-100 hidden lg:flex flex-col p-8">
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-100">
                        <Heart className="text-white w-5 h-5 fill-current" />
                    </div>
                    <span className="text-xl font-bold text-slate-900 tracking-tight">LifeLink</span>
                </div>

                <nav className="space-y-2 flex-1">
                    {[
                        { icon: Activity, label: 'Overview', active: true },
                        { icon: Droplets, label: 'Blood Requests' },
                        { icon: MapPin, label: 'Find Centers' },
                        { icon: Calendar, label: 'Donation History' },
                        { icon: Bell, label: 'Emergency Alerts' },
                    ].map((item, i) => (
                        <button
                            key={i}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${item.active ? 'bg-red-50 text-red-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all mt-auto"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 md:p-12 overflow-y-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Welcome back, {user?.name || 'Hero'}!</h1>
                        <p className="text-slate-500 text-sm">Your contribution matters. Every drop counts.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search hospitals or types..."
                                className="bg-white border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-sm text-slate-700 outline-none focus:border-red-600/30 focus:ring-4 focus:ring-red-600/5 transition-all w-64 md:w-80"
                            />
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all">
                            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                        </div>
                    ))}
                </div>

                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Urgent Blood Requests</h2>
                        <button className="text-red-600 text-sm font-bold hover:underline">View Live Map</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {urgentRequests.map((req) => (
                            <motion.div
                                key={req.id}
                                whileHover={{ y: -4 }}
                                className="bg-white border border-slate-100 p-6 rounded-[2.5rem] relative overflow-hidden group cursor-pointer"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-red-500/10 transition-all"></div>
                                
                                <div className="flex justify-between items-start mb-6">
                                    <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xl font-black italic">
                                        {req.bloodType}
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <Clock className="w-3 h-3" /> {req.time}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-slate-900 mb-2">{req.hospital}</h3>
                                <div className="space-y-2 mb-6">
                                    <p className="text-sm text-slate-500 flex items-center gap-2"><Droplets className="w-4 h-4 text-red-400" /> {req.units}</p>
                                    <p className="text-sm text-slate-500 flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" /> {req.distance} away</p>
                                </div>

                                <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-600 transition-all flex items-center justify-center gap-2">
                                    Respond Now
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;
