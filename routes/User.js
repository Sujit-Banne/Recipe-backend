const express = require('express');
const router = express.Router();
const UserSchema = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

// Register
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if the user already exists
        const existingUser = await UserSchema.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Creating user
        const result = await UserSchema.create({
            email,
            password: hashedPassword
        });

        // Token generation
        const token = jwt.sign({ email: result.email, id: result._id }, SECRET_KEY);
        res.status(200).json({
            message: 'User created successfully',
            user: result,
            token
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Something went wrong'
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if user is present in the database
        const existingUser = await UserSchema.findOne({ email });
        if (!existingUser) {
            return res.status(500).json({
                message: 'User not found'
            });
        }

        // Match the password
        const matchPassword = await bcrypt.compare(password, existingUser.password);
        if (!matchPassword) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }

        // Token generation
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, SECRET_KEY);
        res.status(200).json({
            message: 'User login successfully',
            email: existingUser.email,
            id: existingUser._id,
            token
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Something went wrong'
        });
    }
});

module.exports = router;
