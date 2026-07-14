const User = require('../models/User');
const jwt = require('jsonwebtoken');

const cityCoords = {
    'bilaspur': { lat: 22.0797, lng: 82.1391 },
    'raipur': { lat: 21.2514, lng: 81.6296 },
    'bhilai': { lat: 21.1938, lng: 81.3509 },
    'durg': { lat: 21.1904, lng: 81.2849 },
    'delhi': { lat: 28.6139, lng: 77.2090 },
    'mumbai': { lat: 19.0760, lng: 72.8777 },
    'bangalore': { lat: 12.9716, lng: 77.5946 },
    'hyderabad': { lat: 17.3850, lng: 78.4867 },
    'pune': { lat: 18.5204, lng: 73.8567 },
    'kolkata': { lat: 22.5726, lng: 88.3639 },
    'chennai': { lat: 13.0827, lng: 80.2707 }
};


// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
    try {
        const { name, email, password, role, bloodType, city, phone } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        let userLocation = undefined;
        if (city) {
            const cleanCity = city.trim().toLowerCase();
            if (cityCoords[cleanCity]) {
                userLocation = cityCoords[cleanCity];
            } else {
                userLocation = {
                    lat: 22.0797 + (Math.random() - 0.5) * 0.05,
                    lng: 82.1391 + (Math.random() - 0.5) * 0.05
                };
            }
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            bloodType,
            city,
            phone,
            location: userLocation
        });

        if (user) {
            const token = generateToken(user._id);

            // Set cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
            });

            res.status(201).json({
                success: true,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            const token = generateToken(user._id);

            // Set cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
            });

            res.json({
                success: true,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

exports.getMe = async (req, res) => {
    try {
        let token;

        if (req.cookies.token) {
            token = req.cookies.token;
        } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(200).json({ success: false, user: null, message: 'Not logged in' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(200).json({ success: false, user: null, message: 'User not found' });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(200).json({ success: false, user: null, message: 'Invalid token' });
    }
};

exports.googleLogin = async (req, res) => {
    try {
        const token = req.body.token || req.body.credential;
        if (!token) {
            return res.status(400).json({ success: false, message: 'Google token is required' });
        }

        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
            return res.status(400).json({ success: false, message: 'Google token verification failed' });
        }

        const payload = await response.json();
        const { email, name } = payload;

        let user = await User.findOne({ email });

        if (!user) {
            // Generate a random secure dummy password for new oauth users
            const dummyPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10).toUpperCase();
            user = await User.create({
                name,
                email,
                password: dummyPassword,
                role: 'donor',
                bloodType: 'O+',
                city: 'Bilaspur',
                phone: '9999999999',
                location: cityCoords['bilaspur']
            });
        }

        const jwtToken = generateToken(user._id);

        // Set cookie
        res.cookie('token', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.status(200).json({
            success: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: jwtToken
        });
    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(500).json({ success: false, message: 'Google authentication failed: ' + error.message });
    }
};

