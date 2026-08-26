import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminPanel = () => {
    const navigate = useNavigate();
    
    const userString = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const user = userString ? JSON.parse(userString) : null;

    // --- STATES ---
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

    // --- NEW STATE FOR DASHBOARD STATS ---
    const [stats, setStats] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/'); 
    };

    // Fetch members and stats when component loads
    useEffect(() => {
        const fetchAdminData = async () => {
            if (user && user.role === 'ADMIN') {
                try {
                    // 1. Fetch members for the contribution dropdown
                    const memRes = await axios.get('http://127.0.0.1:5000/api/contributions/users', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setMembers(memRes.data);
                    if(memRes.data.length > 0) setSelectedMember(memRes.data[0]._id);

                    // 2. Fetch society stats for the dashboard overview
                    const statsRes = await axios.get('http://127.0.0.1:5000/api/users/admin/stats', {
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
        setEventMessage('Creating event...');
        try {
            const response = await axios.post(
                'http://127.0.0.1:5000/api/events',
                { title, date, startTime, eventType, checkInCode, points: eventPoints },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEventMessage(`Success! "${response.data.title}" created.`);
            setTitle(''); setDate(''); setStartTime(''); setCheckInCode(''); setEventPoints(10);
        } catch (error) {
            setEventMessage(error.response?.data?.message || 'Failed to create event.');
        }
    };

    const handleLogContribution = async (e) => {
        e.preventDefault();
        setContribMessage('Logging contribution...');
        try {
            await axios.post(
                'http://127.0.0.1:5000/api/contributions',
                { memberId: selectedMember, title: contribTitle, category: contribCategory, points: contribPoints },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setContribMessage('Success! Points awarded.');
            setContribTitle(''); setContribPoints(5);
            
            // Refresh stats to show updated points instantly
            const statsRes = await axios.get('http://127.0.0.1:5000/api/users/admin/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(statsRes.data);
            
        } catch (error) {
            setContribMessage(error.response?.data?.message || 'Failed to log contribution.');
        }
    };

    if (!user || user.role !== 'ADMIN') {
        return (
            <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a', color: '#fff' }}>
                <div style={{ textAlign: 'center' }}>
                    <h2>🚨 Access Denied</h2>
                    <p style={{ color: '#666', marginTop: '10px' }}>You do not have administrator privileges.</p>
                    <button className="btn-accent btn-dark" style={{ marginTop: '20px' }} onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-layout">
            
            {/* The Left Sidebar */}
            <div className="sidebar">
                <div className="sidebar-icon" onClick={() => navigate('/dashboard')} title="Dashboard">⊞</div>
                <div className="sidebar-icon" onClick={() => navigate('/leaderboard')} title="Analytics">📊</div>
                <div className="sidebar-icon" style={{ color: '#fff' }} title="Admin Panel">🛠️</div>
                <div style={{ marginTop: 'auto' }} className="sidebar-icon" onClick={handleLogout} title="Logout">🚪</div>
            </div>

            {/* The Main Content */}
            <div className="dashboard-main">
                <div className="dashboard-header" style={{ marginBottom: '20px' }}>
                    <h1>Admin Control Center</h1>
                    <div className="user-profile-header">
                        <span style={{ color: '#ff5722', fontWeight: 'bold' }}>ADMIN</span>
                        <div className="avatar"></div>
                    </div>
                </div>

                {/* --- TOP ROW: SOCIETY OVERVIEW STATS --- */}
                {stats && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                        <div className="dark-card" style={{ padding: '20px', textAlign: 'center' }}>
                            <div style={{ fontSize: '12px', color: '#888' }}>Total Members</div>
                            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#fff', marginTop: '10px' }}>{stats.total}</div>
                        </div>
                        <div className="dark-card" style={{ padding: '20px', textAlign: 'center', border: '1px solid rgba(76, 175, 80, 0.3)' }}>
                            <div style={{ fontSize: '12px', color: '#4caf50' }}>Active</div>
                            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#4caf50', marginTop: '10px' }}>{stats.active}</div>
                        </div>
                        <div className="dark-card" style={{ padding: '20px', textAlign: 'center', border: '1px solid rgba(255, 152, 0, 0.3)' }}>
                            <div style={{ fontSize: '12px', color: '#ff9800' }}>Low Activity</div>
                            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#ff9800', marginTop: '10px' }}>{stats.lowActivity}</div>
                        </div>
                        <div className="dark-card" style={{ padding: '20px', textAlign: 'center', border: '1px solid rgba(244, 67, 54, 0.3)' }}>
                            <div style={{ fontSize: '12px', color: '#f44336' }}>Inactive</div>
                            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#f44336', marginTop: '10px' }}>{stats.inactive}</div>
                        </div>
                    </div>
                )}

                {/* --- MIDDLE ROW: THE FORMS --- */}
                <div className="dashboard-grid">
                    {/* Create Event Card */}
                    <div className="dark-card">
                        <h3>Deploy New Event</h3>
                        <p style={{ color: '#666', fontSize: '13px', marginBottom: '20px' }}>Generate a check-in code for society members.</p>
                        <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div>
                                <label style={{ fontSize: '12px', color: '#888', marginBottom: '5px', display: 'block' }}>Event Title</label>
                                <input type="text" className="dark-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div><label style={{ fontSize: '12px', color: '#888', marginBottom: '5px', display: 'block' }}>Date</label><input type="date" className="dark-input" value={date} onChange={(e) => setDate(e.target.value)} required /></div>
                                <div><label style={{ fontSize: '12px', color: '#888', marginBottom: '5px', display: 'block' }}>Start Time</label><input type="time" className="dark-input" value={startTime} onChange={(e) => setStartTime(e.target.value)} required /></div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px' }}>
                                <div><label style={{ fontSize: '12px', color: '#888', marginBottom: '5px', display: 'block' }}>Check-In Code</label><input type="text" className="dark-input" style={{ textTransform: 'uppercase' }} value={checkInCode} onChange={(e) => setCheckInCode(e.target.value.toUpperCase())} required /></div>
                                <div><label style={{ fontSize: '12px', color: '#888', marginBottom: '5px', display: 'block' }}>Points</label><input type="number" className="dark-input" value={eventPoints} onChange={(e) => setEventPoints(e.target.value)} required min="1" /></div>
                            </div>
                            <button type="submit" className="btn-dark btn-accent" style={{ marginTop: '10px' }}>Create Event</button>
                        </form>
                        {eventMessage && <div style={{ marginTop: '15px', padding: '10px', borderRadius: '8px', fontSize: '13px', backgroundColor: eventMessage.includes('Success') ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)', color: eventMessage.includes('Success') ? '#4caf50' : '#f44336' }}>{eventMessage}</div>}
                    </div>

                    {/* Log Contribution Card */}
                    <div className="dark-card">
                        <h3>Log Member Contribution</h3>
                        <p style={{ color: '#666', fontSize: '13px', marginBottom: '20px' }}>Manually award points for specific society tasks.</p>
                        <form onSubmit={handleLogContribution} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div>
                                <label style={{ fontSize: '12px', color: '#888', marginBottom: '5px', display: 'block' }}>Select Member</label>
                                <select className="dark-input" value={selectedMember} onChange={(e) => setSelectedMember(e.target.value)} required style={{ appearance: 'none' }}>
                                    {members.length === 0 ? <option value="">Loading members...</option> : null}
                                    {members.map(m => <option key={m._id} value={m._id}>{m.name} ({m.email})</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', color: '#888', marginBottom: '5px', display: 'block' }}>Task / Contribution Title</label>
                                <input type="text" className="dark-input" placeholder="e.g., Designed Instagram Poster" value={contribTitle} onChange={(e) => setContribTitle(e.target.value)} required />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px' }}>
                                <div>
                                    <label style={{ fontSize: '12px', color: '#888', marginBottom: '5px', display: 'block' }}>Category</label>
                                    <select className="dark-input" value={contribCategory} onChange={(e) => setContribCategory(e.target.value)} required style={{ appearance: 'none' }}>
                                        <option value="Technical">Technical</option><option value="Design">Design</option><option value="Content">Content</option><option value="Management">Management</option><option value="Outreach">Outreach</option><option value="Event Operations">Event Operations</option>
                                    </select>
                                </div>
                                <div><label style={{ fontSize: '12px', color: '#888', marginBottom: '5px', display: 'block' }}>Points</label><input type="number" className="dark-input" value={contribPoints} onChange={(e) => setContribPoints(e.target.value)} required min="1" /></div>
                            </div>
                            <button type="submit" className="btn-dark" style={{ marginTop: '10px', backgroundColor: '#3b82f6', color: 'white', border: 'none' }}>Award Points</button>
                        </form>
                        {contribMessage && <div style={{ marginTop: '15px', padding: '10px', borderRadius: '8px', fontSize: '13px', backgroundColor: contribMessage.includes('Success') ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)', color: contribMessage.includes('Success') ? '#4caf50' : '#f44336' }}>{contribMessage}</div>}
                    </div>
                </div>

                {/* --- BOTTOM ROW: AUTOMATED INACTIVITY TRACKER --- */}
                {stats && stats.memberList && (
                    <div className="dark-card" style={{ marginTop: '30px' }}>
                        <h3>Member Inactivity Tracker</h3>
                        <p style={{ color: '#666', fontSize: '13px', marginBottom: '20px' }}>Automated categorization based on total society participation points.</p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {stats.memberList.map(member => (
                                <div key={member._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', backgroundColor: '#0f0f0f', borderRadius: '10px', border: '1px solid #222' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '15px' }}>{member.name}</div>
                                        <div style={{ fontSize: '12px', color: '#888', marginTop: '3px' }}>{member.department} • {member.score} Total Points</div>
                                    </div>
                                    
                                    {/* The Dynamic Status Badge */}
                                    <div style={{ 
                                        padding: '6px 14px', 
                                        borderRadius: '20px', 
                                        fontSize: '11px', 
                                        fontWeight: 'bold',
                                        letterSpacing: '0.5px',
                                        backgroundColor: member.status === 'ACTIVE' ? 'rgba(76, 175, 80, 0.1)' : member.status === 'LOW ACTIVITY' ? 'rgba(255, 152, 0, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                                        color: member.status === 'ACTIVE' ? '#4caf50' : member.status === 'LOW ACTIVITY' ? '#ff9800' : '#f44336',
                                        border: `1px solid ${member.status === 'ACTIVE' ? 'rgba(76, 175, 80, 0.3)' : member.status === 'LOW ACTIVITY' ? 'rgba(255, 152, 0, 0.3)' : 'rgba(244, 67, 54, 0.3)'}`
                                    }}>
                                        {member.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminPanel;