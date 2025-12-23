const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/env');

const generateToken = (id) => {
    return jwt.sign({ id }, config.JWT_SECRET, {
        expiresIn: '30d',
    });
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, phoneNumber } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            phoneNumber
        });

        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            }
        });
    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (user && (await user.comparePassword(password))) {
            res.json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    token: generateToken(user._id)
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (user) {
            res.json({ success: true, data: user });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('Profile Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json({ success: true, data: users });
    } catch (error) {
        console.error('Get All Users Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
