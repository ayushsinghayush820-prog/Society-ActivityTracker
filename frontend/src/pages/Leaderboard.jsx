import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Leaderboard = () => {
    const navigate = useNavigate();
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    const userString = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const user = userString ? JSON.parse(userString) : null;

    useEffect(() => {
        // Fetch leaderboard data when the page loads
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/api/users/leaderboard', {
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

    if (!user) return null; // Let the router handle unauthenticated users

    return (
        <div className="dashboard-layout">
            
            {/* The Left Sidebar */}
            <div className="sidebar">
                <div className="sidebar-icon" onClick={() => navigate('/dashboard')} title="Dashboard">⊞</div>
                {/* Active page is highlighted in white */}
                <div className="sidebar-icon" style={{ color: '#fff' }} title="Analytics">📊</div>
                {/* Admin icon navigates to the Admin Panel */}
                <div className="sidebar-icon" onClick={() => navigate('/admin')} title="Admin Panel">🛠️</div>
                <div style={{ marginTop: 'auto' }} className="sidebar-icon" onClick={handleLogout} title="Logout">🚪</div>
            </div>

            {/* The Main Content */}
            <div className="dashboard-main">
                <div className="dashboard-header">
                    <h1>Society Leaderboard</h1>
                    <div className="user-profile-header">
                        <span>{user.name}</span>
                        <div className="avatar"></div>
                    </div>
                </div>

                <div className="dark-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h3>Top Active Members</h3>
                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>Ranking based on total event attendance points.</p>

                    {loading ? (
                        <p style={{ color: '#ff5722' }}>Loading rankings...</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {leaders.map((leader, index) => (
                                <div key={leader._id} style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    padding: '15px 20px',
                                    backgroundColor: index === 0 ? 'rgba(255, 87, 34, 0.1)' : '#0f0f0f',
                                    border: index === 0 ? '1px solid #ff5722' : '1px solid #222',
                                    borderRadius: '10px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ 
                                            fontSize: '20px', 
                                            fontWeight: 'bold', 
                                            color: index === 0 ? '#ff5722' : '#666',
                                            width: '30px'
                                        }}>
                                            #{index + 1}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '600', color: index === 0 ? '#ff5722' : '#fff' }}>
                                                {leader.name} {index === 0 && '👑'}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#888' }}>{leader.department} • {leader.role}</div>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>
                                        {leader.activityScore} <span style={{ fontSize: '14px', color: '#666', fontWeight: 'normal' }}>pts</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;