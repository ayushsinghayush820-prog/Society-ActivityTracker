import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [isRegistering, setIsRegistering] = useState(false); // Toggle between Login & Register
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [department, setDepartment] = useState('Technical');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Processing...');

        try {
            if (isRegistering) {
                // --- REGISTER API CALL ---
                await axios.post('http://127.0.0.1:5000/api/auth/register', {
                    name,
                    email,
                    password,
                    department,
                   // role: 'member' // Default role for web signups
                });
                setMessage('Account created successfully! Please login.');
                setIsRegistering(false); // Switch back to login mode
                setPassword('');
            } else {
                // --- LOGIN API CALL ---
                const response = await axios.post('http://127.0.0.1:5000/api/auth/login', {
                    email,
                    password
                });

                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data));

                // Redirect based on role
                if (response.data.role === 'ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Authentication failed. Please check your details.');
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a', color: '#fff' }}>
            <div className="dark-card" style={{ width: '400px', padding: '40px', border: '1px solid #222' }}>
                
                <h2 style={{ marginBottom: '10px', fontSize: '24px' }}>
                    {isRegistering ? 'Create Account 🚀' : 'Welcome Back 👋'}
                </h2>
                <p style={{ color: '#666', fontSize: '13px', marginBottom: '30px' }}>
                    {isRegistering ? 'Join the DTU Society tracking portal.' : 'Enter your credentials to access your portal.'}
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    
                    {isRegistering && (
                        <div>
                            <label style={{ fontSize: '12px', color: '#888', marginBottom: '5px', display: 'block' }}>Full Name</label>
                            <input 
                                type="text" 
                                className="dark-input" 
                                placeholder="e.g., Sameer" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                            />
                        </div>
                    )}

                    <div>
                        <label style={{ fontSize: '12px', color: '#888', marginBottom: '5px', display: 'block' }}>Email Address</label>
                        <input 
                            type="email" 
                            className="dark-input" 
                            placeholder="e.g., sameer@dtu.ac.in" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>

                    <div>
                        <label style={{ fontSize: '12px', color: '#888', marginBottom: '5px', display: 'block' }}>Password</label>
                        <input 
                            type="password" 
                            className="dark-input" 
                            placeholder="••••••••" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>

                    {isRegistering && (
                        <div>
                            <label style={{ fontSize: '12px', color: '#888', marginBottom: '5px', display: 'block' }}>Department</label>
                            <select 
                                className="dark-input" 
                                value={department} 
                                onChange={(e) => setDepartment(e.target.value)}
                                style={{ appearance: 'none' }}
                            >
                                <option value="Technical">Technical</option>
                                <option value="Design">Design</option>
                                <option value="Content">Content</option>
                                <option value="Management">Management</option>
                                <option value="Outreach">Outreach</option>
                                <option value="Event Operations">Event Operations</option>
                            </select>
                        </div>
                    )}

                    <button type="submit" className="btn-dark btn-accent" style={{ marginTop: '10px', padding: '12px' }}>
                        {isRegistering ? 'Sign Up' : 'Login'}
                    </button>
                </form>

                {message && (
                    <p style={{ marginTop: '20px', fontSize: '13px', textAlign: 'center', color: message.includes('success') || message.includes('Successfully') ? '#4caf50' : '#f44336' }}>
                        {message}
                    </p>
                )}

                <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '13px', color: '#888' }}>
                    {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
                    <span 
                        onClick={() => { setIsRegistering(!isRegistering); setMessage(''); }} 
                        style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        {isRegistering ? 'Login here' : 'Sign up here'}
                    </span>
                </div>

            </div>
        </div>
    );
};

export default Login;