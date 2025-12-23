import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Home, Utensils, ShoppingCart, Bell, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import orderAPI from '../api/order.api';
import userAPI from '../api/user.api';
import './Navbar.css';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { getItemCount } = useCart();
    const navigate = useNavigate();
    const [activeOrder, setActiveOrder] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showBanner, setShowBanner] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchActiveOrder();
            fetchNotifications();
        }
    }, [isAuthenticated]);

    // Show banner only when active activeOrder status changes or loads
    useEffect(() => {
        if (activeOrder) {
            setShowBanner(true);
            const timer = setTimeout(() => {
                setShowBanner(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [activeOrder?.status]); // Depend on status change

    const fetchActiveOrder = async () => {
        try {
            const res = await orderAPI.getMyOrders();
            const orders = res.data.data;
            const active = orders.find(o => ['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY'].includes(o.status));
            if (active) setActiveOrder(active);
        } catch (err) {
            // silent fail
        }
    };

    const fetchNotifications = async () => {
        try {
            const res = await userAPI.getNotifications();
            if (res.success) {
                setUnreadCount(res.unreadCount);
                setNotifications(res.data);
            }
        } catch (err) {
            console.error('Failed to fetch notifications');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        if (!showNotifications && unreadCount > 0) {
            // Optional: Mark as read immediately or when closing
            // userAPI.markNotificationsRead().then(() => setUnreadCount(0));
        }
    };

    return (
        <>
            {activeOrder && showBanner && (
                <div className="order-banner" onClick={() => navigate(`/tracking/${activeOrder._id}`)}>
                    <div className="banner-content">
                        <Truck size={16} className="moving-truck" />
                        <span>Order #{activeOrder._id.slice(-4)} is <b>{activeOrder.status.replace(/_/g, ' ')}</b></span>
                        <span className="banner-link">Track Now &rarr;</span>
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowBanner(false); }}
                            style={{ background: 'none', border: 'none', color: 'white', marginLeft: '1rem', cursor: 'pointer' }}
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
            <nav className="navbar">
                <div className="navbar-container">
                    <Link to="/" className="navbar-logo">
                        <span role="img" aria-label="logo">🥘</span> NammaFoodie
                    </Link>

                    <div className="navbar-menu">
                        <Link to="/" className="navbar-link">
                            <Home size={18} /> Home
                        </Link>
                        <Link to="/restaurants" className="navbar-link">
                            <Utensils size={18} /> Restaurants
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link to="/orders" className="navbar-link">
                                    <ShoppingBag size={18} /> My Orders
                                </Link>

                                <div className="navbar-notifications" style={{ position: 'relative' }}>
                                    <div onClick={toggleNotifications} style={{ cursor: 'pointer', display: 'flex' }}>
                                        <Bell size={20} />
                                        {unreadCount > 0 && (
                                            <span className="notification-badge">{unreadCount}</span>
                                        )}
                                    </div>

                                    {/* Notifications Dropdown */}
                                    {showNotifications && (
                                        <div className="notifications-dropdown">
                                            <div className="dropdown-header">
                                                <h4>Notifications</h4>
                                                <button onClick={() => setShowNotifications(false)}>&times;</button>
                                            </div>
                                            <div className="dropdown-list">
                                                {notifications.length === 0 ? (
                                                    <p className="no-notifs">No notifications</p>
                                                ) : (
                                                    notifications.map((notif, idx) => (
                                                        <div key={idx} className={`notif-item ${notif.isRead ? 'read' : 'unread'}`}>
                                                            <div className="notif-icon">🔔</div>
                                                            <div className="notif-content">
                                                                <p className="notif-title">{notif.title}</p>
                                                                <p className="notif-msg">{notif.message}</p>
                                                                <span className="notif-time">{new Date(notif.createdAt).toLocaleTimeString()}</span>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <Link to="/cart" className="navbar-link cart-link">
                                    <ShoppingCart size={20} />
                                    {getItemCount() > 0 && (
                                        <span className="cart-badge">{getItemCount()}</span>
                                    )}
                                </Link>
                                <div className="navbar-user">
                                    <span className="user-name">
                                        <User size={18} /> {user?.name || 'User'}
                                    </span>
                                    <button onClick={handleLogout} className="btn-logout" title="Logout">
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn-primary">Login</Link>
                                <Link to="/register" className="btn-secondary">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
