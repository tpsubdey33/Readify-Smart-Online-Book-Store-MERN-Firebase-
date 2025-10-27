const jwt = require('jsonwebtoken');
const User = require('../users/user.model'); // Add this import

const JWT_SECRET = process.env.JWT_SECRET_KEY;

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Access Denied. No token provided' 
            });
        }
        
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Verify user exists in database
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Account is deactivated'
            });
        }

        req.user = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        };
        
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(403).json({ 
            success: false,
            message: 'Invalid or expired token' 
        });
    }
};

module.exports = verifyToken;