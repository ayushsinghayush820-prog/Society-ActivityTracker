import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const AdminPanel = () => {
    const navigate = useNavigate();
    
    const userString = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const user = userString ? JSON.parse(userString) : null;

    // --- STATES (UNTOUCHED) ---
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [eventType, setEventType] = useState('Workshop');
    const [checkInCode, setCheckInCode] = useState('');
    const [eventPoints, setEventPoints] = useState(10);
    const [eventMessage, setEventMessage] = useState('');

    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState('');
    const [contribTitle, setContribTitle] = useState('');
    const [contribCategory, setContribCategory] = useState('Technical');
    const [contribPoints, setContribPoints] = useState(5);
    const [contribMessage, setContribMessage] = useState('');

    const [stats, setStats] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/'); 
    };

    // --- LOGIC (UNTOUCHED) ---
    useEffect(() => {
        const fetchAdminData = async () => {
            if (user && user.role === 'ADMIN') {
                try {
                    const memRes = await axios.get('https://society-activitytracker-production.up.railway.app/api/users/admin/members', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setMembers(memRes.data);
                    if(memRes.data.length > 0) setSelectedMember(memRes.data[0]._id);

                    const statsRes = await axios.get('https://society-activitytracker-production.up.railway.app/api/users/admin/stats', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setStats(statsRes.data);
                } catch (error) {
                    console.error("Error fetching admin data", error);
                }
            }
        };
        fetchAdminData();
    }, [user, token]);

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        setEventMessage('Deploying event parameters...');
        try {
            const response = await axios.post(
                'https://society-activitytracker-production.up.railway.app/api/events',
                { title, date, startTime, eventType, checkInCode, points: eventPoints },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEventMessage(`Success! Event "${response.data.title}" deployed.`);
            setTitle(''); setDate(''); setStartTime(''); setCheckInCode(''); setEventPoints(10);
        } catch (error) {
            setEventMessage(error.response?.data?.message || 'Failed to deploy event.');
        }
    };

    const handleLogContribution = async (e) => {
        e.preventDefault();
        setContribMessage('Transmitting contribution data...');
        try {
            await axios.post(
                'https://society-activitytracker-production.up.railway.app/api/contributions',
                { memberId: selectedMember, title: contribTitle, category: contribCategory, points: contribPoints },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setContribMessage('Success! Points awarded to member.');
            setContribTitle(''); setContribPoints(5);
            
            const statsRes = await axios.get('https://society-activitytracker-production.up.railway.app/api/users/admin/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(statsRes.data);
            
        } catch (error) {
            setContribMessage(error.response?.data?.message || 'Failed to log contribution.');
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

    // Access Denied Screen (Redesigned)
    if (!user || user.role !== 'ADMIN') {
        return (
            <div className="flex h-screen justify-center items-center bg-charcoal-900 font-body text-gray-300">
                <div className="text-center bg-charcoal-800 p-10 border border-red-500/20 rounded-lg shadow-[0_0_20px_rgba(255,0,0,0.05)]">
                    <h2 className="text-2xl font-heading text-red-500 tracking-widest uppercase mb-4">UNAUTHORIZED_ACCESS</h2>
                    <p className="text-xs font-mono text-gray-500 mb-8">Root privileges required for this sector.</p>
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="bg-charcoal-700 hover:bg-white hover:text-charcoal-900 text-white font-mono border border-white/20 rounded p-3 text-sm tracking-widest uppercase transition-all duration-300"
                    >
                        Return to Dashboard
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
                    <div className="text-gray-500 hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/dashboard')} title="Dashboard">
                        <span className="text-xl">⊞</span>
                    </div>
                    <div className="text-gray-500 hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/leaderboard')} title="Analytics">
                        <span className="text-xl">▤</span>
                    </div>
                    <div className="text-accent cursor-pointer group relative" title="Admin Panel">
                        <span className="text-xl">⚙</span>
                        <div className="absolute left-10 opacity-0 group-hover:opacity-100 bg-charcoal-700 text-xs font-mono px-2 py-1 rounded transition-opacity">Root</div>
                    </div>
                </nav>

                <div className="mt-auto text-gray-500 hover:text-red-400 cursor-pointer transition-colors" onClick={handleLogout} title="Terminate Session">
                    <span className="text-xl">✕</span>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto z-10">
                <motion.div variants={container} initial="hidden" animate="show" className="max-w-6xl mx-auto">
                    
                    {/* Header */}
                    <header className="mb-10 flex justify-between items-end border-b border-white/5 pb-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-heading font-semibold text-white tracking-tight">ADMIN_COMMAND_CENTER</h1>
                            <p className="text-xs text-accent mt-2 font-mono tracking-widest uppercase">
                                Identity: {user.name} // Status: Root Privileges
                            </p>
                        </div>
                        <div className="hidden md:flex items-center gap-3 bg-charcoal-800 px-4 py-2 border border-accent/30 rounded-full shadow-[0_0_10px_rgba(0,240,255,0.1)]">
                            <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                            <span className="text-xs font-mono text-accent">ROOT_ACTIVE</span>
                        </div>
                    </header>

                    {/* TOP ROW: STATS (New Color System) */}
                    {stats && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <motion.div variants={item} className="bg-charcoal-800 border border-white/10 p-6 rounded-lg text-center flex flex-col justify-center relative overflow-hidden group hover:border-white/20 transition-all">
                                <span className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Total Operatives</span>
                                <span className="text-4xl font-mono text-white">{stats.total}</span>
                            </motion.div>
                            
                            <motion.div variants={item} className="bg-charcoal-800 border border-accent/20 p-6 rounded-lg text-center flex flex-col justify-center relative overflow-hidden group hover:border-accent/50 transition-all shadow-[inset_0_0_20px_rgba(0,240,255,0.02)]">
                                <span className="text-xs font-mono text-accent uppercase tracking-widest mb-2">Active</span>
                                <span className="text-4xl font-mono text-white">{stats.active}</span>
                            </motion.div>
                            
                            <motion.div variants={item} className="bg-charcoal-800 border border-white/5 p-6 rounded-lg text-center flex flex-col justify-center relative overflow-hidden">
                                <span className="text-xs font-mono text-status-low uppercase tracking-widest mb-2">Low Activity</span>
                                <span className="text-4xl font-mono text-status-low">{stats.lowActivity}</span>
                            </motion.div>
                            
                            <motion.div variants={item} className="bg-charcoal-900 border border-charcoal-700 p-6 rounded-lg text-center flex flex-col justify-center relative overflow-hidden">
                                <span className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-2">Inactive</span>
                                <span className="text-4xl font-mono text-gray-600">{stats.inactive}</span>
                            </motion.div>
                        </div>
                    )}

                    {/* MIDDLE ROW: FORMS */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        
                        {/* Event Deployment Form */}
                        <motion.div variants={item} className="bg-charcoal-800 border border-white/10 rounded-lg p-6 group hover:border-white/20 transition-all">
                            <h3 className="text-xs uppercase tracking-widest text-gray-500 font-mono mb-2">Deploy New Event</h3>
                            <p className="text-xs text-gray-500 mb-6 font-mono">Generate a sync code for society members.</p>
                            
                            <form onSubmit={handleCreateEvent} className="flex flex-col gap-4">
                                <div>
                                    <label className="text-xs font-mono text-gray-400 mb-2 block uppercase tracking-wider">Event Designation</label>
                                    <input type="text" className="w-full bg-charcoal-900 border border-white/10 focus:border-accent text-white font-mono rounded p-3 text-sm outline-none transition-all" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-xs font-mono text-gray-400 mb-2 block uppercase tracking-wider">Date</label><input type="date" className="w-full bg-charcoal-900 border border-white/10 focus:border-accent text-gray-300 font-mono rounded p-3 text-sm outline-none transition-all" value={date} onChange={(e) => setDate(e.target.value)} required /></div>
                                    <div><label className="text-xs font-mono text-gray-400 mb-2 block uppercase tracking-wider">Time</label><input type="time" className="w-full bg-charcoal-900 border border-white/10 focus:border-accent text-gray-300 font-mono rounded p-3 text-sm outline-none transition-all" value={startTime} onChange={(e) => setStartTime(e.target.value)} required /></div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-2"><label className="text-xs font-mono text-accent mb-2 block uppercase tracking-wider">Sync Code (Check-in)</label><input type="text" className="w-full bg-charcoal-900 border border-accent/50 focus:border-accent text-accent font-mono rounded p-3 text-sm outline-none uppercase transition-all shadow-[0_0_10px_rgba(0,240,255,0.05)]" value={checkInCode} onChange={(e) => setCheckInCode(e.target.value.toUpperCase())} required /></div>
                                    <div className="col-span-1"><label className="text-xs font-mono text-gray-400 mb-2 block uppercase tracking-wider">Value (Pts)</label><input type="number" className="w-full bg-charcoal-900 border border-white/10 focus:border-accent text-white font-mono rounded p-3 text-sm outline-none transition-all" value={eventPoints} onChange={(e) => setEventPoints(e.target.value)} required min="1" /></div>
                                </div>
                                <button type="submit" className="mt-4 bg-charcoal-700 hover:bg-accent hover:text-charcoal-900 text-white font-mono border border-white/10 hover:border-accent rounded p-3 text-sm tracking-widest uppercase transition-all duration-300">Initialize Event</button>
                            </form>
                            {eventMessage && <p className={`mt-4 text-xs font-mono ${eventMessage.includes('Success') ? 'text-accent' : 'text-red-400'}`}>&gt; {eventMessage}</p>}
                        </motion.div>

                        {/* Contribution Logging Form */}
                        <motion.div variants={item} className="bg-charcoal-800 border border-white/10 rounded-lg p-6 group hover:border-white/20 transition-all">
                            <h3 className="text-xs uppercase tracking-widest text-gray-500 font-mono mb-2">Log Data Contribution</h3>
                            <p className="text-xs text-gray-500 mb-6 font-mono">Manually append activity points to a user.</p>
                            
                            <form onSubmit={handleLogContribution} className="flex flex-col gap-4">
                                <div>
                                    <label className="text-xs font-mono text-gray-400 mb-2 block uppercase tracking-wider">Target Operative</label>
                                    <select className="w-full bg-charcoal-900 border border-white/10 focus:border-accent text-gray-300 font-mono rounded p-3 text-sm outline-none transition-all appearance-none" value={selectedMember} onChange={(e) => setSelectedMember(e.target.value)} required>
                                        {members.length === 0 ? <option value="">Fetching network members...</option> : null}
                                        {members.map(m => <option key={m._id} value={m._id}>{m.name} ({m.email})</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-mono text-gray-400 mb-2 block uppercase tracking-wider">Task Designation</label>
                                    <input type="text" className="w-full bg-charcoal-900 border border-white/10 focus:border-accent text-white font-mono rounded p-3 text-sm outline-none transition-all uppercase" placeholder="e.g., DEPLOYED_UI_UPDATE" value={contribTitle} onChange={(e) => setContribTitle(e.target.value)} required />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-2">
                                        <label className="text-xs font-mono text-gray-400 mb-2 block uppercase tracking-wider">Sector / Category</label>
                                        <select className="w-full bg-charcoal-900 border border-white/10 focus:border-accent text-gray-300 font-mono rounded p-3 text-sm outline-none transition-all appearance-none" value={contribCategory} onChange={(e) => setContribCategory(e.target.value)} required>
                                            <option value="Technical">Technical</option><option value="Design">Design</option><option value="Content">Content</option><option value="Management">Management</option><option value="Outreach">Outreach</option><option value="Event Operations">Event Operations</option>
                                        </select>
                                    </div>
                                    <div className="col-span-1"><label className="text-xs font-mono text-accent mb-2 block uppercase tracking-wider">Value (Pts)</label><input type="number" className="w-full bg-charcoal-900 border border-accent/50 focus:border-accent text-accent font-mono rounded p-3 text-sm outline-none transition-all shadow-[0_0_10px_rgba(0,240,255,0.05)]" value={contribPoints} onChange={(e) => setContribPoints(e.target.value)} required min="1" /></div>
                                </div>
                                <button type="submit" className="mt-4 bg-accent/10 hover:bg-accent text-accent hover:text-charcoal-900 font-mono border border-accent/30 hover:border-accent rounded p-3 text-sm tracking-widest uppercase transition-all duration-300">Transmit Points</button>
                            </form>
                            {contribMessage && <p className={`mt-4 text-xs font-mono ${contribMessage.includes('Success') ? 'text-accent' : 'text-red-400'}`}>&gt; {contribMessage}</p>}
                        </motion.div>
                    </div>

                    {/* BOTTOM ROW: MEMBER INACTIVITY LOG */}
                    {stats && stats.memberList && (
                        <motion.div variants={item} className="bg-charcoal-800 border border-white/10 rounded-lg p-6">
                            <h3 className="text-xs uppercase tracking-widest text-gray-500 font-mono mb-2">Network Activity Log</h3>
                            <p className="text-xs text-gray-500 mb-6 font-mono">Automated categorization based on total telemetry.</p>
                            
                            <div className="flex flex-col gap-3">
                                {stats.memberList.map(member => (
                                    <div key={member._id} className="flex justify-between items-center p-4 bg-charcoal-900 border border-white/5 rounded hover:border-white/10 transition-colors">
                                        <div>
                                            <div className="font-heading font-semibold text-gray-200 text-sm uppercase">{member.name}</div>
                                            <div className="text-xs font-mono text-gray-500 mt-1 uppercase">
                                                {member.department} <span className="text-charcoal-600 mx-2">|</span> {member.score} PTS
                                            </div>
                                        </div>
                                        
                                        {/* Precision Status Badges */}
                                        <div className={`px-3 py-1 text-[10px] font-mono tracking-widest uppercase rounded border ${
                                            member.status === 'ACTIVE' 
                                                ? 'bg-accent/10 border-accent/30 text-accent' 
                                                : member.status === 'LOW ACTIVITY' 
                                                    ? 'bg-status-low/10 border-status-low/30 text-status-low' 
                                                    : 'bg-charcoal-900 border-gray-700 text-gray-600'
                                        }`}>
                                            {member.status === 'ACTIVE' && <span className="mr-2 inline-block w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span>}
                                            {member.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </main>
        </div>
    );
};

export default AdminPanel;