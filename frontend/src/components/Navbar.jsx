import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar = ({ onNewRequest, onEmergency }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const isActive = (path) => {
        return location.pathname === path;
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="fixed top-6 left-0 right-0 z-[100] px-4 md:px-8 pointer-events-none">
            <div className="max-w-7xl mx-auto pointer-events-auto">
                <nav className="glass-nav rounded-[2.5rem] px-6 py-3 flex items-center justify-between transition-all duration-500">
                    {/* Brand */}
                    <Link to="/" className="flex items-center group">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:rotate-12 transition-transform duration-300">
                            <i className="fas fa-tint text-white"></i>
                        </div>
                        <span className="ml-3 text-xl font-bold text-slate-900 tracking-tighter">LifeLink</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center bg-slate-100/50 rounded-2xl p-1 mx-8 border border-white/40">
                        {[
                            { name: 'Dashboard', path: '/', icon: 'grid-alt' },
                            { name: 'Requests', path: '/requests', icon: 'list-ul' },
                            { name: 'Profile', path: '/profile', icon: 'user' }
                        ].map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-semibold uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-2 ${
                                    isActive(link.path)
                                        ? 'bg-white shadow-md text-red-600'
                                        : 'text-slate-500 hover:text-slate-900'
                                }`}
                            >
                                <i className={`fas fa-${link.icon}`}></i>
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <div className="hidden xl:flex flex-col text-right mr-2">
                            <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-widest leading-none">Status</span>
                            <div className="flex items-center mt-1 justify-end">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
                                <span className="text-[9px] font-semibold text-slate-900">Network Live</span>
                            </div>
                        </div>

                        {user.role === 'donor' ? (
                            <button
                                onClick={onEmergency}
                                className="emergency-pulse bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-semibold uppercase tracking-widest text-[9px] transition-all shadow-lg shadow-red-500/20"
                            >
                                <i className="fas fa-bell mr-2"></i> Emergency
                            </button>
                        ) : (
                            <button
                                onClick={onNewRequest}
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-semibold uppercase tracking-widest text-[9px] transition-all shadow-lg shadow-red-500/20"
                            >
                                <i className="fas fa-plus mr-2"></i> Request
                            </button>
                        )}

                        <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden sm:block"></div>

                        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/profile')}>
                            <div className="hidden sm:flex flex-col text-right">
                                <p className="text-[10px] font-semibold text-slate-900 leading-none">{user.name.split(' ')[0]}</p>
                                <p className="text-[8px] font-semibold text-slate-400 uppercase tracking-widest mt-1">Hero</p>
                            </div>
                            <div className="relative">
                                <img
                                    className="h-10 w-10 rounded-2xl border-2 border-white shadow-md group-hover:scale-105 transition-transform"
                                    src={`https://ui-avatars.com/api/?name=${user.name}&background=fecaca&color=b91c1c`}
                                    alt="User"
                                />
                                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>
                        </div>

                        <button 
                            onClick={handleLogout}
                            className="p-3 text-slate-400 hover:text-red-600 transition-colors"
                            title="Logout"
                        >
                            <i className="fas fa-power-off"></i>
                        </button>
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default Navbar;
