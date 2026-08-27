import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const AdminMembers = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    // --- STATES (UNTOUCHED) ---
    const [members, setMembers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMemberDetail, setSelectedMemberDetail] = useState(null);
    const [loading, setLoading] = useState(false);

    // --- LOGIC (UNTOUCHED) ---
    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:5000/api/users/admin/members', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMembers(res.data);
            } catch (error) {
                console.error("Error fetching members", error);
            }
        };
        fetchMembers();
    }, [token]);

    const handleViewProfile = async (id) => {
        setLoading(true);
        try {
            const res = await axios.get(`http://127.0.0.1:5000/api/users/admin/members/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSelectedMemberDetail(res.data);
        } catch (error) {
            console.error("Error fetching member profile", error);
        }
        setLoading(false);
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.put(`http://127.0.0.1:5000/api/users/admin/members/${id}/status`, 
                { statusOverride: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Refresh list
            const res = await axios.get('http://127.0.0.1:5000/api/users/admin/members', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMembers(res.data);
            if(selectedMemberDetail) {
                setSelectedMemberDetail({
                    ...selectedMemberDetail,
                    member: { ...selectedMemberDetail.member, statusOverride: newStatus }
                });
            }
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const filteredMembers = members.filter(m => 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // --- ANIMATION CONFIG ---
    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
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
                    <div className="text-gray-500 hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/leaderboard')} title="Analytics">
                        <span className="text-xl">▤</span>
                    </div>
                    <div className="text-gray-500 hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/admin')} title="Admin Panel">
                        <span className="text-xl">⚙</span>
                    </div>
                    <div className="text-accent cursor-pointer group relative" title="Member Directory">
                        <span className="text-xl">👥</span>
                        <div className="absolute left-10 opacity-0 group-hover:opacity-100 bg-charcoal-700 text-xs font-mono px-2 py-1 rounded transition-opacity z-50">Directory</div>
                    </div>
                </nav>

                <div className="mt-auto text-gray-500 hover:text-red-400 cursor-pointer transition-colors" onClick={() => { localStorage.clear(); navigate('/'); }} title="Terminate Session">
                    <span className="text-xl">✕</span>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto z-10 relative">
                <div className="max-w-6xl mx-auto">
                    
                    {/* Header */}
                    <header className="mb-10 flex justify-between items-end border-b border-white/5 pb-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-heading font-semibold text-white tracking-tight">OPERATIVE_DIRECTORY</h1>
                            <p className="text-xs text-accent mt-2 font-mono tracking-widest uppercase">
                                Global Society Database // {filteredMembers.length} Records Found
                            </p>
                        </div>
                        <div className="hidden md:flex items-center gap-3 bg-charcoal-800 px-4 py-2 border border-accent/30 rounded-full shadow-[0_0_10px_rgba(0,240,255,0.1)]">
                            <span className="text-xs font-mono text-accent">ROOT_ACTIVE</span>
                        </div>
                    </header>

                    {/* Search & Filter Bar */}
                    <div className="mb-6 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="text-gray-500 font-mono text-lg">⌕</span>
                        </div>
                        <input 
                            type="text" 
                            className="w-full bg-charcoal-800 border border-white/10 focus:border-accent text-white font-mono rounded-lg py-4 pl-12 pr-4 text-sm outline-none transition-all placeholder:text-gray-600 focus:shadow-[0_0_15px_rgba(0,240,255,0.05)]" 
                            placeholder="QUERY OPERATIVE BY DESIGNATION OR EMAIL..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Members Table */}
                    <div className="bg-charcoal-800 border border-white/10 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead>
                                    <tr className="bg-charcoal-900/50 border-b border-white/10 text-xs font-mono text-gray-500 uppercase tracking-widest">
                                        <th className="py-4 px-6 font-medium">Identity</th>
                                        <th className="py-4 px-6 font-medium">Sector</th>
                                        <th className="py-4 px-6 font-medium">Telemetry (PTS)</th>
                                        <th className="py-4 px-6 font-medium">Override State</th>
                                        <th className="py-4 px-6 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <motion.tbody variants={container} initial="hidden" animate="show">
                                    {filteredMembers.map(m => (
                                        <motion.tr variants={item} key={m._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                            <td className="py-4 px-6">
                                                <div className="font-heading font-semibold text-gray-200 group-hover:text-white transition-colors">{m.name}</div>
                                                <div className="text-xs font-mono text-gray-600 mt-1">{m.email}</div>
                                            </td>
                                            <td className="py-4 px-6 text-sm font-mono text-gray-400 uppercase">{m.department || 'N/A'}</td>
                                            <td className="py-4 px-6 text-sm font-mono font-bold text-white">{m.activityScore || 0}</td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 rounded text-[10px] font-mono uppercase tracking-widest border ${
                                                    m.statusOverride === 'ACTIVE' 
                                                        ? 'bg-accent/10 border-accent/30 text-accent' 
                                                        : m.statusOverride === 'INACTIVE' 
                                                            ? 'bg-red-500/10 border-red-500/30 text-red-500' 
                                                            : 'bg-charcoal-900 border-gray-700 text-gray-500'
                                                }`}>
                                                    {m.statusOverride || 'AUTO'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <button 
                                                    onClick={() => handleViewProfile(m._id)}
                                                    className="bg-charcoal-900 border border-white/10 hover:border-accent hover:text-accent text-gray-400 font-mono py-2 px-4 rounded text-xs tracking-widest uppercase transition-all"
                                                >
                                                    Inspect
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </motion.tbody>
                            </table>
                            {filteredMembers.length === 0 && (
                                <div className="p-10 text-center text-gray-500 font-mono text-sm tracking-widest uppercase">
                                    No operatives found matching query.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* MODAL: Individual Member Profile */}
                <AnimatePresence>
                    {selectedMemberDetail && (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4"
                        >
                            <motion.div 
                                initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                className="w-full max-w-2xl bg-charcoal-800 border border-white/10 rounded-lg overflow-hidden flex flex-col max-h-[90vh] shadow-[0_0_40px_rgba(0,0,0,0.5)]"
                            >
                                {/* Modal Header */}
                                <div className="p-6 border-b border-white/5 flex justify-between items-start bg-charcoal-900/50">
                                    <div>
                                        <h2 className="text-2xl font-heading font-bold text-white uppercase">{selectedMemberDetail.member.name}</h2>
                                        <p className="text-xs font-mono text-gray-500 mt-2 uppercase tracking-widest">
                                            {selectedMemberDetail.member.email} <span className="mx-2">|</span> {selectedMemberDetail.member.department}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedMemberDetail(null)} 
                                        className="text-gray-500 hover:text-accent transition-colors p-2"
                                    >
                                        <span className="text-xl">✕</span>
                                    </button>
                                </div>
                                
                                {/* Modal Content Scrollable Area */}
                                <div className="p-6 overflow-y-auto">
                                    
                                    {/* Manual Override Controls */}
                                    <div className="mb-8 bg-charcoal-900 border border-white/5 rounded-lg p-5">
                                        <span className="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">System Protocol Override</span>
                                        <div className="flex flex-wrap gap-3">
                                            <button 
                                                onClick={() => handleStatusChange(selectedMemberDetail.member._id, 'AUTO')} 
                                                className={`flex-1 min-w-[120px] font-mono text-xs uppercase tracking-widest p-3 rounded border transition-all ${
                                                    selectedMemberDetail.member.statusOverride === 'AUTO' || !selectedMemberDetail.member.statusOverride
                                                    ? 'bg-gray-700/20 border-gray-500 text-gray-300'
                                                    : 'bg-charcoal-800 border-white/10 text-gray-500 hover:border-gray-500 hover:text-gray-300'
                                                }`}
                                            >
                                                Default [Auto]
                                            </button>
                                            <button 
                                                onClick={() => handleStatusChange(selectedMemberDetail.member._id, 'ACTIVE')} 
                                                className={`flex-1 min-w-[120px] font-mono text-xs uppercase tracking-widest p-3 rounded border transition-all ${
                                                    selectedMemberDetail.member.statusOverride === 'ACTIVE'
                                                    ? 'bg-accent/20 border-accent text-accent shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                                                    : 'bg-charcoal-800 border-white/10 text-gray-500 hover:border-accent hover:text-accent'
                                                }`}
                                            >
                                                Force Active
                                            </button>
                                            <button 
                                                onClick={() => handleStatusChange(selectedMemberDetail.member._id, 'INACTIVE')} 
                                                className={`flex-1 min-w-[120px] font-mono text-xs uppercase tracking-widest p-3 rounded border transition-all ${
                                                    selectedMemberDetail.member.statusOverride === 'INACTIVE'
                                                    ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_15px_rgba(244,67,54,0.2)]'
                                                    : 'bg-charcoal-800 border-white/10 text-gray-500 hover:border-red-500 hover:text-red-500'
                                                }`}
                                            >
                                                Force Inactive
                                            </button>
                                        </div>
                                    </div>

                                    {/* Timeline */}
                                    <div>
                                        <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">Telemetry Logs</h3>
                                        {selectedMemberDetail.timeline.length === 0 ? (
                                            <div className="border border-dashed border-white/10 p-8 text-center rounded">
                                                <p className="text-gray-600 font-mono text-xs tracking-widest uppercase">No recorded activity.</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-3">
                                                {selectedMemberDetail.timeline.map(item => (
                                                    <div key={item.id} className="p-4 bg-charcoal-900 border-l-2 border-accent/40 rounded flex justify-between items-center hover:border-accent transition-colors">
                                                        <div>
                                                            <div className="text-sm font-heading font-semibold text-gray-200">{item.title}</div>
                                                            <div className="text-[10px] font-mono text-gray-600 mt-1 uppercase tracking-widest">
                                                                {item.type} <span className="mx-2">|</span> {new Date(item.date).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                        <div className="text-accent font-mono font-bold">+{item.points}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </main>
        </div>
    );
};

export default AdminMembers;