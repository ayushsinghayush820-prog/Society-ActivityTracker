import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();
    
    const userString = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const user = userString ? JSON.parse(userString) : null;

    const [checkInCode, setCheckInCode] = useState('');
    const [message, setMessage] = useState('');
    const [currentScore, setCurrentScore] = useState(user ? user.activityScore : 0);
    const [timeline, setTimeline] = useState([]); // State for the new timeline

    // Fetch the activity timeline when the dashboard loads
    useEffect(() => {
        const fetchTimeline = async () => {
            if (user) {
                try {
                    const res = await axios.get('http://127.0.0.1:5000/api/users/me/timeline', {
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
        setMessage('Processing...');

        try {
            const response = await axios.post(
                'http://127.0.0.1:5000/api/attendance/check-in',
                { checkInCode },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const pointsEarned = response.data.eventDetails.pointsEarned;
            const newScore = currentScore + pointsEarned;
            
            setCurrentScore(newScore);
            const updatedUser = { ...user, activityScore: newScore };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setMessage(`Successfully checked in! (+${pointsEarned} pts)`);
            setCheckInCode('');
            
            // Instantly refresh the timeline to show the new event
            try {
                const res = await axios.get('http://127.0.0.1:5000/api/users/me/timeline', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTimeline(res.data);
            } catch (err) {
                console.error('Timeline refresh failed', err);
            }
            
        } catch (error) {
            setMessage(error.response?.data?.message || 'Check-in failed.');
        }
    };

    if (!user) {
        return (
            <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a', color: '#fff' }}>
                <div style={{ textAlign: 'center' }}>
                    <h2>Session Expired</h2>
                    <button className="btn-accent btn-dark" style={{ marginTop: '20px' }} onClick={() => navigate('/')}>Return to Login</button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-layout">
            
            {/* The Left Sidebar */}
            <div className="sidebar">
                <div className="sidebar-icon" style={{ color: '#fff' }} title="Dashboard">⊞</div>
                <div className="sidebar-icon" onClick={() => navigate('/leaderboard')} title="Analytics">📊</div>
                {/* Only show Admin icon if the user is an ADMIN */}
                {user.role === 'ADMIN' && (
                    <div className="sidebar-icon" onClick={() => navigate('/admin')} title="Admin Panel">🛠️</div>
                )}
                <div style={{ marginTop: 'auto' }} className="sidebar-icon" onClick={handleLogout} title="Logout">🚪</div>
            </div>

            {/* The Main Content */}
            <div className="dashboard-main">
                
                <div className="dashboard-header">
                    <h1>Dashboard</h1>
                    <div className="user-profile-header">
                        <span>{user.name}</span>
                        <div className="avatar"></div>
                    </div>
                </div>
                
                <div className="dashboard-grid">
                    
                    {/* Activity Score Card */}
                    <div className="dark-card">
                        <h3>Total Activity</h3>
                        <div className="score-display">{currentScore}</div>
                        <p style={{ color: '#666', fontSize: '13px' }}>Total points accumulated from attended events.</p>
                    </div>

                    {/* Profile Details Card */}
                    <div className="dark-card">
                        <h3>Profile Details</h3>
                        <div style={{ marginTop: '20px', color: '#bbb', fontSize: '14px', lineHeight: '2' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222', paddingBottom: '10px', marginBottom: '10px' }}>
                                <span>Role</span>
                                <span style={{ color: '#fff' }}>{user.role}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222', paddingBottom: '10px', marginBottom: '10px' }}>
                                <span>Department</span>
                                <span style={{ color: '#fff' }}>{user.department}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Status</span>
                                <span style={{ color: '#4caf50' }}>Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Check-In Card */}
                    <div className="dark-card" style={{ gridColumn: '1 / -1' }}>
                        <h3>Event Check-In</h3>
                        <p style={{ color: '#666', fontSize: '14px', marginBottom: '25px' }}>Enter the unique event code to log your attendance and increase your score.</p>
                        
                        <form onSubmit={handleCheckIn} style={{ display: 'flex', gap: '15px', maxWidth: '600px' }}>
                            <input 
                                type="text" 
                                className="dark-input"
                                placeholder="Enter Event Code (e.g., WELCOME26)" 
                                value={checkInCode}
                                onChange={(e) => setCheckInCode(e.target.value)}
                                required
                            />
                            <button type="submit" className="btn-dark btn-accent" style={{ whiteSpace: 'nowrap' }}>
                                Submit Code
                            </button>
                        </form>

                        {message && (
                            <p style={{ marginTop: '20px', fontSize: '14px', color: message.includes('Successfully') ? '#4caf50' : '#f44336' }}>
                                {message}
                            </p>
                        )}
                    </div>

                    {/* Activity Timeline Card */}
                    <div className="dark-card" style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                        <h3>Activity Timeline</h3>
                        <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>Your recent event attendance and contributions.</p>
                        
                        {timeline.length === 0 ? (
                            <p style={{ color: '#888', fontSize: '13px' }}>No activity recorded yet.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {timeline.map(item => (
                                    <div key={item.id} style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center', 
                                        padding: '15px', 
                                        backgroundColor: '#0f0f0f', 
                                        borderRadius: '10px', 
                                        borderLeft: item.type === 'Event Attendance' ? '4px solid #4caf50' : '4px solid #3b82f6' 
                                    }}>
                                        <div>
                                            <div style={{ fontWeight: '600', color: '#fff', fontSize: '14px' }}>{item.title}</div>
                                            <div style={{ fontSize: '12px', color: '#888', marginTop: '3px' }}>
                                                {item.type} • {new Date(item.date).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: item.type === 'Event Attendance' ? '#4caf50' : '#3b82f6' }}>
                                            +{item.points} pts
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;