import React, { useState } from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import { toast } from 'react-hot-toast';

const RestaurantReviews = ({ restaurantId }) => {
    // Mock reviews (Real implementation would fetch from API)
    const [reviews, setReviews] = useState([
        { id: 1, user: 'Arjun K.', rating: 5, date: '2 days ago', text: 'Absolutely amazing taste! The biryani was authentic.', likes: 12 },
        { id: 2, user: 'Priya S.', rating: 4, date: '1 week ago', text: 'Good food, but delivery was slightly delayed. Packaging was great.', likes: 5 },
        { id: 3, user: 'Karthik M.', rating: 5, date: '3 weeks ago', text: 'Best Appam and Stew in town! Highly recommended.', likes: 8 },
    ]);
    const [newReview, setNewReview] = useState('');
    const [rating, setRating] = useState(5);

    const handleSubmit = (e) => {
        e.preventDefault();
        const review = {
            id: Date.now(),
            user: 'You',
            rating,
            date: 'Just now',
            text: newReview,
            likes: 0
        };
        setReviews([review, ...reviews]);
        setNewReview('');
        toast.success('Review posted successfully! ⭐');
    };

    return (
        <div className="reviews-section">
            <h3 className="section-title">
                <Star size={24} fill="#f59e0b" color="#f59e0b" /> Reviews & Ratings
            </h3>

            <div className="review-form-card">
                <h4>Write a Review</h4>
                <div className="rating-select">
                    {[1, 2, 3, 4, 5].map(star => (
                        <Star
                            key={star}
                            size={24}
                            fill={star <= rating ? "#f59e0b" : "transparent"}
                            color={star <= rating ? "#f59e0b" : "#475569"}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setRating(star)}
                        />
                    ))}
                </div>
                <textarea
                    placeholder="Share your experience..."
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                />
                <button onClick={handleSubmit} className="btn-primary" disabled={!newReview.trim()}>
                    Post Review
                </button>
            </div>

            <div className="reviews-list">
                {reviews.map(review => (
                    <div key={review.id} className="review-card">
                        <div className="review-header">
                            <div className="reviewer-info">
                                <div className="reviewer-avatar">{review.user[0]}</div>
                                <div>
                                    <h5>{review.user}</h5>
                                    <span className="review-date">{review.date}</span>
                                </div>
                            </div>
                            <div className="review-rating">
                                {review.rating} <Star size={12} fill="white" color="white" />
                            </div>
                        </div>
                        <p className="review-text">{review.text}</p>
                        <div className="review-footer">
                            <button className="like-btn">
                                <ThumbsUp size={14} /> {review.likes} Helpful
                            </button>
                            {/* <button className="reply-btn">Reply</button> */}
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .reviews-section { margin-top: 4rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.05); }
                .section-title { display: flex; align-items: center; gap: 0.5rem; font-size: 1.8rem; margin-bottom: 2rem; }
                
                .review-form-card {
                    background: #1e293b; padding: 1.5rem; border-radius: 16px; margin-bottom: 2rem;
                    border: 1px solid rgba(255,255,255,0.05);
                }
                .rating-select { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
                .review-form-card textarea {
                    width: 100%; background: #0f172a; border: 1px solid rgba(255,255,255,0.1);
                    color: white; padding: 1rem; border-radius: 8px; min-height: 100px;
                    margin-bottom: 1rem;
                }
                
                .reviews-list { display: flex; flex-direction: column; gap: 1.5rem; }
                .review-card {
                    background: #1e293b; padding: 1.5rem; border-radius: 16px;
                    border: 1px solid rgba(255,255,255,0.05);
                }
                .review-header { display: flex; justify-content: space-between; margin-bottom: 1rem; }
                .reviewer-info { display: flex; gap: 1rem; align-items: center; }
                .reviewer-avatar {
                    width: 40px; height: 40px; background: #334155; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center; font-weight: bold;
                    color: #f59e0b;
                }
                .reviewer-info h5 { font-size: 1rem; margin-bottom: 0.2rem; }
                .review-date { font-size: 0.8rem; color: #94a3b8; }
                
                .review-rating {
                    background: #10b981; color: white; padding: 0.2rem 0.6rem; border-radius: 6px;
                    font-size: 0.85rem; font-weight: bold; display: flex; align-items: center; gap: 4px;
                    height: fit-content;
                }
                .review-text { color: #cbd5e1; line-height: 1.5; margin-bottom: 1rem; }
                .review-footer { display: flex; gap: 1rem; }
                .like-btn {
                    background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #94a3b8;
                    padding: 0.4rem 0.8rem; border-radius: 6px; font-size: 0.8rem; cursor: pointer;
                    display: flex; align-items: center; gap: 0.5rem;
                }
                .like-btn:hover { border-color: #f59e0b; color: #f59e0b; }
            `}</style>
        </div>
    );
};

export default RestaurantReviews;
