import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const navigate = useNavigate();
    
    const userString = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const user = userString ? JSON.parse(userString) : null;

    const [checkInCode, setCheckInCode] = useState('');
    const [message, setMessage] = useState('');
    const [currentScore, setCurrentScore] = useState(user ? user.activityScore : 0);
    const [timeline, setTimeline] = useState([]);

    // Fetch the activity timeline when the dashboard loads
    useEffect(() => {
        const fetchTimeline = async () => {
            if (user) {
                try {
                    const res = await axios.get('https://society-activitytracker-production.up.railway.app/api/users/me/timeline', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setTimeline(res.data);
                } catch (error) {
                    console.error('Failed to fetch timeline', error);
                }
            }
        };
        fetchTimeline();
    }, [user, token]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/'); 
    };

    const handleCheckIn = async (e) => {
        e.preventDefault();
        setMessage('Processing telemetry...');

        try {
            const response = await axios.post(
                'https://society-activitytracker-production.up.railway.app/api/attendance/check-in',
                { checkInCode },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const pointsEarned = response.data.eventDetails.pointsEarned;
            const newScore = currentScore + pointsEarned;
            
            setCurrentScore(newScore);
            const updatedUser = { ...user, activityScore: newScore };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setMessage(`Check-in successful. (+${pointsEarned} PTS)`);
            setCheckInCode('');
            
            // Instantly refresh the timeline to show the new event
            try {
                const res = await axios.get('https://society-activitytracker-production.up.railway.app/api/users/me/timeline', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTimeline(res.data);
            } catch (err) {
                console.error('Timeline refresh failed', err);
            }
            
        } catch (error) {
            setMessage(error.response?.data?.message || 'Check-in failed. Code invalid.');
        }
    };

    // --- ANIMATION CONFIG ---
    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
    };

    if (!user) {
        return (
            <div className="flex h-screen justify-center items-center bg-charcoal-900 font-body text-gray-300">
                <div className="text-center bg-charcoal-800 p-10 border border-red-500/20 rounded-lg shadow-[0_0_20px_rgba(255,0,0,0.05)]">
                    <h2 className="text-2xl font-heading text-white tracking-widest uppercase mb-4">Session_Terminated</h2>
                    <p className="text-xs font-mono text-gray-500 mb-8">Access token missing or expired.</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="bg-charcoal-700 hover:bg-white hover:text-charcoal-900 text-white font-mono border border-white/20 rounded p-3 text-sm tracking-widest uppercase transition-all duration-300"
                    >
                        Return to Login
                    </button>
                </div>
            </div>
        );
    }

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
                    <div className="text-accent cursor-pointer group relative" title="Dashboard">
                        <span className="text-xl">⊞</span>
                        <div className="absolute left-10 opacity-0 group-hover:opacity-100 bg-charcoal-700 text-xs font-mono px-2 py-1 rounded transition-opacity">Core</div>
                    </div>
                    <div className="text-gray-500 hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/leaderboard')} title="Analytics">
                        <span className="text-xl">▤</span>
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

            {/* MAIN DASHBOARD AREA */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto z-10">
                <motion.div variants={container} initial="hidden" animate="show" className="max-w-5xl mx-auto">
                    
                    {/* Header */}
                    <header className="mb-10 flex justify-between items-end border-b border-white/5 pb-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-heading font-semibold text-white tracking-tight">SYSTEM_DASHBOARD</h1>
                            <p className="text-xs text-accent mt-2 font-mono tracking-widest uppercase">
                                Welcome, Operative {user.name}
                            </p>
                        </div>
                        <div className="hidden md:flex items-center gap-3 bg-charcoal-800 px-4 py-2 border border-white/10 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(0,240,255,0.8)] animate-pulse"></div>
                            <span className="text-xs font-mono text-gray-400">NETWORK: SECURE</span>
                        </div>
                    </header>

                    {/* BENTO GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-min">
                        
                        {/* 1. Score Card (Dominant) */}
                        <motion.div variants={item} className="col-span-1 md:col-span-2 bg-charcoal-800 border border-white/10 rounded-lg p-6 relative overflow-hidden group hover:border-accent/30 transition-colors">
                            <h3 className="text-xs uppercase tracking-widest text-gray-500 font-mono mb-4">Total Activity Index</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-6xl md:text-7xl font-mono text-white tracking-tighter">{currentScore}</span>
                                <span className="text-sm text-accent font-mono">PTS</span>
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/10 blur-3xl rounded-full"></div>
                        </motion.div>

                        {/* 2. Identity Profile */}
                        <motion.div variants={item} className="col-span-1 md:col-span-2 bg-charcoal-800 border border-white/10 rounded-lg p-6 flex flex-col justify-between">
                            <h3 className="text-xs uppercase tracking-widest text-gray-500 font-mono mb-4">Identity Matrix</h3>
                            <div className="space-y-4 text-sm font-mono text-gray-400">
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span>Clearance Level</span>
                                    <span className="text-white">{user.role}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span>Sector</span>
                                    <span className="text-white">{user.department}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Status</span>
                                    <span className="text-accent flex items-center gap-2">
                                        <span className="inline-block w-1.5 h-1.5 bg-accent rounded-full"></span> ACTIVE
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* 3. Event Check-in */}
                        <motion.div variants={item} className="col-span-1 md:col-span-4 bg-charcoal-800 border border-white/10 rounded-lg p-6 group hover:border-accent/30 transition-colors">
                            <h3 className="text-xs uppercase tracking-widest text-gray-500 font-mono mb-2">Initialize Check-In</h3>
                            <p className="text-sm text-gray-400 mb-5">Input authorized event code to sync telemetry.</p>
                            
                            <form onSubmit={handleCheckIn} className="flex flex-col md:flex-row gap-4 max-w-2xl">
                                <input 
                                    type="text" 
                                    className="flex-1 bg-charcoal-900 border border-white/10 focus:border-accent text-white font-mono rounded p-3 text-sm outline-none transition-all focus:shadow-[0_0_10px_rgba(0,240,255,0.1)] uppercase"
                                    placeholder="e.g., SECTOR_ALPHA_9" 
                                    value={checkInCode}
                                    onChange={(e) => setCheckInCode(e.target.value)}
                                    required
                                />
                                <button type="submit" className="bg-charcoal-700 hover:bg-accent hover:text-charcoal-900 text-accent font-mono border border-accent rounded px-8 py-3 text-sm tracking-widest uppercase transition-all duration-300">
                                    Execute
                                </button>
                            </form>

                            {message && (
                                <p className={`mt-4 text-xs font-mono ${message.includes('successful') ? 'text-accent' : 'text-red-400'}`}>
                                    &gt; {message}
                                </p>
                            )}
                        </motion.div>

                        {/* 4. Activity Timeline */}
                        <motion.div variants={item} className="col-span-1 md:col-span-4 bg-charcoal-800 border border-white/10 rounded-lg p-6">
                            <h3 className="text-xs uppercase tracking-widest text-gray-500 font-mono mb-6">System Logs [Timeline]</h3>
                            
                            {timeline.length === 0 ? (
                                <div className="border border-dashed border-white/10 p-10 text-center rounded flex flex-col items-center justify-center">
                                    <span className="text-gray-600 text-2xl mb-2">▨</span>
                                    <p className="text-gray-500 font-mono text-xs tracking-widest uppercase">No Data Logs Found</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {timeline.map((item, index) => (
                                        <motion.div 
                                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
                                            key={item.id || index} 
                                            className="flex justify-between items-center p-4 bg-charcoal-900 border-l-2 border-accent/40 hover:border-accent rounded group transition-all duration-300"
                                        >
                                            <div>
                                                <div className="font-heading font-semibold text-gray-200 text-sm group-hover:text-white transition-colors">
                                                    {item.title}
                                                </div>
                                                <div className="text-xs font-mono text-gray-500 mt-1 uppercase">
                                                    {item.type} <span className="text-charcoal-600 mx-2">|</span> {new Date(item.date).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="text-accent font-mono font-bold tracking-tight">
                                                +{item.points}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Dashboard;