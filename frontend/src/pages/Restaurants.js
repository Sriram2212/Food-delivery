import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import restaurantAPI from '../api/restaurant.api';
import './Restaurants.css';

const Restaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCuisine, setSelectedCuisine] = useState('');

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            const response = await restaurantAPI.getAll();
            setRestaurants(response.data.data.restaurants || []);
        } catch (err) {
            setError('Failed to load restaurants');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredRestaurants = restaurants.filter(restaurant => {
        const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCuisine = !selectedCuisine || restaurant.cuisine.includes(selectedCuisine);
        return matchesSearch && matchesCuisine;
    });

    const cuisines = ['italian', 'chinese', 'indian', 'mexican', 'american', 'japanese'];

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading delicious restaurants...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>{error}</p>
                <button onClick={fetchRestaurants} className="btn-retry">Retry</button>
            </div>
        );
    }

    return (
        <div className="restaurants-container">
            <div className="restaurants-header">
                <h1>Discover Restaurants</h1>
                <p>Find your favorite food from the best restaurants</p>
            </div>

            <div className="filters-section">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search restaurants..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="cuisine-filters">
                    <button
                        className={`cuisine-btn ${!selectedCuisine ? 'active' : ''}`}
                        onClick={() => setSelectedCuisine('')}
                    >
                        All
                    </button>
                    {cuisines.map(cuisine => (
                        <button
                            key={cuisine}
                            className={`cuisine-btn ${selectedCuisine === cuisine ? 'active' : ''}`}
                            onClick={() => setSelectedCuisine(cuisine)}
                        >
                            {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="restaurants-grid">
                {filteredRestaurants.length > 0 ? (
                    filteredRestaurants.map(restaurant => (
                        <Link
                            key={restaurant._id}
                            to={`/restaurant/${restaurant._id}`}
                            className="restaurant-card"
                        >
                            <div className="restaurant-image">
                                <img src={restaurant.image} alt={restaurant.name} />
                                <div className="restaurant-badge">
                                    ⭐ {restaurant.rating.toFixed(1)}
                                </div>
                            </div>
                            <div className="restaurant-info">
                                <h3>{restaurant.name}</h3>
                                <p className="restaurant-cuisine">
                                    {restaurant.cuisine.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')}
                                </p>
                                <p className="restaurant-description">{restaurant.description}</p>
                                <div className="restaurant-meta">
                                    <span>🕐 {restaurant.deliveryTime} min</span>
                                    <span>💵 ₹{restaurant.minimumOrder} min</span>
                                    <span>🚚 ₹{restaurant.deliveryFee}</span>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="no-results">
                        <p>No restaurants found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Restaurants;
