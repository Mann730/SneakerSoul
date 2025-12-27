import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const createAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.DB);
        console.log("✅ MongoDB Connected");

        // Admin credentials
        const adminEmail = "parmarmanav730@gmail.com";
        const adminPassword = "Mann@2004";
        const adminName = "Admin";

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log("⚠️  Admin user already exists!");
            console.log("Email:", existingAdmin.email);
            console.log("Role:", existingAdmin.role);
            console.log("Verified:", existingAdmin.isVerified);
            process.exit(0);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Create admin user
        const admin = await User.create({
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: "admin",
            isVerified: true, // Admin is pre-verified
        });

        console.log("✅ Admin user created successfully!");
        console.log("📧 Email:", adminEmail);
        console.log("🔑 Password:", adminPassword);
        console.log("👤 Role:", admin.role);
        console.log("\n🎉 You can now login with these credentials!");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error creating admin:", error);
        process.exit(1);
    }
};

createAdmin();
