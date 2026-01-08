import 'dotenv/config';
import connectDB from './databse/db.js';
import { User } from './models/userModel.js';
import bcrypt from 'bcryptjs';

const seedAdmin = async () => {
    try {
        await connectDB();

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@ecommerce.com' });
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash('Admin@123', 10);
        
        const admin = await User.create({
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@ecommerce.com',
            password: hashedPassword,
            role: 'admin',
            isVerified: true,
            isLoggedIn: false,
        });

        console.log('✅ Admin user created successfully');
        console.log('Email: admin@ecommerce.com');
        console.log('Password: Admin@123');
        console.log('Please change the password after first login');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error.message);
        process.exit(1);
    }
};

seedAdmin();
