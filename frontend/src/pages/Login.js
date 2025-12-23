import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authAPI from '../api/auth.api';
import { toast } from 'react-hot-toast';
import './Auth.css';

const Login = () => {
    // ... state ...
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (formData.email && formData.password) {
                const response = await authAPI.login(formData.email, formData.password);

                if (response.success) {
                    const { token, ...user } = response.data;
                    login(user, token);
                    toast.success(`Welcome back, ${user.name}! 🍕`);
                    navigate('/restaurants');
                } else {
                    setError(response.message || 'Login failed');
                    toast.error(response.message || 'Login failed');
                }
            } else {
                setError('Please enter email and password');
            }
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || 'Login failed. Please try again.';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Welcome Back! 🍕</h1>
                    <p>Login to order your favorite food</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Don't have an account?{' '}
                        <Link to="/register" className="auth-link">
                            Sign up here
                        </Link>
                    </p>
                </div>


            </div>
        </div>
    );
};

export default Login;
