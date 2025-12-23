import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartByRestaurant, setCartByRestaurant] = useState({});

    // Use a user-specific key for the cart
    const getCartKey = () => user ? `cart_${user.id || user._id}` : 'guest_cart';

    useEffect(() => {
        const getCartKey = () => user ? `cart_${user.id || user._id}` : 'guest_cart';

        try {
            const cartKey = getCartKey();
            const savedCart = localStorage.getItem(cartKey);
            if (savedCart) {
                const parsedCart = JSON.parse(savedCart);
                if (typeof parsedCart === 'object' && parsedCart !== null) {
                    setCartByRestaurant(parsedCart);
                } else {
                    localStorage.removeItem(cartKey);
                    setCartByRestaurant({});
                }
            } else {
                setCartByRestaurant({});
            }
        } catch (error) {
            console.error('Error loading cart from storage:', error);
            setCartByRestaurant({});
        }
    }, [user]);

    const saveCart = (cart) => {
        const cartKey = user ? `cart_${user.id || user._id}` : 'guest_cart';
        localStorage.setItem(cartKey, JSON.stringify(cart));
    };

    const addToCart = (item, restaurantData) => {
        const restaurantId = restaurantData._id;

        // Get current restaurant cart or create new one
        const restaurantCart = cartByRestaurant[restaurantId] || {
            restaurant: restaurantData,
            items: []
        };

        // Check if item already exists in this restaurant's cart
        const existingItemIndex = restaurantCart.items.findIndex(
            cartItem => cartItem._id === item._id
        );

        let updatedItems;
        if (existingItemIndex !== -1) {
            // Update quantity of existing item
            updatedItems = restaurantCart.items.map((cartItem, index) =>
                index === existingItemIndex
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
            );
            toast.success(`${item.name} quantity updated! 🛒`, {
                duration: 2000,
                icon: '➕'
            });
        } else {
            // Add new item
            updatedItems = [...restaurantCart.items, { ...item, quantity: 1 }];
            toast.success(`${item.name} added to cart! 🛒`, {
                duration: 2000,
                icon: '✅'
            });
        }

        // Update the cart
        const newCart = {
            ...cartByRestaurant,
            [restaurantId]: {
                restaurant: restaurantData,
                items: updatedItems
            }
        };

        setCartByRestaurant(newCart);
        saveCart(newCart);
    };

    const removeFromCart = (restaurantId, itemId) => {
        const restaurantCart = cartByRestaurant[restaurantId];
        if (!restaurantCart) return;

        const newItems = restaurantCart.items.filter(item => item._id !== itemId);

        if (newItems.length === 0) {
            // Remove entire restaurant from cart
            const newCart = { ...cartByRestaurant };
            delete newCart[restaurantId];
            setCartByRestaurant(newCart);
            saveCart(newCart);
            toast.success('Item removed from cart! 🗑️', {
                duration: 2000,
                icon: '✅'
            });
        } else {
            // Update restaurant cart
            const newCart = {
                ...cartByRestaurant,
                [restaurantId]: {
                    ...restaurantCart,
                    items: newItems
                }
            };
            setCartByRestaurant(newCart);
            saveCart(newCart);
            toast.success('Item removed from cart! 🗑️', {
                duration: 2000,
                icon: '✅'
            });
        }
    };

    const updateQuantity = (restaurantId, itemId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(restaurantId, itemId);
            return;
        }

        const restaurantCart = cartByRestaurant[restaurantId];
        if (!restaurantCart) return;

        const newItems = restaurantCart.items.map(item =>
            item._id === itemId ? { ...item, quantity } : item
        );

        const newCart = {
            ...cartByRestaurant,
            [restaurantId]: {
                ...restaurantCart,
                items: newItems
            }
        };

        setCartByRestaurant(newCart);
        saveCart(newCart);
    };

    const clearCart = () => {
        setCartByRestaurant({});
        localStorage.removeItem('multiRestaurantCart');
        toast.success('Cart cleared! 🧹', {
            duration: 2000,
            icon: '✅'
        });
    };

    const clearRestaurantCart = (restaurantId) => {
        const newCart = { ...cartByRestaurant };
        delete newCart[restaurantId];
        setCartByRestaurant(newCart);
        saveCart(newCart);
        toast.success('Restaurant cart cleared! 🧹', {
            duration: 2000,
            icon: '✅'
        });
    };

    const getRestaurantTotal = (restaurantId) => {
        const restaurantCart = cartByRestaurant[restaurantId];
        if (!restaurantCart) return 0;
        return restaurantCart.items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    };

    const getTotal = () => {
        return Object.keys(cartByRestaurant).reduce((total, restaurantId) => {
            return total + getRestaurantTotal(restaurantId);
        }, 0);
    };

    const getItemCount = () => {
        return Object.keys(cartByRestaurant).reduce((count, restaurantId) => {
            const restaurantCart = cartByRestaurant[restaurantId];
            return count + restaurantCart.items.reduce((sum, item) => sum + item.quantity, 0);
        }, 0);
    };

    const getRestaurantCount = () => {
        return Object.keys(cartByRestaurant).length;
    };

    const value = {
        cartByRestaurant,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        clearRestaurantCart,
        getTotal,
        getRestaurantTotal,
        getItemCount,
        getRestaurantCount,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export default CartContext;
