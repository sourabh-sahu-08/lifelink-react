import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Users, FileText, Settings, LogOut, Search, Bell, Filter, MapPin, Clock, DollarSign, ChevronRight } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();

    const jobs = [
        { id: 1, title: 'Senior Frontend Engineer', company: 'TechFlow', location: 'San Francisco, CA', salary: '$140k - $180k', time: '2h ago', tags: ['React', 'TypeScript'] },
        { id: 2, title: 'Product Designer', company: 'Linear', location: 'Remote', salary: '$120k - $160k', time: '5h ago', tags: ['Figma', 'UI/UX'] },
        { id: 3, title: 'Backend Developer', company: 'Supabase', location: 'Singapore', salary: '$130k - $170k', time: '1d ago', tags: ['Node.js', 'PostgreSQL'] },
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-outfit flex">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-slate-100 hidden lg:flex flex-col p-8">
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                        <Briefcase className="text-white w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold text-slate-900 tracking-tight">JobLuxe</span>
                </div>

                <nav className="space-y-2 flex-1">
                    {[
                        { icon: Briefcase, label: 'Find Jobs', active: true },
                        { icon: Users, label: 'Companies' },
                        { icon: FileText, label: 'Applications' },
                        { icon: Bell, label: 'Notifications' },
                        { icon: Settings, label: 'Settings' },
                    ].map((item, i) => (
                        <button
                            key={i}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${item.active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-all mt-auto"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 md:p-12 overflow-y-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Hello, {user?.name || 'User'}!</h1>
                        <p className="text-slate-500 text-sm">Find your dream job today.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search jobs..."
                                className="bg-white border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-sm text-slate-700 outline-none focus:border-indigo-600/30 focus:ring-4 focus:ring-indigo-600/5 transition-all w-64 md:w-80"
                            />
                        </div>
                        <button className="bg-white border border-slate-100 p-3 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Recommended Jobs</h2>
                        <button className="text-indigo-600 text-sm font-bold hover:underline">View All</button>
                    </div>

                    <div className="space-y-4">
                        {jobs.map((job) => (
                            <motion.div
                                key={job.id}
                                whileHover={{ y: -4, shadow: '0 20px 40px -20px rgba(0,0,0,0.1)' }}
                                className="bg-white border border-slate-100 p-6 rounded-[2rem] flex flex-col md:flex-row md:items-center gap-6 cursor-pointer transition-all"
                            >
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                                    <Briefcase className="w-8 h-8 text-slate-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">{job.title}</h3>
                                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                                        <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> {job.salary}</span>
                                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {job.time}</span>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        {job.tags.map((tag, i) => (
                                            <span key={i} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-widest">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all flex items-center gap-2">
                                    Apply Now
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
