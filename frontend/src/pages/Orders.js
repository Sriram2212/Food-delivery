import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import orderAPI from '../api/order.api';
import './Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await orderAPI.getMyOrders();
            setOrders(response.data.data.reverse()); // Newest first
        } catch (err) {
            console.error('Failed to fetch orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleTrack = (orderId) => {
        navigate(`/tracking/${orderId}`);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'DELIVERED': return '#48bb78';
            case 'CANCELLED': return '#f56565';
            case 'PREPARING': return '#ed8936';
            case 'OUT_FOR_DELIVERY': return '#667eea';
            default: return '#718096';
        }
    };

    if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

    return (
        <div className="orders-container">
            <div className="orders-header">
                <h1>My Orders</h1>
                <p>Track and manage your recent meal orders</p>
            </div>

            {orders.length === 0 ? (
                <div className="empty-orders">
                    <p>You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order._id} className="order-card">
                            <div className="order-main-info">
                                <div className="order-id-group">
                                    <span className="order-badge">Order ID: #{order._id.slice(-6)}</span>
                                    <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="order-status" style={{ background: getStatusColor(order.status) }}>
                                    {order.status}
                                </div>
                            </div>

                            <div className="order-items-summary">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="order-summary-item">
                                        <span>{item.quantity}x {item.name}</span>
                                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="order-footer">
                                <div className="order-total">
                                    <span>Total Paid</span>
                                    <h3>₹{order.totalAmount.toFixed(2)}</h3>
                                </div>
                                <button
                                    onClick={() => handleTrack(order._id)}
                                    className="btn-track"
                                >
                                    Track Order
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
