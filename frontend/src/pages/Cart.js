import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Store, Clock, MapPin } from 'lucide-react';
import orderAPI from '../api/order.api';
import './Cart.css';

const Cart = () => {
    const {
        cartByRestaurant,
        updateQuantity,
        removeFromCart,
        getTotal,
        getRestaurantTotal,
        clearCart,
        clearRestaurantCart,
        getItemCount,
        getRestaurantCount
    } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [checkoutDetails, setCheckoutDetails] = useState({
        address: user?.address?.street || '123 Main St, Tech City',
        phoneNumber: user?.phoneNumber || user?.phone || '',
    });
    const [showMap, setShowMap] = useState(false);

    const handleCheckout = async () => {
        const restaurantIds = Object.keys(cartByRestaurant);
        if (restaurantIds.length === 0) return;

        if (!checkoutDetails.address || !checkoutDetails.phoneNumber) {
            toast.error('Please enter delivery address and phone number');
            return;
        }

        setLoading(true);
        try {
            const orderPromises = restaurantIds.map(async (restaurantId) => {
                const restaurantCart = cartByRestaurant[restaurantId];
                const orderData = {
                    userId: user.id || user._id,
                    restaurantId: restaurantId,
                    items: restaurantCart.items.map(item => ({
                        menuItemId: item._id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity
                    })),
                    totalAmount: getRestaurantTotal(restaurantId),
                    deliveryAddress: {
                        street: checkoutDetails.address,
                        city: 'Tech City', // Simplified for demo
                        state: 'TC',
                        zipCode: '12345'
                    },
                    contactNumber: checkoutDetails.phoneNumber
                };
                return orderAPI.create(orderData);
            });

            await Promise.all(orderPromises);

            toast.success(
                `${restaurantIds.length} order${restaurantIds.length > 1 ? 's' : ''} placed successfully! 🎉`,
                { duration: 3000 }
            );

            clearCart();
            setTimeout(() => navigate('/orders'), 2000);
        } catch (err) {
            console.error('Checkout failed:', err);
            toast.error(err.response?.data?.message || 'Checkout failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const restaurantIds = Object.keys(cartByRestaurant);

    if (restaurantIds.length === 0) {
        return (
            <div className="cart-empty">
                <div className="empty-state">
                    <ShoppingBag size={80} strokeWidth={1.5} />
                    <h2>Your Cart is Empty</h2>
                    <p>Add some delicious items to get started!</p>
                    <Link to="/restaurants" className="btn-browse">
                        Browse Restaurants
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            {/* Map Modal */}
            {showMap && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex',
                    alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="modal-content" style={{
                        background: '#1e293b', padding: '1.5rem', borderRadius: '12px',
                        width: '90%', maxWidth: '600px', position: 'relative'
                    }}>
                        <h3 style={{ margin: '0 0 1rem 0', color: 'white' }}>Choose Location</h3>
                        <div style={{ height: '300px', background: '#000', marginBottom: '1rem', borderRadius: '8px', overflow: 'hidden' }}>
                            <iframe
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                scrolling="no"
                                marginHeight="0"
                                marginWidth="0"
                                src="https://www.openstreetmap.org/export/embed.html?bbox=77.58,12.95,77.62,13.00&amp;layer=mapnik&amp;marker=12.97,77.60"
                                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                                title="Pick Location"
                            ></iframe>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowMap(false)}
                                style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #475569', background: 'transparent', color: 'white', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setCheckoutDetails({ ...checkoutDetails, address: '123 Map Picked St, Bangalore' });
                                    setShowMap(false);
                                    toast.success('Location updated from Map!');
                                }}
                                style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', background: '#f59e0b', color: 'black', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                Confirm Location
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="cart-container">
                {/* ... (cart-items-section) */}
                <div className="cart-items-section">
                    <div className="cart-header-main">
                        <div>
                            <h1>Shopping Cart</h1>
                            <p className="cart-subtitle">
                                {getRestaurantCount()} Restaurant{getRestaurantCount() > 1 ? 's' : ''} • {getItemCount()} Item{getItemCount() > 1 ? 's' : ''}
                            </p>
                        </div>
                        <button onClick={clearCart} className="btn-clear-all">
                            <Trash2 size={18} />
                            Clear All
                        </button>
                    </div>

                    {restaurantIds.map((restaurantId) => {
                        const restaurantCart = cartByRestaurant[restaurantId];
                        const restaurant = restaurantCart.restaurant;

                        return (
                            <div key={restaurantId} className="restaurant-cart-card">
                                <div className="restaurant-cart-header">
                                    <div className="restaurant-info-cart">
                                        <Store size={20} />
                                        <div>
                                            <h3>{restaurant.name}</h3>
                                            <p className="restaurant-meta">
                                                <Clock size={14} />
                                                {restaurant.deliveryTime} mins • ₹{restaurant.deliveryFee} delivery
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => clearRestaurantCart(restaurantId)}
                                        className="btn-clear-restaurant"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="cart-items-list">
                                    {restaurantCart.items.map((item) => (
                                        <div key={item._id} className="cart-item-card">
                                            <div className="item-details">
                                                <h4>{item.name}</h4>
                                                <p className="item-price">₹{item.price}</p>
                                            </div>

                                            <div className="item-actions">
                                                <div className="quantity-control">
                                                    <button
                                                        onClick={() => updateQuantity(restaurantId, item._id, item.quantity - 1)}
                                                        className="qty-btn"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="qty-display">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(restaurantId, item._id, item.quantity + 1)}
                                                        className="qty-btn"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>

                                                <div className="item-total">
                                                    ₹{item.price * item.quantity}
                                                </div>

                                                <button
                                                    onClick={() => removeFromCart(restaurantId, item._id)}
                                                    className="btn-remove"
                                                    title="Remove item"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="restaurant-subtotal">
                                    <span>Subtotal ({restaurantCart.items.length} items)</span>
                                    <span className="subtotal-amount">₹{getRestaurantTotal(restaurantId)}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Order Summary Sidebar */}
                <div className="order-summary-sidebar">
                    <div className="summary-card">
                        <h2>Delivery Details</h2>
                        <div className="checkout-inputs" style={{ marginBottom: '1.5rem' }}>
                            <div className="input-group" style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <label style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Delivery Address</label>
                                    <button
                                        onClick={() => setShowMap(true)}
                                        style={{ background: 'none', border: 'none', color: '#f59e0b', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                                    >
                                        <MapPin size={12} /> Pick on Map
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={checkoutDetails.address}
                                    onChange={(e) => setCheckoutDetails({ ...checkoutDetails, address: e.target.value })}
                                    placeholder="House No, Street, City"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#334155', border: '1px solid #475569', color: 'white' }}
                                />
                            </div>
                            <div className="input-group">
                                <label style={{ display: 'block', fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Phone Number</label>
                                <input
                                    type="tel"
                                    value={checkoutDetails.phoneNumber}
                                    onChange={(e) => setCheckoutDetails({ ...checkoutDetails, phoneNumber: e.target.value })}
                                    placeholder="Enter 10-digit number"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#334155', border: '1px solid #475569', color: 'white' }}
                                />
                            </div>
                        </div>

                        <h2>Order Summary</h2>
                        <div className="summary-details">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>₹{getTotal()}</span>
                            </div>
                            <div className="summary-row">
                                <span>Delivery Fee</span>
                                <span>₹{restaurantIds.reduce((total, id) =>
                                    total + (cartByRestaurant[id].restaurant.deliveryFee || 0), 0
                                )}</span>
                            </div>
                            <div className="summary-row">
                                <span>Taxes & Fees</span>
                                <span>₹{Math.round(getTotal() * 0.05)}</span>
                            </div>
                            <div className="summary-divider"></div>
                            <div className="summary-row summary-total">
                                <span>Total</span>
                                <span>₹{getTotal() + restaurantIds.reduce((total, id) =>
                                    total + (cartByRestaurant[id].restaurant.deliveryFee || 0), 0
                                ) + Math.round(getTotal() * 0.05)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={loading}
                            className="btn-checkout"
                        >
                            {loading ? (
                                <span>Processing...</span>
                            ) : (
                                <>
                                    <span>Place Order</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
