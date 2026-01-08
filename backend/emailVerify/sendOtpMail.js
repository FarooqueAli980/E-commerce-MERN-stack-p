import nodemailer from 'nodemailer'
import 'dotenv/config'

export const sendOtpMail = async (otp, email) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        const mailConfigrations = {
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Password Reset OTP',
            html: `<p>Your OTP for password reset is: <b>${otp}</b></p>`
        };

        await transporter.sendMail(mailConfigrations);
        console.log("OTP sent successfully");

    } catch (error) {
        console.log("Error sending email:", error.message);
        throw new Error(error);
    }
};
