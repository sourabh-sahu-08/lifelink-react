import React from 'react';
import { Link, useLocation } from 'react-router-dom';


const Navbar = ({ userType, setUserType, onNewRequest, onEmergency }) => {
    const location = useLocation();


    const isActive = (path) => {
        return location.pathname === path ? 'text-red-600 font-semibold' : 'text-gray-500 hover:text-gray-900';
    };

    return (
        <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50 transition-colors">
            {/* Top Bar */}
            <div className="border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
                    <div className="flex items-center">
                        <i className="fas fa-tint text-red-600 text-xl mr-2"></i>
                        <span className="text-lg font-bold text-gray-900">LifeLink</span>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setUserType('donor')}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${userType === 'donor'
                                ? 'bg-red-600 text-white shadow-md transform scale-105'
                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            <i className="fas fa-user mr-2"></i> Donor
                        </button>
                        <button
                            onClick={() => setUserType('hospital')}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${userType === 'hospital'
                                ? 'bg-blue-600 text-white shadow-md transform scale-105'
                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            <i className="fas fa-hospital mr-2"></i> Hospital
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="hidden md:flex md:space-x-8">
                            <Link to="/" className={`${isActive('/')} text-sm font-bold uppercase tracking-widest transition-colors`}>Dashboard</Link>
                            <Link to="/requests" className={`${isActive('/requests')} text-sm font-bold uppercase tracking-widest transition-colors`}>Requests</Link>
                            <Link to="/profile" className={`${isActive('/profile')} text-sm font-bold uppercase tracking-widest transition-colors`}>Profile</Link>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center space-x-6 mr-8 border-x border-gray-100 px-8">
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Global Network</span>
                            <div className="flex items-center mt-1">
                                <span className="h-2 w-2 rounded-full bg-green-500 mr-2 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></span>
                                <span className="text-[10px] font-black text-gray-900 tracking-tight">System Online</span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Live Heroes</span>
                            <span className="text-[10px] font-black text-blue-600 mt-1 uppercase tracking-tighter">1,402 Active</span>
                        </div>
                    </div>

                    <div className="flex items-center">


                        {userType === 'donor' ? (
                            <button
                                onClick={onEmergency}
                                className="mr-3 emergency-pulse bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all transform hover:scale-105 shadow-lg shadow-red-200"
                            >
                                <i className="fas fa-bell mr-2"></i> Signal Emergency
                            </button>
                        ) : (
                            <button
                                onClick={onNewRequest}
                                className="mr-3 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all transform hover:scale-105 shadow-lg shadow-red-200"
                            >
                                <i className="fas fa-plus-circle mr-2"></i> Create Request
                            </button>
                        )}

                        <Link to="/profile" className="relative group">
                            <img
                                className="h-10 w-10 rounded-2xl border-2 border-white shadow-md transition-transform group-hover:scale-110"
                                src={userType === 'donor' ? "https://ui-avatars.com/api/?name=Pratishtha&background=ef4444&color=fff" : "https://ui-avatars.com/api/?name=St+Marys&background=2563eb&color=fff"}
                                alt="User"
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
