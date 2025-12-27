import getTransporter from "../config/mailer.js";

const sendOtpMail = async (req, res, next) => {
    console.log('📧 sendOtpMail middleware started');
    console.log('🔍 req.otpData:', req.otpData);
    
    try {
        // Check if otpData exists
        if (!req.otpData) {
            console.error('❌ req.otpData is missing!');
            return res.status(500).json({ message: 'OTP data not found' });
        }

        const { email, otp, type } = req.otpData;
        console.log('📬 Preparing to send email to:', email);
        console.log('🔐 OTP to send:', otp);

        // Fix subject logic - check for "Registration" not "Registration Failed"
        const subject = type === "Registration" 
            ? "Your OTP for Registration" 
            : "Your OTP for Password Reset";

        // Check email configuration
        const emailUser = process.env.EMAIL_USER?.trim();
        const emailPass = process.env.EMAIL_PASS?.trim();
        
        if (!emailUser || !emailPass) {
            console.error('❌ Email credentials missing!');
            console.log('EMAIL_USER:', emailUser ? 'Set' : 'Missing');
            console.log('EMAIL_PASS:', emailPass ? 'Set' : 'Missing');
            // For development: log OTP in console if email not configured
            console.log('⚠️  EMAIL NOT CONFIGURED - OTP for testing:', otp);
            return res.status(500).json({ 
                message: 'Email service not configured. Please check server logs for OTP.',
                otp: process.env.NODE_ENV === 'development' ? otp : undefined
            });
        }

        console.log('📤 Sending email via transporter...');
        let transporter;
        try {
            transporter = getTransporter();
        } catch (transporterError) {
            console.error('❌ Failed to get transporter:', transporterError.message);
            console.log('⚠️  EMAIL NOT CONFIGURED - OTP for testing:', otp);
            return res.status(500).json({ 
                message: 'Email service not configured. Please check server logs for OTP.',
                otp: process.env.NODE_ENV === 'development' ? otp : undefined
            });
        }
        
        await transporter.sendMail({
            from: emailUser,
            to: email,
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Your OTP Code</h2>
                    <p style="font-size: 16px;">Your OTP is:</p>
                    <p style="font-size: 32px; font-weight: bold; color: #007bff; text-align: center; padding: 20px; background: #f0f0f0; border-radius: 5px;">${otp}</p>
                    <p style="color: #666;">This OTP is valid for 10 minutes.</p>
                    <p style="color: #999; font-size: 12px; margin-top: 20px;">If you didn't request this, please ignore this email.</p>
                </div>
            `,
        });
        
        console.log('✅ Email sent successfully to:', email);
        next();
    }
    catch (error) {
        console.error('❌ Error in sendOtpMail:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            response: error.response
        });
        // Properly handle error - return response instead of throwing
        return res.status(500).json({ 
            message: 'Failed to send OTP email',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

export default sendOtpMail;