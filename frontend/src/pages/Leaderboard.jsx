import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const Leaderboard = () => {
    const navigate = useNavigate();
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    const userString = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const user = userString ? JSON.parse(userString) : null;

    // --- LOGIC (UNTOUCHED) ---
    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get('https://society-activitytracker-production.up.railway.app/api/users/leaderboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLeaders(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching leaderboard", error);
                setLoading(false);
            }
        };

        if (user) {
            fetchLeaderboard();
        }
    }, [user, token]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/'); 
    };

    if (!user) return null;

    // --- ANIMATION CONFIG ---
    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const item = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }
    };

    return (
        <div className="flex h-screen bg-charcoal-900 text-gray-300 font-body overflow-hidden">
            
            {/* BACKGROUND GRID */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

            {/* SLIM TECH SIDEBAR */}
            <aside className="w-16 md:w-20 bg-charcoal-800 border-r border-white/5 flex flex-col items-center py-6 z-10 shadow-2xl">
                <div className="w-10 h-10 bg-charcoal-700 border border-white/10 rounded flex items-center justify-center text-accent font-bold mb-10 shadow-[0_0_10px_rgba(0,240,255,0.1)]">
                    S_
                </div>
                
                <nav className="flex flex-col gap-6 w-full items-center">
                    <div className="text-gray-500 hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/dashboard')} title="Dashboard">
                        <span className="text-xl">⊞</span>
                    </div>
                    <div className="text-accent cursor-pointer group relative" title="Analytics">
                        <span className="text-xl">▤</span>
                        <div className="absolute left-10 opacity-0 group-hover:opacity-100 bg-charcoal-700 text-xs font-mono px-2 py-1 rounded transition-opacity z-50">Rankings</div>
                    </div>
                    {user.role === 'ADMIN' && (
                        <div className="text-gray-500 hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/admin')} title="Admin Panel">
                            <span className="text-xl">⚙</span>
                        </div>
                    )}
                </nav>

                <div className="mt-auto text-gray-500 hover:text-red-400 cursor-pointer transition-colors" onClick={handleLogout} title="Terminate Session">
                    <span className="text-xl">✕</span>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto z-10">
                <div className="max-w-4xl mx-auto">
                    
                    {/* Header */}
                    <header className="mb-10 flex justify-between items-end border-b border-white/5 pb-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-heading font-semibold text-white tracking-tight">GLOBAL_RANKINGS</h1>
                            <p className="text-xs text-accent mt-2 font-mono tracking-widest uppercase">
                                Sorting by highest telemetry points
                            </p>
                        </div>
                        <div className="hidden md:flex items-center gap-3 bg-charcoal-800 px-4 py-2 border border-white/10 rounded-full">
                            <span className="text-xs font-mono text-gray-400">OPERATIVE: {user.name.toUpperCase()}</span>
                        </div>
                    </header>

                    {/* LEADERBOARD LIST */}
                    {loading ? (
                        <div className="flex flex-col gap-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-20 bg-charcoal-800/50 rounded-lg border border-white/5 animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-4">
                            {leaders.map((leader, index) => {
                                const isTopRank = index === 0;
                                const rankDisplay = (index + 1).toString().padStart(2, '0'); // Formats 1 to "01"
                                
                                return (
                                    <motion.div 
                                        variants={item} 
                                        key={leader._id} 
                                        className={`flex items-center justify-between p-5 rounded-lg border transition-all duration-300 group ${
                                            isTopRank 
                                                ? 'bg-accent/5 border-accent/50 shadow-[0_0_20px_rgba(0,240,255,0.1)] hover:border-accent hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]' 
                                                : 'bg-charcoal-800 border-white/5 hover:border-white/20'
                                        }`}
                                    >
                                        <div className="flex items-center gap-6">
                                            {/* Rank Number */}
                                            <div className={`font-mono text-3xl font-bold tracking-tighter ${isTopRank ? 'text-accent' : 'text-gray-600'}`}>
                                                {rankDisplay}
                                            </div>
                                            
                                            {/* Profile Info */}
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <div className={`font-heading font-semibold text-lg uppercase ${isTopRank ? 'text-white' : 'text-gray-300 group-hover:text-white transition-colors'}`}>
                                                        {leader.name}
                                                    </div>
                                                    {isTopRank && (
                                                        <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-sm font-mono uppercase tracking-widest border border-accent/30">
                                                            Elite
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs font-mono text-gray-500 mt-1 uppercase">
                                                    {leader.department} <span className="text-charcoal-600 mx-1">|</span> {leader.role}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Score Display */}
                                        <div className="flex items-baseline gap-1">
                                            <div className={`text-4xl font-mono font-bold tracking-tighter ${isTopRank ? 'text-white' : 'text-gray-200'}`}>
                                                {leader.activityScore}
                                            </div>
                                            <div className={`text-xs font-mono uppercase tracking-widest ${isTopRank ? 'text-accent' : 'text-gray-600'}`}>
                                                PTS
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Leaderboard;