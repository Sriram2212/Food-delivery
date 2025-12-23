import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Authentic
                        <br />
                        <span className="gradient-text">South Indian Flavors</span>
                    </h1>
                    <p className="hero-subtitle">
                        From crispy Dosas to spicy Chettinad curries. Experience the true taste of the South delivered to your doorstep.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/restaurants" className="btn-hero-primary">
                            Order Food 🥘
                        </Link>
                        <Link to="/register" className="btn-hero-secondary">
                            Join Now
                        </Link>
                    </div>
                </div>
                <div className="hero-image" style={{ background: 'none', border: 'none', height: 'auto', display: 'block' }}>
                    <img
                        src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=1200&q=80"
                        alt="Grand South Indian Feast"
                        style={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: '500px',
                            objectFit: 'cover',
                            borderRadius: '24px',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            transform: 'rotate(2deg)',
                            border: '4px solid rgba(255,255,255,0.1)'
                        }}
                    />
                </div>
            </section>

            <section className="features-section">
                <h2 className="section-title">Namma Special Features</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">⚡</div>
                        <h3>Lightning Fast</h3>
                        <p>Hot Idlis delivered in <span style={{ color: '#f59e0b' }}>30 mins</span></p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">💎</div>
                        <h3>Premium Packs</h3>
                        <p>Combos for couples & families</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🎟️</div>
                        <h3>Daily Offers</h3>
                        <p>Discounts on Breakfast & Thalis</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🗺️</div>
                        <h3>Live Tracking</h3>
                        <p>Track your delivery partner</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
