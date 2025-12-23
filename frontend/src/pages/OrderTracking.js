import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import deliveryAPI from '../api/delivery.api';
import orderAPI from '../api/order.api';
import { ArrowLeft, Package, Clock, MapPin, Bike, CheckCircle } from 'lucide-react';
import './OrderTracking.css';

const OrderTracking = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [delivery, setDelivery] = useState(null);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchTrackingInfo = async () => {
        try {
            // Fetch Order Details first (Critical)
            const orderRes = await orderAPI.getById(orderId);
            setOrder(orderRes.data.data);

            // Try to fetch Delivery Details (Optional/Parallel)
            try {
                const deliveryRes = await deliveryAPI.getStatus(orderId);
                setDelivery(deliveryRes.data.data);
            } catch (delErr) {
                console.warn('Delivery info not available yet:', delErr);
                // Don't set global error, just leave delivery as null
                // The UI handles null delivery by falling back to order status
            }

            setError('');
        } catch (err) {
            console.error('Tracking Error (Order fetch failed):', err);
            setError('Failed to load order details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrackingInfo();
        const interval = setInterval(fetchTrackingInfo, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [orderId]);

    const getStatusStep = (status) => {
        const statuses = ['CREATED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];
        return statuses.indexOf(status);
    };

    const currentStep = delivery ? getStatusStep(delivery.status) : (order ? getStatusStep(order.status) : 0);

    const steps = [
        { label: 'Order Placed', icon: Package },
        { label: 'Confirmed', icon: CheckCircle },
        { label: 'Preparing', icon: Clock },
        { label: 'Out for Delivery', icon: Bike },
        { label: 'Delivered', icon: MapPin }
    ];

    if (loading) return <div className="tracking-wrapper"><div className="loader">Loading Tracking...</div></div>;

    if (error) return (
        <div className="tracking-wrapper">
            <div className="error-card">
                <h3>⚠️ {error}</h3>
                <button onClick={() => navigate(-1)} className="btn-back">Go Back</button>
            </div>
        </div>
    );

    return (
        <div className="tracking-wrapper">
            <div className="tracking-container">
                <button onClick={() => navigate(-1)} className="btn-back-nav">
                    <ArrowLeft size={20} /> Back to Orders
                </button>

                <div className="tracking-header">
                    <h1>Track Order #{orderId.slice(-6)}</h1>
                    <span className={`status-pill ${(delivery?.status || order?.status || '').toLowerCase()}`}>
                        {(delivery?.status || order?.status || 'UNKNOWN').replace(/_/g, ' ')}
                    </span>
                </div>

                <div className="tracking-timeline">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isCompleted = index <= currentStep;
                        const isCurrent = index === currentStep;

                        return (
                            <div key={index} className={`timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                                <div className="step-icon">
                                    <Icon size={20} />
                                </div>
                                <span className="step-label">{step.label}</span>
                                {index < steps.length - 1 && <div className="step-line"></div>}
                            </div>
                        );
                    })}
                </div>

                <div className="tracking-details-grid">
                    <div className="details-card">
                        <h3>Delivery Partner</h3>
                        <div className="driver-info" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div className="driver-avatar" style={{ width: 40, height: 40, background: '#cbd5e1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                🛵
                            </div>
                            <div>
                                <h4 style={{ margin: 0, color: '#f8fafc' }}>{delivery?.partnerId ? `Ramesh Kumar` : 'Assigning...'}</h4>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
                                    {delivery?.partnerId ? 'Hero Splendor • KA-05-1234' : 'Looking for nearby partner'}
                                </p>
                                {delivery?.partnerId && <span style={{ fontSize: '0.8rem', color: '#f59e0b' }}>★ 4.8 Rating</span>}
                            </div>
                        </div>

                        <div className="action-buttons" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <button className="btn-action" style={{ padding: '0.6rem', border: '1px solid #475569', borderRadius: '8px', background: 'transparent', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                📞 Call
                            </button>
                            <button className="btn-action" style={{ padding: '0.6rem', border: '1px solid #475569', borderRadius: '8px', background: 'transparent', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                💬 Chat
                            </button>
                        </div>

                        <div className="info-divider" style={{ height: '1px', background: '#334155', margin: '1rem 0' }}></div>

                        <div className="info-row">
                            <span className="label">Estimated Arrival</span>
                            <span className="value" style={{ color: '#f59e0b', fontWeight: 'bold' }}>18 Mins</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Delivery Address</span>
                            <span className="value">{order?.deliveryAddress?.street}, {order?.deliveryAddress?.city}</span>
                        </div>
                    </div>

                    <div className="details-card map-placeholder">
                        <div className="map-view" style={{ padding: 0, overflow: 'hidden', height: '300px' }}>
                            <iframe
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                scrolling="no"
                                marginHeight="0"
                                marginWidth="0"
                                src="https://www.openstreetmap.org/export/embed.html?bbox=77.58,12.95,77.62,13.00&amp;layer=mapnik&amp;marker=12.97,77.60"
                                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                                title="Order Location"
                            ></iframe>
                        </div><small>(Demo Mode)</small>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default OrderTracking;
