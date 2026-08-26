import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminMembers = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    const [members, setMembers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMemberDetail, setSelectedMemberDetail] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch all members on load
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

    // Fetch individual member timeline/profile popup
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

    // Manual status override handler
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

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="sidebar-icon" onClick={() => navigate('/dashboard')} title="Dashboard">⊞</div>
                <div className="sidebar-icon" onClick={() => navigate('/leaderboard')} title="Leaderboard">📊</div>
                <div className="sidebar-icon" onClick={() => navigate('/admin')} title="Admin Control Center">🛠️</div>
                <div className="sidebar-icon" style={{ color: '#fff' }} title="Member Directory">👥</div>
                <div style={{ marginTop: 'auto' }} className="sidebar-icon" onClick={() => { localStorage.clear(); navigate('/'); }} title="Logout">🚪</div>
            </div>

            {/* Main Content */}
            <div className="dashboard-main">
                <div className="dashboard-header" style={{ marginBottom: '20px' }}>
                    <h1>Society Members Directory</h1>
                    <div className="user-profile-header">
                        <span style={{ color: '#ff5722', fontWeight: 'bold' }}>ADMIN</span>
                        <div className="avatar"></div>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="dark-card" style={{ padding: '20px', marginBottom: '20px' }}>
                    <input 
                        type="text" 
                        className="dark-input" 
                        placeholder="Search members by name or email..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Members Table */}
                <div className="dark-card" style={{ padding: '20px' }}>
                    <h3>All Members ({filteredMembers.length})</h3>
                    <div style={{ overflowX: 'auto', marginTop: '15px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: '#ccc', fontSize: '14px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #333', color: '#888' }}>
                                    <th style={{ padding: '12px' }}>Name</th>
                                    <th style={{ padding: '12px' }}>Department</th>
                                    <th style={{ padding: '12px' }}>Score</th>
                                    <th style={{ padding: '12px' }}>Override Status</th>
                                    <th style={{ padding: '12px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMembers.map(m => (
                                    <tr key={m._id} style={{ borderBottom: '1px solid #1f1f1f' }}>
                                        <td style={{ padding: '12px', fontWeight: 'bold', color: '#fff' }}>{m.name} <div style={{ fontSize: '11px', color: '#666' }}>{m.email}</div></td>
                                        <td style={{ padding: '12px' }}>{m.department || 'N/A'}</td>
                                        <td style={{ padding: '12px', color: '#3b82f6', fontWeight: 'bold' }}>{m.activityScore || 0} pts</td>
                                        <td style={{ padding: '12px' }}>
                                            <span style={{ 
                                                padding: '4px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold',
                                                backgroundColor: m.statusOverride === 'ACTIVE' ? 'rgba(76,175,80,0.1)' : m.statusOverride === 'INACTIVE' ? 'rgba(244,67,54,0.1)' : 'rgba(255,152,0,0.1)',
                                                color: m.statusOverride === 'ACTIVE' ? '#4caf50' : m.statusOverride === 'INACTIVE' ? '#f44336' : '#ff9800'
                                            }}>
                                                {m.statusOverride || 'AUTO'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <button 
                                                onClick={() => handleViewProfile(m._id)}
                                                style={{ backgroundColor: '#222', color: '#fff', border: '1px solid #444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                                            >
                                                View Profile
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Individual Member Profile Popup / Modal */}
                {selectedMemberDetail && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                        <div className="dark-card" style={{ width: '600px', maxHeight: '80vh', overflowY: 'auto', padding: '30px', border: '1px solid #444' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2>{selectedMemberDetail.member.name}'s Profile</h2>
                                <button onClick={() => setSelectedMemberDetail(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer' }}>✕</button>
                            </div>
                            
                            <p style={{ color: '#888', fontSize: '13px', marginBottom: '15px' }}>{selectedMemberDetail.member.email} • {selectedMemberDetail.member.department}</p>
                            
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                                <span style={{ fontSize: '13px', color: '#aaa', alignSelf: 'center' }}>Manual Status Control:</span>
                                <button onClick={() => handleStatusChange(selectedMemberDetail.member._id, 'AUTO')} style={{ background: '#222', color: '#ff9800', border: '1px solid #ff9800', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Set AUTO</button>
                                <button onClick={() => handleStatusChange(selectedMemberDetail.member._id, 'ACTIVE')} style={{ background: '#222', color: '#4caf50', border: '1px solid #4caf50', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Force ACTIVE</button>
                                <button onClick={() => handleStatusChange(selectedMemberDetail.member._id, 'INACTIVE')} style={{ background: '#222', color: '#f44336', border: '1px solid #f44336', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Force INACTIVE</button>
                            </div>

                            <h3 style={{ fontSize: '16px', marginTop: '20px', marginBottom: '10px' }}>Activity Timeline History</h3>
                            {selectedMemberDetail.timeline.length === 0 ? (
                                <p style={{ color: '#666', fontSize: '13px' }}>No recorded activity for this member.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {selectedMemberDetail.timeline.map(item => (
                                        <div key={item.id} style={{ padding: '10px 15px', backgroundColor: '#0f0f0f', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', borderLeft: '3px solid #3b82f6' }}>
                                            <div>
                                                <div style={{ fontSize: '13px', color: '#fff', fontWeight: 'bold' }}>{item.title}</div>
                                                <div style={{ fontSize: '11px', color: '#777' }}>{item.type} • {new Date(item.date).toLocaleDateString()}</div>
                                            </div>
                                            <div style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '13px' }}>+{item.points} pts</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminMembers;