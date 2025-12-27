import nodemailer from 'nodemailer';

// Function to get transporter (lazy initialization)
let transporter = null;

const getTransporter = () => {
    // Check if credentials are valid (not undefined and not empty strings)
    const emailUser = process.env.EMAIL_USER?.trim();
    const emailPass = process.env.EMAIL_PASS?.trim();
    
    if (!emailUser || !emailPass) {
        throw new Error('Email credentials not configured. Please set EMAIL_USER and EMAIL_PASS in your .env file');
    }

    // Create transporter if it doesn't exist
    if (!transporter) {
        transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: emailUser,
                pass: emailPass,
            },
        });
    }

    return transporter;
};

// Verify transporter configuration (only if credentials are available)
const verifyTransporter = async () => {
    try {
        const emailUser = process.env.EMAIL_USER?.trim();
        const emailPass = process.env.EMAIL_PASS?.trim();
        
        if (!emailUser || !emailPass) {
            console.warn('⚠️  Email credentials not configured. Email functionality will not work.');
            console.warn('   Please set EMAIL_USER and EMAIL_PASS in your .env file');
            return;
        }

        const transport = getTransporter();
        await transport.verify();
        console.log('✅ Email transporter is ready to send emails');
    } catch (error) {
        console.error('❌ Email transporter verification failed:', error.message);
        if (error.code === 'EAUTH') {
            console.error('   This usually means:');
            console.error('   1. Wrong email or password');
            console.error('   2. For Gmail, you need to use an App Password (not your regular password)');
            console.error('   3. 2-Step Verification must be enabled on your Google account');
        }
    }
};

// Call verification after a short delay to ensure env vars are loaded
setTimeout(() => {
    verifyTransporter();
}, 1000);

// Export function to get transporter
export default getTransporter;