import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminAPI from '../../api/admin.api';
import orderAPI from '../../api/order.api';
import { toast } from 'react-hot-toast';
import AddRestaurant from './AddRestaurant';
import { useAuth } from '../../context/AuthContext';
import AdminCharts from './AdminCharts';
import './Admin.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        activeRestaurants: 0,
        totalUsers: 0
    });
    const [restaurants, setRestaurants] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [restaurantToEdit, setRestaurantToEdit] = useState(null);

    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        localStorage.removeItem('adminAuth'); // Clear admin flag
        navigate('/login');
    };

    const handleAddClick = () => {
        setRestaurantToEdit(null);
        setShowAddModal(true);
    };

    const handleEditClick = (restaurant) => {
        setRestaurantToEdit(restaurant);
        setShowAddModal(true);
    };

    const handleRestaurantSaved = () => {
        fetchData();
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await orderAPI.updateStatus(orderId, newStatus);
            toast.success(`Order status updated to ${newStatus}`);
            fetchData(); // Refresh data
        } catch (error) {
            console.error('Update status failed:', error);
            toast.error('Failed to update status by Admin');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [resRest, resOrders, resUsers] = await Promise.all([
                adminAPI.getRestaurants(),
                adminAPI.getOrders(),
                adminAPI.getUsers()
            ]);

            const restaurantsList = resRest.data?.data?.restaurants || resRest.data?.data || [];
            const ordersList = resOrders.data?.data?.orders || resOrders.data?.data || [];
            const usersList = resUsers.data?.data || [];

            setRestaurants(restaurantsList);
            setOrders(ordersList);
            setUsers(usersList);

            const revenue = ordersList.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

            setStats({
                totalOrders: ordersList.length,
                totalRevenue: revenue,
                activeRestaurants: restaurantsList.length,
                totalUsers: usersList.length
            });

        } catch (err) {
            console.error('Admin Fetch Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const renderDashboard = () => (
        <>
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-value">{stats.totalOrders}</div>
                    <div className="stat-label">Total Orders</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-value">₹{stats.totalRevenue.toLocaleString()}</div>
                    <div className="stat-label">Total Revenue</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🥘</div>
                    <div className="stat-value">{stats.activeRestaurants}</div>
                    <div className="stat-label">Active Restaurants</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-value">{stats.totalUsers}</div>
                    <div className="stat-label">Registered Users</div>
                </div>
            </div>

            <div className="admin-header">
                <h2>Analytics & Overview</h2>
            </div>

            <AdminCharts />

            <div className="admin-header">
                <h2>Recent Activity</h2>
            </div>
            <div className="dashboard-info">
                <p>Welcome to the Admin Dashboard. Here you can manage restaurants, view customer orders, and monitor user growth.</p>
            </div>
        </>
    );

    const renderRestaurants = () => (
        <div className="data-table-container">
            <div className="admin-header">
                <h2>Partner Restaurants</h2>
                <button className="add-btn" onClick={handleAddClick}>+ Add New</button>
            </div>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Cuisine</th>
                        <th>City</th>
                        <th>Rating</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {restaurants.map(r => (
                        <tr key={r._id}>
                            <td>{r.name}</td>
                            <td>{r.cuisine?.join(', ')}</td>
                            <td>{r.address?.city}</td>
                            <td>⭐ {r.rating}</td>
                            <td><button className="action-btn" onClick={() => handleEditClick(r)}>Edit</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderOrders = () => (
        <div className="data-table-container">
            <div className="admin-header">
                <h2>Customer Orders</h2>
            </div>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(o => (
                        <tr key={o._id}>
                            <td>
                                {o._id.substring(0, 8)}...
                                <button className="action-btn" onClick={() => navigate(`/tracking/${o._id}`)} style={{ marginLeft: '10px', fontSize: '0.8rem' }}>Track</button>
                            </td>
                            <td className="amount">₹{o.totalAmount}</td>
                            <td>
                                <select
                                    className={`status-select ${o.status?.toLowerCase()}`}
                                    value={o.status}
                                    onChange={(e) => handleStatusChange(o._id, e.target.value)}
                                >
                                    <option value="CREATED">Created</option>
                                    <option value="CONFIRMED">Confirmed</option>
                                    <option value="PREPARING">Preparing</option>
                                    <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                                    <option value="DELIVERED">Delivered</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </select>
                            </td>
                            <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderUsers = () => (
        <div className="data-table-container">
            <div className="admin-header">
                <h2>Registered Users</h2>
            </div>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Joined Date</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u._id}>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="admin-container">
            <div className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <h2>🍔 Foodie<span className="text-highlight">Admin</span></h2>
                </div>
                <div className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                    <span>📊</span> Dashboard
                </div>
                <div className={`admin-nav-item ${activeTab === 'restaurants' ? 'active' : ''}`} onClick={() => setActiveTab('restaurants')}>
                    <span>🍽️</span> Restaurants
                </div>
                <div className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                    <span>📦</span> Orders
                </div>
                <div className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                    <span>👥</span> Users
                </div>

                <div className="admin-nav-item logout-btn" onClick={handleLogout} style={{ marginTop: 'auto', color: '#ef4444' }}>
                    <span>🚪</span> Logout
                </div>
            </div>

            <div className="admin-content">
                <div className="admin-topbar">
                    <h1>Overview</h1>
                    <div className="admin-profile">
                        <span>Admin</span>
                        <div className="avatar">A</div>
                    </div>
                </div>

                {loading ? <div className="loader">Loading dynamic data...</div> : (
                    <>
                        {activeTab === 'dashboard' && renderDashboard()}
                        {activeTab === 'restaurants' && renderRestaurants()}
                        {activeTab === 'orders' && renderOrders()}
                        {activeTab === 'users' && renderUsers()}
                    </>
                )}
            </div>
            {showAddModal && <AddRestaurant onClose={() => setShowAddModal(false)} onRestaurantAdded={handleRestaurantSaved} restaurantToEdit={restaurantToEdit} />}
        </div>
    );
};

export default AdminDashboard;
