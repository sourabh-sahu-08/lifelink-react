import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import Skeleton from '../components/Skeleton';
import { useToast } from '../context/ToastContext';
import ActivityFeed from '../components/ActivityFeed';

const DonorDashboard = () => {
    const { triggerResponse } = useOutletContext();
    const { addToast } = useToast();
    const [stats, setStats] = useState({
        donations: 0,
        livesSaved: 0,
        avgResponse: 0,
        responseRate: "0%",
        cityRank: "--",
        nextEligible: "Checking..."
    });
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({ name: "Pratishtha D.", bloodType: "O-" });
    const [showQuiz, setShowQuiz] = useState(false);
    const [quizIndex, setQuizIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [quizResult, setQuizResult] = useState(null);

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
                const [statsRes, requestsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/stats'),
                    axios.get('http://localhost:5000/api/requests')
                ]);
                setStats(statsRes.data.donorStats);
                setRequests(requestsRes.data);
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
            <div className="modern-card mb-8 bg-white overflow-hidden shadow-2xl rounded-[2rem] border border-gray-100 relative group transition-all duration-500">
                <div className="h-56 bg-gradient-to-br from-red-600 via-red-500 to-red-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    {/* Abstract background elements */}
                    <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
                    <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700"></div>

                    <div className="absolute top-8 right-8 bg-white/20 backdrop-blur-md p-3 rounded-2xl cursor-pointer hover:bg-white/30 transition-all">
                        <i className="fas fa-share-alt text-white"></i>
                    </div>
                </div>

                <div className="px-10 pb-10 relative">
                    <div className="absolute -top-24 left-10">
                        <div className="relative">
                            <div className="h-44 w-44 rounded-[2.5rem] border-[10px] border-white shadow-2xl overflow-hidden bg-white">
                                <img
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    src="https://ui-avatars.com/api/?name=Pratishtha+Deshpande&background=random&size=512"
                                    alt="Donor"
                                />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-green-500 w-10 h-10 rounded-2xl border-4 border-white flex items-center justify-center shadow-lg">
                                <i className="fas fa-check text-white text-xs"></i>
                            </div>
                        </div>
                    </div>

                    <div className="pt-24 flex flex-col md:flex-row justify-between items-start gap-8">
                        <div>
                            <div className="flex items-center space-x-4">
                                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Pratishtha Deshpande</h1>
                                <span className="blood-type-badge type-b text-xl px-4 py-1.5 h-auto rounded-xl shadow-lg shadow-red-100">B+</span>
                            </div>
                            <div className="flex items-center mt-3 space-x-4">
                                <div className="flex items-center bg-yellow-400/10 px-3 py-1.5 rounded-xl border border-yellow-200">
                                    <div className="flex text-yellow-500 text-xs">
                                        {[1, 2, 3, 4].map(i => <i key={i} className="fas fa-star mr-0.5"></i>)}
                                        <i className="fas fa-star-half-alt"></i>
                                    </div>
                                    <span className="ml-2 text-xs font-black text-yellow-700">4.7 TOP DONOR</span>
                                </div>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center">
                                    <i className="fas fa-map-marker-alt mr-2 text-red-500"></i>
                                    Delhi, India • Member since 2023
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-6">
                            {achievements.map(achieve => (
                                <div key={achieve.id} className={`px-4 py-2 rounded-2xl flex items-center space-x-2 border transition-all ${achieve.condition ? `${achieve.bg} border-${achieve.color.split('-')[1]}-100` : 'bg-gray-50 border-gray-100 grayscale opacity-40'}`}>
                                    <i className={`fas fa-${achieve.icon} ${achieve.condition ? achieve.color : 'text-gray-400'} text-xs`}></i>
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${achieve.condition ? 'text-gray-800' : 'text-gray-400'}`}>{achieve.title}</span>
                                </div>
                            ))}
                        </div>

                        <div className="bg-slate-50 p-6 rounded-3xl border border-gray-100 text-center min-w-[160px] shadow-inner group-hover:bg-white transition-colors duration-500 mt-6 lg:mt-0 lg:absolute lg:top-0 lg:right-0">
                            <div className="text-4xl font-black gradient-text tracking-tighter">{stats?.cityRank}</div>
                            <div className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black mt-2">City Rank</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                        {[
                            { label: 'Donations', value: stats?.donations, icon: 'tint', color: 'text-red-600', bg: 'bg-red-50' },
                            { label: 'Lives Saved', value: stats?.livesSaved, icon: 'heart', color: 'text-pink-600', bg: 'bg-pink-50' },
                            { label: 'Avg Speed', value: `${stats?.avgResponse}m`, icon: 'bolt', color: 'text-yellow-600', bg: 'bg-yellow-50' },
                            { label: 'Success', value: stats?.responseRate, icon: 'crown', color: 'text-purple-600', bg: 'bg-purple-50' },
                        ].map((stat, i) => (
                            <div key={i} className={`p-6 ${stat.bg} rounded-3xl border border-transparent hover:border-white hover:shadow-xl transition-all duration-300 group/stat`}>
                                <div className={`w-10 h-10 ${stat.bg.replace('50', '100')} rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover/stat:rotate-12`}>
                                    <i className={`fas fa-${stat.icon} ${stat.color}`}></i>
                                </div>
                                <div className="text-3xl font-black text-gray-900 group-hover/stat:scale-105 transition-transform origin-left">{stat.value}</div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Eligibility Checker */}
                    <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden group">
                        <div className="px-10 py-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center group-hover:bg-white transition-colors">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Eligibility Checker</h2>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Status: {quizResult ? quizResult.toUpperCase() : 'PENDING'}</p>
                            </div>
                            <div className={`p-4 rounded-2xl ${quizResult === 'eligible' ? 'bg-green-100 text-green-600' : quizResult === 'ineligible' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                <i className={`fas fa-${quizResult === 'eligible' ? 'check-circle' : quizResult === 'ineligible' ? 'times-circle' : 'stethoscope'} text-xl`}></i>
                            </div>
                        </div>
                        <div className="p-10">
                            {quizResult ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-6">
                                    <h3 className="text-3xl font-black text-gray-900 mb-4">
                                        {quizResult === 'eligible' ? 'You are ready to save lives!' : 'Wait for a better time'}
                                    </h3>
                                    <p className="text-gray-500 font-medium mb-10 max-w-md mx-auto leading-relaxed">
                                        {quizResult === 'eligible' ?
                                            'Your health assessment is clear. We will alert you the moment a critical need arises for B+ in Delhi.' :
                                            'Based on your responses, we recommend waiting a few more weeks before your next donation. Your safety is our priority.'
                                        }
                                    </p>
                                    <button
                                        onClick={() => { setQuizResult(null); setShowQuiz(true); setQuizIndex(0); setUserAnswers({}); }}
                                        className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl shadow-gray-200"
                                    >
                                        Re-take Assessment
                                    </button>
                                </motion.div>
                            ) : showQuiz ? (
                                <div className="slide-in">
                                    <div className="mb-8">
                                        <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                                            <span>Assessment Progress</span>
                                            <span>{Math.round(((quizIndex + 1) / eligibilityQuestions.length) * 100)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${((quizIndex + 1) / eligibilityQuestions.length) * 100}%` }}
                                                className="bg-red-600 h-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                                            ></motion.div>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-4">{eligibilityQuestions[quizIndex].question}</h3>
                                    <p className="text-sm text-gray-500 font-medium mb-8 border-l-4 border-red-500 pl-4">{eligibilityQuestions[quizIndex].description}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                                        {eligibilityQuestions[quizIndex].options.map((opt, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleQuizOption(eligibilityQuestions[quizIndex].id, opt.value)}
                                                className={`p-6 rounded-3xl border-2 transition-all flex items-center justify-between group ${userAnswers[eligibilityQuestions[quizIndex].id] === opt.value ? 'border-red-600 bg-red-50 shadow-xl shadow-red-100' : 'border-gray-50 bg-gray-50 hover:border-gray-100 hover:bg-white'}`}
                                            >
                                                <span className={`font-black text-sm uppercase tracking-widest ${userAnswers[eligibilityQuestions[quizIndex].id] === opt.value ? 'text-red-600' : 'text-gray-500'}`}>{opt.text}</span>
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${userAnswers[eligibilityQuestions[quizIndex].id] === opt.value ? 'bg-red-600 border-red-600 text-white' : 'border-gray-300'}`}>
                                                    {userAnswers[eligibilityQuestions[quizIndex].id] === opt.value && <i className="fas fa-check text-[10px]"></i>}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            onClick={nextQuestion}
                                            disabled={!userAnswers[eligibilityQuestions[quizIndex].id]}
                                            className="bg-red-600 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs disabled:opacity-30 hover:bg-red-700 transition-all shadow-xl shadow-red-200"
                                        >
                                            {quizIndex === eligibilityQuestions.length - 1 ? 'Finish Assessment' : 'Next Question'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div className="flex items-center space-x-6">
                                        <div className="bg-red-50 p-6 rounded-[2rem] shadow-inner">
                                            <i className="fas fa-notes-medical text-red-500 text-3xl"></i>
                                        </div>
                                        <div>
                                            <p className="text-xl font-black text-gray-900 leading-tight">Health Assessment Required</p>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2">Required every 56 days for active status</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowQuiz(true)}
                                        className="bg-red-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-all shadow-xl shadow-red-200 w-full md:w-auto"
                                    >
                                        Start Check Up
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Active Requests */}
                    <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
                        <div className="px-10 py-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Active Critical Alerts</h2>
                            <span className="bg-red-100 text-red-600 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Live</span>
                        </div>
                        <div className="p-10 space-y-6">
                            {Array.isArray(requests) && requests.map((request) => (
                                <motion.div
                                    key={request.id}
                                    whileHover={{ x: 10 }}
                                    className={`p-8 border-2 rounded-[2rem] relative overflow-hidden transition-all duration-300 ${request.urgency === 'Critical' ? 'bg-red-50/30 border-red-100 group' : 'border-gray-50 hover:border-blue-100 hover:bg-blue-50/10'}`}
                                >
                                    {request.urgency === 'Critical' && <div className="absolute top-0 right-0 p-3 bg-red-600 text-white text-[10px] font-black rounded-bl-2xl uppercase tracking-[0.2em]">Priority</div>}
                                    <div className="flex flex-col xl:flex-row justify-between items-center gap-8">
                                        <div className="flex items-center w-full">
                                            <div className={`blood-type-badge ${request.bloodType.includes('O') ? 'type-o' : request.bloodType.includes('A') ? 'type-a' : 'type-b'} h-20 w-20 text-xl font-black shadow-2xl flex-shrink-0`}>{request.bloodType}</div>
                                            <div className="ml-8 flex-1">
                                                <div className="flex items-center">
                                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">{request.hospital}</h3>
                                                    <span className="ml-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">{request.distance} away</span>
                                                </div>
                                                <p className="text-gray-500 font-bold text-sm mt-2">{request.reason}</p>
                                                <div className="flex items-center mt-4 space-x-6">
                                                    <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-red-600">
                                                        <i className="fas fa-tint mr-2"></i> {request.units} Units required
                                                    </div>
                                                    <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-blue-500">
                                                        <i className="fas fa-clock mr-2"></i> {request.time}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => triggerResponse(request)}
                                            className={`w-full xl:w-auto px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl transition-all transform active:scale-95 ${request.urgency === 'Critical' ? 'bg-red-600 text-white hover:bg-black hover:shadow-red-200' : 'bg-blue-600 text-white hover:bg-black'}`}
                                        >
                                            Respond
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Impact Stats */}
                    <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-10 relative overflow-hidden group">
                        <div className="absolute -right-10 -bottom-10 opacity-5 rotate-12 transition-transform duration-700 group-hover:scale-150 text-gray-400">
                            <i className="fas fa-award text-[12rem]"></i>
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Your Global Impact</h2>
                        <div className="space-y-6">
                            {[
                                { label: 'Lives Affected', value: (stats?.livesSaved * 2.5).toFixed(0), icon: 'users', color: 'text-blue-500', bg: 'bg-blue-50' },
                                { label: 'Units Contributed', value: stats?.donations * 0.35 + 'L', icon: 'tint', color: 'text-red-500', bg: 'bg-red-50' },
                                { label: 'Next Eligible', value: stats?.nextEligible, icon: 'calendar-check', color: 'text-green-500', bg: 'bg-green-50' }
                            ].map((impact, i) => (
                                <div key={i} className="flex items-center justify-between p-5 rounded-[2rem] bg-gray-50/50 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100">
                                    <div className="flex items-center">
                                        <div className={`w-12 h-12 ${impact.bg} rounded-[1.2rem] flex items-center justify-center mr-5 shadow-sm`}>
                                            <i className={`fas fa-${impact.icon} ${impact.color}`}></i>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-gray-900 uppercase tracking-tight">{impact.label}</p>
                                            <p className="text-[10px] font-bold text-gray-400 mt-0.5">Verified contribution</p>
                                        </div>
                                    </div>
                                    <span className={`font-black ${impact.color} text-xl tracking-tight`}>{impact.value}</span>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowCertificate(true)}
                            className="w-full mt-8 border-2 border-dashed border-gray-200 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-600 hover:border-red-500 transition-all"
                        >
                            View Hero Certificate
                        </button>
                    </div>

                    {/* Community Leaderboard */}
                    <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-10 relative overflow-hidden group">
                        <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tight flex items-center">
                            <i className="fas fa-trophy text-yellow-500 mr-4"></i>
                            Community Rank
                        </h2>
                        <div className="space-y-4">
                            {[
                                { name: "Rohit Kumar", rank: 1, points: "2,450", avatar: "RK" },
                                { name: "Pratishtha D.", rank: 2, points: "2,100", avatar: "PD" },
                                { name: "Amit Patel", rank: 3, points: "1,850", avatar: "AP" }
                            ].map((user, i) => (
                                <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border ${user.name.includes('Pratishtha') ? 'bg-blue-50 border-blue-100 shadow-sm' : 'border-gray-50'}`}>
                                    <div className="flex items-center">
                                        <span className={`w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center mr-4 ${user.rank === 1 ? 'bg-yellow-100 text-yellow-700' : user.rank === 2 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                                            #{user.rank}
                                        </span>
                                        <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center font-black text-xs mr-3">{user.avatar}</div>
                                        <span className="font-black text-sm text-gray-800">{user.name}</span>
                                    </div>
                                    <span className="font-black text-xs text-gray-400">{user.points} pts</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Community Rewards */}
                    <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-800 rounded-[2rem] shadow-2xl p-10 text-white relative overflow-hidden group border-4 border-indigo-400/20">
                        <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                            <i className="fas fa-gift text-[10rem]"></i>
                        </div>
                        <div className="relative z-10">
                            <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                                <i className="fas fa-stars text-xl"></i>
                            </div>
                            <h3 className="font-black text-3xl tracking-tight mb-4">Refer & Earn</h3>
                            <p className="text-indigo-100 font-medium text-sm leading-relaxed mb-8">Invite your friends to join LifeLink. Earn exclusive health insurance benefits and local rewards for every successful donation.</p>
                            <button className="bg-white text-indigo-700 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-50 transition-all transform hover:-translate-y-1 active:translate-y-0 w-full group/btn">
                                Share Link <i className="fas fa-arrow-right ml-2 group-hover/btn:translate-x-1 transition-transform"></i>
                            </button>
                        </div>
                    </div>

                    {/* Recent News Card -> Live Feed */}
                    <div className="bg-white rounded-[2.5rem] p-10 text-gray-900 relative overflow-hidden border border-gray-100 shadow-xl">
                        <h3 className="font-black text-xs uppercase tracking-[0.3em] text-red-600 mb-6 flex items-center">
                            <i className="fas fa-satellite-dish mr-3 animate-pulse"></i> Global Network Live
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
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowCertificate(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 50 }}
                            className="max-w-xl w-full bg-white rounded-[3rem] p-12 relative shadow-2xl overflow-hidden border-8 border-double border-red-100"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="absolute top-0 right-0 p-8">
                                <button onClick={() => setShowCertificate(false)} className="text-gray-300 hover:text-red-600 transition-colors">
                                    <i className="fas fa-times text-2xl"></i>
                                </button>
                            </div>

                            <div className="text-center relative z-10">
                                <div className="mb-8 flex justify-center">
                                    <div className="w-24 h-24 bg-red-600 rounded-3xl flex items-center justify-center shadow-2xl rotate-12">
                                        <i className="fas fa-certificate text-4xl text-white"></i>
                                    </div>
                                </div>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-red-600 mb-6">Official Recognition</h2>
                                <h1 className="text-3xl font-black text-gray-900 tracking-tighter mb-4 capitalize">
                                    Certificate of Heroism
                                </h1>
                                <p className="text-gray-400 font-medium leading-relaxed italic mb-8">
                                    This certificate is awarded to <span className="text-gray-900 font-black not-italic">{user.name}</span> for their selfless contribution to saving lives through blood donation.
                                </p>

                                <div className="bg-slate-50 p-8 rounded-[2rem] border border-gray-100 grid grid-cols-3 gap-6 mb-8">
                                    <div>
                                        <p className="text-[8px] font-black text-gray-400 uppercase mb-2">Donations</p>
                                        <p className="text-xl font-black text-gray-900">{stats?.donations}</p>
                                    </div>
                                    <div className="border-x border-gray-200 px-4">
                                        <p className="text-[8px] font-black text-gray-400 uppercase mb-2">Lives Won</p>
                                        <p className="text-xl font-black text-red-600">{(stats?.livesSaved * 2.5).toFixed(0)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-gray-400 uppercase mb-2">Impact</p>
                                        <p className="text-xl font-black text-gray-900">Elite</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center space-x-12 mt-12 opacity-50 grayscale">
                                    <div className="text-center">
                                        <div className="w-16 h-[1px] bg-gray-400 mx-auto mb-2"></div>
                                        <p className="text-[8px] font-black uppercase tracking-widest">Medical Officer</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-16 h-[1px] bg-gray-400 mx-auto mb-2"></div>
                                        <p className="text-[8px] font-black uppercase tracking-widest">LifeLink Global</p>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-red-600 opacity-[0.03] rounded-full blur-3xl"></div>
                            <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-600 opacity-[0.03] rounded-full blur-3xl"></div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default DonorDashboard;
