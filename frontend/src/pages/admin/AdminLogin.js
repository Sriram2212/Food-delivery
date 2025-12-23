import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import authAPI from '../../api/auth.api';
import './Admin.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('admin@nammafoodie.com');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const responseData = await authAPI.login(email, password);

            // authAPI returns response.data directly
            if (responseData.success) {
                const userData = responseData.data;
                login(userData, userData.token);
                localStorage.setItem('adminAuth', 'true');
                toast.success('Admin login successful! 🔐');
                navigate('/admin/dashboard');
            }
        } catch (error) {
            console.error('Admin Login Error:', error);
            const msg = error.response?.data?.message || 'Login failed. Are you an admin?';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
                <div className="admin-login-header">
                    <span className="admin-emoji">🛡️</span>
                    <h1>Secure Admin Portal</h1>
                    <p>Enter your credentials to manage the system</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Admin Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="admin-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="admin-input"
                            required
                        />
                    </div>
                    <button type="submit" className="admin-submit-btn" disabled={loading}>
                        {loading ? 'Authenticating...' : 'Unlock Dashboard'}
                    </button>
                    <div className="login-footer">
                        <p>Default credentials: <b>admin@nammafoodie.com</b> / <b>admin123</b></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
