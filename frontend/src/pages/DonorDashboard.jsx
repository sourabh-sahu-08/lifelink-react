import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import Skeleton from '../components/Skeleton';
import { useToast } from '../context/ToastContext';
import ActivityFeed from '../components/ActivityFeed';
import RecentContacts from '../components/RecentContacts';
import BloodRequestForm from '../components/BloodRequestForm';
import BloodSupplyList from '../components/BloodSupplyList';
import BloodRequestsList from '../components/BloodRequestsList';
import GISMap from '../components/GISMap';
import API_BASE_URL from '../config/apiConfig';

const DonorDashboard = () => {
    const { triggerResponse, user } = useOutletContext();
    const [showQuiz, setShowQuiz] = useState(false);
    const [quizIndex, setQuizIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [quizResult, setQuizResult] = useState(null);
    const [stats, setStats] = useState(null);
    const [mapMarkers, setMapMarkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBloodRequestForm, setShowBloodRequestForm] = useState(false);
    const [supplyRefreshKey, setSupplyRefreshKey] = useState(0);
    const { addToast } = useToast();

    const eligibilityQuestions = [
        {
            id: 1,
            question: "Have you donated blood in the last 56 days?",
            description: "There must be a minimum of 8 weeks (56 days) between whole blood donations.",
            options: [
                { text: "No, it's been more than 56 days", value: "eligible", points: 1 },
                { text: "Yes, within the last 56 days", value: "ineligible", points: 0 }
            ],
            type: "radio"
        },
        {
            id: 2,
            question: "Do you weigh at least 50kg (110 lbs)?",
            description: "For your safety and to ensure you have adequate blood volume to donate.",
            options: [
                { text: "Yes, I weigh at least 50kg", value: "eligible", points: 1 },
                { text: "No, I weigh less than 50kg", value: "ineligible", points: 0 }
            ],
            type: "radio"
        },
        {
            id: 3,
            question: "Are you currently feeling healthy and well?",
            description: "You should not donate if you have a cold, flu, sore throat, or any infection.",
            options: [
                { text: "Yes, I feel healthy today", value: "eligible", points: 1 },
                { text: "No, I'm not feeling well", value: "ineligible", points: 0 }
            ],
            type: "radio"
        }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, reqsRes, supplyRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/stats`),
                    axios.get(`${API_BASE_URL}/api/blood-requests`),
                    axios.get(`${API_BASE_URL}/api/blood-supply`)
                ]);
                setStats(statsRes.data.donorStats);
                
                const markers = [
                    ...reqsRes.data.filter(r => r.location).map(r => ({ ...r.location, title: r.requesterName, type: 'Request', bloodType: r.bloodType, units: r.units })),
                    ...supplyRes.data.filter(s => s.location).map(s => ({ ...s.location, title: s.hospitalName, type: 'Supply', bloodType: s.bloodType, units: s.units }))
                ];
                setMapMarkers(markers);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleQuizOption = (questionId, value) => {
        setUserAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const nextQuestion = () => {
        if (quizIndex < eligibilityQuestions.length - 1) {
            setQuizIndex(quizIndex + 1);
        } else {
            const score = Object.values(userAnswers).filter(v => v === 'eligible').length;
            const result = score === eligibilityQuestions.length ? 'eligible' : 'ineligible';
            setQuizResult(result);
            if (result === 'eligible') {
                addToast("Congratulations! You are eligible to donate.", "success");
            } else {
                addToast("You are currently ineligible. Please check criteria.", "info");
            }
        }
    };

    const [showCertificate, setShowCertificate] = useState(false);

    const achievements = [
        { id: 1, title: "Life Saver", icon: "heart", color: "text-red-500", bg: "bg-red-50", condition: stats?.livesSaved >= 10, label: "10+ Lives Saved" },
        { id: 2, title: "Swift Hand", icon: "bolt", color: "text-yellow-500", bg: "bg-yellow-50", condition: stats?.avgResponse <= 15, label: "Under 15m Response" },
        { id: 3, title: "Elite Donor", icon: "crown", color: "text-purple-500", bg: "bg-purple-50", condition: stats?.donations >= 5, label: "5+ Donations" },
        { id: 4, title: "Community Star", icon: "star", color: "text-blue-500", bg: "bg-blue-50", condition: stats?.cityRank <= 100, label: "Top 100 City Rank" }
    ];

    if (loading) return (
        <div className="p-8 space-y-8">
            <Skeleton className="h-64 w-full rounded-3xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Skeleton className="h-96 col-span-2 rounded-3xl" />
                <Skeleton className="h-96 rounded-3xl" />
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Hero Card */}
            <div className="glass-card mb-12 overflow-hidden rounded-[3rem] relative group">
                <div className="h-64 bg-gradient-to-br from-red-600 via-rose-600 to-red-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),transparent)]"></div>
                    
                    {/* Abstract background elements */}
                    <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-1000"></div>
                    <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-1000"></div>

                    <div className="absolute top-10 right-10 flex gap-4">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl cursor-pointer hover:bg-white/20 transition-all hover:scale-110 active:scale-95">
                            <i className="fas fa-share-alt text-white"></i>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl cursor-pointer hover:bg-white/20 transition-all hover:scale-110 active:scale-95">
                            <i className="fas fa-cog text-white"></i>
                        </div>
                    </div>
                </div>

                <div className="px-12 pb-12 relative">
                    <div className="absolute -top-28 left-12">
                        <div className="relative">
                            <div className="h-48 w-48 rounded-[3rem] border-[12px] border-white shadow-2xl overflow-hidden bg-white group-hover:shadow-red-500/10 transition-all duration-500">
                                <img
                                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    src={`https://ui-avatars.com/api/?name=${user?.name}&background=fecaca&color=b91c1c&size=512`}
                                    alt="Donor"
                                />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-green-500 w-12 h-12 rounded-2xl border-4 border-white flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                                <i className="fas fa-check text-white text-sm"></i>
                            </div>
                        </div>
                    </div>

                    <div className="pt-28 flex flex-col xl:flex-row justify-between items-start gap-10">
                        <div className="flex-1">
                            <div className="flex items-center flex-wrap gap-4">
                                <h1 className="text-5xl font-black text-slate-900 tracking-tighter">{user?.name}</h1>
                                <span className="blood-type-badge type-b text-2xl px-6 py-2 h-auto rounded-2xl shadow-xl shadow-red-100">
                                    {user?.bloodType}
                                </span>
                            </div>
                            
                            <div className="flex flex-wrap items-center mt-5 gap-6">
                                <div className="flex items-center bg-yellow-400/10 px-4 py-2 rounded-2xl border border-yellow-200/50 shadow-sm">
                                    <div className="flex text-yellow-500 text-xs">
                                        {[1, 2, 3, 4].map(i => <i key={i} className="fas fa-star mr-0.5"></i>)}
                                        <i className="fas fa-star-half-alt"></i>
                                    </div>
                                    <span className="ml-2.5 text-[10px] font-black text-yellow-700 tracking-widest uppercase">Top Rated Donor</span>
                                </div>
                                <div className="flex items-center text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center mr-3">
                                        <i className="fas fa-map-marker-alt text-red-500"></i>
                                    </div>
                                    {user?.city || "Bilaspur"} • Active Since 2024
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 max-w-md">
                            {achievements.map(achieve => (
                                <div 
                                    key={achieve.id} 
                                    className={`px-5 py-3 rounded-2xl flex items-center space-x-3 border transition-all duration-300 ${
                                        achieve.condition 
                                            ? `${achieve.bg} border-${achieve.color.split('-')[1]}-100 shadow-sm hover:shadow-md hover:-translate-y-1` 
                                            : 'bg-slate-50 border-slate-100 grayscale opacity-40'
                                    }`}
                                >
                                    <i className={`fas fa-${achieve.icon} ${achieve.condition ? achieve.color : 'text-slate-400'} text-xs`}></i>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${achieve.condition ? 'text-slate-800' : 'text-slate-400'}`}>
                                        {achieve.title}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-[2.5rem] border border-slate-100 text-center min-w-[180px] shadow-inner group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-500 xl:absolute xl:top-0 xl:right-0">
                            <div className="text-5xl font-black gradient-text tracking-tighter leading-none mb-2">{stats?.cityRank}</div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-[0.3em] font-black">City Ranking</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
                        {[
                            { label: 'Donations', value: stats?.donations, icon: 'tint', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
                            { label: 'Lives Saved', value: stats?.livesSaved, icon: 'heart', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
                            { label: 'Avg Speed', value: `${stats?.avgResponse}m`, icon: 'bolt', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
                            { label: 'Impact Rank', value: stats?.responseRate, icon: 'award', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
                        ].map((stat, i) => (
                            <div 
                                key={i} 
                                className={`p-8 ${stat.bg} ${stat.border} rounded-[2.5rem] border hover:bg-white hover:shadow-2xl hover:scale-105 transition-all duration-500 group/stat`}
                            >
                                <div className={`w-14 h-14 ${stat.bg.replace('50', '100')} rounded-[1.5rem] flex items-center justify-center mb-6 transition-transform group-hover/stat:rotate-12 shadow-sm`}>
                                    <i className={`fas fa-${stat.icon} ${stat.color} text-xl`}></i>
                                </div>
                                <div className="text-4xl font-black text-slate-900 group-hover/stat:scale-110 transition-transform origin-left tracking-tight">{stat.value}</div>
                                <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Need Blood? Section - Unique to Donor */}
                    <div className="bg-gradient-to-br from-rose-600 via-red-600 to-red-800 rounded-[2.5rem] shadow-2xl p-10 text-white relative overflow-hidden group border border-red-400/20">
                        <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                            <i className="fas fa-hand-holding-heart text-[10rem]"></i>
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="text-center md:text-left">
                                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md mx-auto md:mx-0">
                                    <i className="fas fa-tint text-2xl"></i>
                                </div>
                                <h3 className="text-3xl font-black tracking-tight">Need Blood?</h3>
                                <p className="text-red-100 text-sm mt-3 leading-relaxed max-w-xs">Post an emergency blood request. Hospitals and supply networks will respond directly.</p>
                            </div>
                            <button onClick={() => setShowBloodRequestForm(true)}
                                className="btn-secondary px-10 py-5 text-red-600 hover:text-red-700 w-full md:w-auto">
                                <i className="fas fa-plus mr-2"></i>Request Blood
                            </button>
                        </div>
                    </div>

                    {/* Available Blood Supply from Hospitals */}
                    <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden group">
                        <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between group-hover:bg-white transition-colors">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Geo-Supply Network</h2>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2">Hospital Reserves Near You</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
                                <i className="fas fa-hospital text-blue-600 text-lg"></i>
                            </div>
                        </div>
                        <div className="p-8">
                            <BloodSupplyList refreshKey={supplyRefreshKey} />
                        </div>
                    </div>

                    {/* Eligibility Checker */}
                    <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden group">
                        <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center group-hover:bg-white transition-colors">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Health Assessment</h2>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2">Status: {quizResult ? quizResult.toUpperCase() : 'PENDING'}</p>
                            </div>
                            <div className={`p-4 rounded-2xl ${quizResult === 'eligible' ? 'bg-green-50 text-green-600 border border-green-100' : quizResult === 'ineligible' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                                <i className={`fas fa-${quizResult === 'eligible' ? 'check-circle' : quizResult === 'ineligible' ? 'times-circle' : 'stethoscope'} text-xl`}></i>
                            </div>
                        </div>
                        <div className="p-10">
                            {quizResult ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                                    <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
                                        {quizResult === 'eligible' ? 'Ready to Save Lives!' : 'Wait for a Better Time'}
                                    </h3>
                                    <p className="text-slate-500 font-medium mb-10 max-w-md mx-auto leading-relaxed">
                                        {quizResult === 'eligible' ?
                                            'Your health assessment is clear. We will alert you the moment a critical need arises for your blood type.' :
                                            'Based on your responses, we recommend waiting a few more weeks. Your safety and the patient\'s health are our priority.'
                                        }
                                    </p>
                                    <button
                                        onClick={() => { setQuizResult(null); setShowQuiz(true); setQuizIndex(0); setUserAnswers({}); }}
                                        className="btn-secondary px-12 py-5"
                                    >
                                        Re-take Assessment
                                    </button>
                                </motion.div>
                            ) : showQuiz ? (
                                <div className="slide-in">
                                    <div className="mb-10">
                                        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">
                                            <span>Progress</span>
                                            <span>{Math.round(((quizIndex + 1) / eligibilityQuestions.length) * 100)}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${((quizIndex + 1) / eligibilityQuestions.length) * 100}%` }}
                                                className="bg-red-600 h-full shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                                            ></motion.div>
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">{eligibilityQuestions[quizIndex].question}</h3>
                                    <p className="text-sm text-slate-500 font-medium mb-10 border-l-4 border-red-500 pl-6 py-1 leading-relaxed">{eligibilityQuestions[quizIndex].description}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                                        {eligibilityQuestions[quizIndex].options.map((opt, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleQuizOption(eligibilityQuestions[quizIndex].id, opt.value)}
                                                className={`p-8 rounded-[2rem] border-2 transition-all flex items-center justify-between group ${userAnswers[eligibilityQuestions[quizIndex].id] === opt.value ? 'border-red-600 bg-red-50 shadow-xl shadow-red-100' : 'border-slate-50 bg-slate-50 hover:border-slate-200 hover:bg-white'}`}
                                            >
                                                <span className={`font-black text-xs uppercase tracking-widest ${userAnswers[eligibilityQuestions[quizIndex].id] === opt.value ? 'text-red-600' : 'text-slate-500'}`}>{opt.text}</span>
                                                <div className={`w-8 h-8 rounded-2xl border-2 flex items-center justify-center transition-all ${userAnswers[eligibilityQuestions[quizIndex].id] === opt.value ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-200' : 'border-slate-300'}`}>
                                                    {userAnswers[eligibilityQuestions[quizIndex].id] === opt.value && <i className="fas fa-check text-xs"></i>}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            onClick={nextQuestion}
                                            disabled={!userAnswers[eligibilityQuestions[quizIndex].id]}
                                            className="btn-primary"
                                        >
                                            {quizIndex === eligibilityQuestions.length - 1 ? 'Finish Assessment' : 'Next Question'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                                    <div className="flex items-center space-x-8">
                                        <div className="bg-red-50 p-8 rounded-[2.5rem] shadow-inner border border-red-100">
                                            <i className="fas fa-notes-medical text-red-500 text-4xl"></i>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-black text-slate-900 tracking-tight">Active Status Check</p>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-3 leading-relaxed">Safety assessment required for active membership</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowQuiz(true)}
                                        className="btn-primary w-full md:w-auto"
                                    >
                                        Start Health Check
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Live Network Map */}
                    <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden group">
                        <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center group-hover:bg-white transition-colors">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Geo-Sync Network</h2>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2">Live Proximity Radar</p>
                            </div>
                            <span className="bg-blue-50 text-blue-600 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border border-blue-100">Active</span>
                        </div>
                        <div className="h-[450px]">
                            <GISMap 
                                center={user?.location ? [user.location.lat, user.location.lng] : [22.0797, 82.1391]} 
                                markers={mapMarkers} 
                            />
                        </div>
                    </div>

                    {/* Active Requests */}
                    <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden group">
                        <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center group-hover:bg-white transition-colors">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Critical Alerts</h2>
                            <span className="bg-red-50 text-red-600 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] animate-pulse border border-red-100">Live Feed</span>
                        </div>
                        <div className="p-10">
                            <BloodRequestsList refreshKey={supplyRefreshKey} />
                        </div>
                    </div>
                </div>

                <div className="space-y-10">
                    <RecentContacts />
                    {/* Impact Stats */}
                    <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-10 relative overflow-hidden group">
                        <div className="absolute -right-12 -bottom-12 opacity-5 rotate-12 transition-transform duration-1000 group-hover:scale-150 text-slate-900">
                            <i className="fas fa-award text-[15rem]"></i>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">Social Impact</h2>
                        <div className="space-y-8">
                            {[
                                { label: 'Lives Affected', value: (stats?.livesSaved * 2.5).toFixed(0), icon: 'users', color: 'text-blue-500', bg: 'bg-blue-50' },
                                { label: 'Volume Saved', value: ((stats?.donations || 0) * 0.35).toFixed(1) + 'L', icon: 'tint', color: 'text-red-500', bg: 'bg-red-50' },
                                { label: 'Next Window', value: stats?.nextEligible, icon: 'calendar-check', color: 'text-green-500', bg: 'bg-green-50' }
                            ].map((impact, i) => (
                                <div key={i} className="flex items-center justify-between p-6 rounded-[2rem] bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-slate-100 group/item">
                                    <div className="flex items-center">
                                        <div className={`w-14 h-14 ${impact.bg} rounded-[1.5rem] flex items-center justify-center mr-6 shadow-sm group-hover/item:rotate-6 transition-transform`}>
                                            <i className={`fas fa-${impact.icon} ${impact.color} text-lg`}></i>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{impact.label}</p>
                                            <p className="text-[9px] font-bold text-slate-400 mt-1.5 uppercase tracking-tighter">Verified Contribution</p>
                                        </div>
                                    </div>
                                    <span className={`font-black ${impact.color} text-2xl tracking-tighter`}>{impact.value}</span>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowCertificate(true)}
                            className="w-full mt-10 border-2 border-dashed border-slate-200 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-red-600 hover:border-red-500 hover:bg-red-50 transition-all"
                        >
                            View Hero Certificate
                        </button>
                    </div>


                    {/* Community Rewards */}
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[2.5rem] shadow-2xl p-10 text-white relative overflow-hidden group border-4 border-slate-700/30">
                        <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                            <i className="fas fa-gift text-[12rem]"></i>
                        </div>
                        <div className="relative z-10">
                            <div className="bg-white/10 border border-white/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md">
                                <i className="fas fa-stars text-xl text-yellow-400"></i>
                            </div>
                            <h3 className="font-black text-4xl tracking-tight mb-4 leading-none">Refer & Earn</h3>
                            <p className="text-slate-300 font-medium text-sm leading-relaxed mb-10">Invite friends to LifeLink. Unlock health benefits and premium rewards for every referral.</p>
                            <button className="bg-white text-slate-900 px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-50 transition-all transform hover:-translate-y-1 active:translate-y-0 w-full group/btn">
                                Share Link <i className="fas fa-arrow-right ml-3 group-hover/btn:translate-x-1 transition-transform"></i>
                            </button>
                        </div>
                    </div>

                    {/* Recent News Card -> Live Feed */}
                    <div className="bg-white rounded-[3rem] p-10 text-slate-900 relative overflow-hidden border border-slate-100 shadow-xl group">
                        <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-red-600 mb-8 flex items-center">
                            <i className="fas fa-satellite-dish mr-4 animate-pulse"></i> Global Network Live
                        </h3>
                        <ActivityFeed limit={4} />
                    </div>
                </div>
            </div>

            {/* Hero Certificate Modal Overlay */}
            <AnimatePresence>
                {showCertificate && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-black/40"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-[3rem] p-12 relative overflow-hidden shadow-2xl"
                        >
                            <div className="absolute -right-20 -top-20 opacity-5 rotate-12 text-gray-900">
                                <i className="fas fa-certificate text-[20rem]"></i>
                            </div>
                            <button onClick={() => setShowCertificate(false)} className="absolute top-8 right-8 w-10 h-10 bg-gray-100 text-gray-400 rounded-full hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center">
                                <i className="fas fa-times"></i>
                            </button>

                            <div className="relative z-10 text-center">
                                <div className="mx-auto w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
                                    <i className="fas fa-award text-4xl text-red-500"></i>
                                </div>
                                <h4 className="text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase mb-4">Official LifeLink Citation</h4>
                                <h3 className="text-4xl font-black text-gray-900 mb-8 font-serif italic">Hero of the Bloodline</h3>
                                <p className="text-gray-500 mb-10 text-sm max-w-md mx-auto leading-relaxed border-y border-gray-100 py-6">
                                    This certifies that <strong className="text-gray-900 font-black">{user?.name}</strong> has demonstrated extraordinary commitment to humanity by saving {stats?.livesSaved} lives through selfless blood donation.
                                </p>
                                <div className="flex justify-between items-end px-10">
                                    <div className="text-left">
                                        <div className="w-32 h-1 bg-gray-200 mb-2"></div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Chief Medical Officer</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-xs shadow-lg transform -rotate-12 outline-dashed outline-red-200 outline-offset-4">
                                            SEAL
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="w-32 h-1 bg-gray-200 mb-2 ml-auto"></div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{new Date().getFullYear()} Validation</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <BloodRequestForm isOpen={showBloodRequestForm} onClose={() => setShowBloodRequestForm(false)} onSuccess={() => setSupplyRefreshKey(k => k + 1)} />

        </motion.div>
    );
};

export default DonorDashboard;
