import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const Login = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [department, setDepartment] = useState('Technical');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Processing request...');

        try {
            if (isRegistering) {
                // --- REGISTER API CALL ---
                await axios.post('http://127.0.0.1:5000/api/auth/register', {
                    name,
                    email,
                    password,
                    department,
                });
                setMessage('Credentials accepted! Please initiate login.');
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
            setMessage(error.response?.data?.message || 'Authentication failed. Verify credentials.');
        }
    };

    return (
        <div className="flex relative h-screen justify-center items-center bg-charcoal-900 font-body text-gray-300">
            
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="z-10 w-full max-w-md bg-charcoal-800 border border-white/10 rounded-lg p-10 relative overflow-hidden shadow-2xl"
            >
                {/* Accent Glow line at the top */}
                <div className="absolute top-0 left-0 w-full h-1 bg-accent shadow-[0_0_15px_rgba(0,240,255,0.5)]"></div>

                <div className="mb-10">
                    <h2 className="text-3xl font-heading font-bold text-white tracking-tight">
                        {isRegistering ? 'INITIALIZE_USER' : 'SYSTEM_LOGIN'}
                    </h2>
                    <p className="text-xs font-mono text-accent mt-2 tracking-widest uppercase">
                        {isRegistering ? 'Create secure credentials' : 'Enter credentials to access'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    
                    {isRegistering && (
                        <div>
                            <label className="text-xs font-mono text-gray-500 mb-2 block uppercase tracking-wider">Full Name</label>
                            <input 
                                type="text" 
                                className="w-full bg-charcoal-900 border border-white/10 focus:border-accent text-white font-mono rounded p-3 text-sm outline-none transition-all focus:shadow-[0_0_10px_rgba(0,240,255,0.1)]" 
                                placeholder="e.g., Sameer" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                            />
                        </div>
                    )}

                    <div>
                        <label className="text-xs font-mono text-gray-500 mb-2 block uppercase tracking-wider">Email Array</label>
                        <input 
                            type="email" 
                            className="w-full bg-charcoal-900 border border-white/10 focus:border-accent text-white font-mono rounded p-3 text-sm outline-none transition-all focus:shadow-[0_0_10px_rgba(0,240,255,0.1)]" 
                            placeholder="operative@dtu.ac.in" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>

                    <div>
                        <label className="text-xs font-mono text-gray-500 mb-2 block uppercase tracking-wider">Security Key</label>
                        <input 
                            type="password" 
                            className="w-full bg-charcoal-900 border border-white/10 focus:border-accent text-white font-mono rounded p-3 text-sm outline-none transition-all focus:shadow-[0_0_10px_rgba(0,240,255,0.1)]" 
                            placeholder="••••••••" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>

                    {isRegistering && (
                        <div>
                            <label className="text-xs font-mono text-gray-500 mb-2 block uppercase tracking-wider">Sector Element</label>
                            <select 
                                className="w-full bg-charcoal-900 border border-white/10 focus:border-accent text-gray-300 font-mono rounded p-3 text-sm outline-none transition-all focus:shadow-[0_0_10px_rgba(0,240,255,0.1)] appearance-none"
                                value={department} 
                                onChange={(e) => setDepartment(e.target.value)}
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

                    <button 
                        type="submit" 
                        className="mt-6 w-full bg-charcoal-700 hover:bg-accent hover:text-charcoal-900 text-accent font-mono border border-accent rounded p-3 text-sm tracking-widest uppercase transition-all duration-300"
                    >
                        {isRegistering ? 'Execute Registration' : 'Authenticate'}
                    </button>
                </form>

                {message && (
                    <motion.p 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className={`mt-4 text-xs font-mono text-center ${message.includes('accepted') || message.includes('Processing') ? 'text-accent' : 'text-red-400'}`}
                    >
                        &gt; {message}
                    </motion.p>
                )}

                <div className="mt-8 text-center text-xs font-mono text-gray-500 uppercase tracking-widest">
                    {isRegistering ? 'Existing protocol? ' : "No access code? "}
                    <span 
                        onClick={() => { setIsRegistering(!isRegistering); setMessage(''); }} 
                        className="text-accent cursor-pointer hover:underline transition-colors ml-1"
                    >
                        {isRegistering ? '[ Initiate Login ]' : '[ Request Access ]'}
                    </span>
                </div>

            </motion.div>
        </div>
    );
};

export default Login;