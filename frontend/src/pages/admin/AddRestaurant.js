import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import restaurantAPI from '../../api/restaurant.api';

const AddRestaurant = ({ onClose, onRestaurantAdded, restaurantToEdit = null }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        cuisine: '',
        deliveryTime: '',
        minimumOrder: '',
        deliveryFee: '',
        image: '',
        phone: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipCode: ''
    });

    useEffect(() => {
        if (restaurantToEdit) {
            setFormData({
                name: restaurantToEdit.name || '',
                description: restaurantToEdit.description || '',
                cuisine: restaurantToEdit.cuisine ? restaurantToEdit.cuisine.join(', ') : '',
                deliveryTime: restaurantToEdit.deliveryTime || '',
                minimumOrder: restaurantToEdit.minimumOrder || '',
                deliveryFee: restaurantToEdit.deliveryFee || '',
                image: restaurantToEdit.image || '',
                phone: restaurantToEdit.phone || '',
                email: restaurantToEdit.email || '',
                street: restaurantToEdit.address?.street || '',
                city: restaurantToEdit.address?.city || '',
                state: restaurantToEdit.address?.state || '',
                zipCode: restaurantToEdit.address?.zipCode || ''
            });
        }
    }, [restaurantToEdit]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                cuisine: formData.cuisine.split(',').map(c => c.trim()),
                address: {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode
                },
                ownerId: 'admin_created'
            };

            if (restaurantToEdit) {
                await restaurantAPI.update(restaurantToEdit._id, payload);
                toast.success('Restaurant Updated Successfully! 🎉');
            } else {
                await restaurantAPI.create(payload);
                toast.success('Restaurant Added Successfully! 🎉');
            }

            if (onRestaurantAdded) onRestaurantAdded();
            if (onClose) onClose();
        } catch (error) {
            console.error('Error saving restaurant:', error);
            toast.error('Failed to save restaurant');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{restaurantToEdit ? 'Edit Restaurant' : 'Add New Restaurant'}</h2>
                    <button onClick={onClose} className="close-btn">×</button>
                </div>
                <form onSubmit={handleSubmit} className="add-restaurant-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Name</label>
                            <input name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Cuisine (comma separated)</label>
                            <input name="cuisine" value={formData.cuisine} onChange={handleChange} placeholder="South Indian, Veg..." required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Delivery Time (min)</label>
                            <input type="number" name="deliveryTime" value={formData.deliveryTime} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Min Order (₹)</label>
                            <input type="number" name="minimumOrder" value={formData.minimumOrder} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Fee (₹)</label>
                            <input type="number" name="deliveryFee" value={formData.deliveryFee} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Image URL</label>
                        <input name="image" value={formData.image} onChange={handleChange} placeholder="https://..." />
                    </div>

                    <h3>Contact & Address</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Phone</label>
                            <input name="phone" value={formData.phone} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input name="email" type="email" value={formData.email} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Street</label>
                            <input name="street" value={formData.street} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>City</label>
                            <input name="city" value={formData.city} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary">{restaurantToEdit ? 'Update Restaurant' : 'Create Restaurant'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddRestaurant;
