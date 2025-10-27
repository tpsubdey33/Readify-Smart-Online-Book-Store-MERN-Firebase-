// createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: String,
    isActive: Boolean
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
    try {
        await mongoose.connect(process.env.DB_URL);
        
        // Check if admin already exists
        const existingAdmin = await User.findOne({ username: 'admin', role: 'admin' });
        if (existingAdmin) {
            console.log('Admin user already exists');
            return;
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 12);
        const admin = new User({
            username: 'admin2',
            email: 'admin@bookstore.com',
            password: hashedPassword,
            role: 'admin',
            isActive: true
        });

        await admin.save();
        console.log('Admin user created successfully!');
        console.log('Username: admin');
        console.log('Password: admin123');
        
    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await mongoose.disconnect();
    }
}

createAdmin();