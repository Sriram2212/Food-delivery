import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import restaurantAPI from '../api/restaurant.api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import RestaurantReviews from '../components/RestaurantReviews';
import './Menu.css';

const Menu = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const response = await restaurantAPI.getById(id);
                setRestaurant(response.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurant();
    }, [id]);

    const handleAddToCart = (item) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        addToCart(item, restaurant);
    };

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    if (!restaurant) {
        return <div className="error-container">Restaurant not found</div>;
    }

    return (
        <div className="menu-container">
            <div className="restaurant-header-banner">
                <img src={restaurant.image} alt={restaurant.name} />
                <div className="restaurant-header-overlay">
                    <h1>{restaurant.name}</h1>
                    <p>{restaurant.description}</p>
                    <div className="restaurant-stats">
                        <span>⭐ {restaurant.rating}</span>
                        <span>🕐 {restaurant.deliveryTime} min</span>
                        <span>💵 Min ₹{restaurant.minimumOrder}</span>
                    </div>
                </div>
            </div>

            <div className="menu-content">
                <h2>Menu</h2>
                <div className="menu-grid">
                    {restaurant.menu && restaurant.menu.length > 0 ? (
                        restaurant.menu.map(item => (
                            <div key={item._id} className="menu-item-card">
                                <div className="menu-item-info">
                                    <h3>{item.name}</h3>
                                    <p className="menu-item-description">{item.description}</p>
                                    <div className="menu-item-meta">
                                        <span className="menu-item-category">{item.category}</span>
                                        <span className="menu-item-time">⏱️ {item.preparationTime} min</span>
                                    </div>
                                    <div className="menu-item-footer">
                                        <span className="menu-item-price">₹{item.price.toFixed(2)}</span>
                                        <button
                                            onClick={() => handleAddToCart(item)}
                                            className="btn-add-to-cart"
                                            disabled={!item.isAvailable}
                                        >
                                            {item.isAvailable ? '+ Add' : 'Unavailable'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No menu items available</p>
                    )}
                </div>
            </div>

            <RestaurantReviews restaurantId={id} />
        </div>
    );
};

export default Menu;
