import nodemailer from 'nodemailer'
import 'dotenv/config'
import { text } from 'express';


export const verifyEmail = (token, email) => {
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
        subject: 'Email verification',
        text: ` hy dear you have recently visted our website , 
                and enterd your email please follow the gavin
                link  to verify your email.
                http://localhost:5173/verify/${token}
                thanks `
    }
    transporter.sendMail(mailConfigrations, (error, info )=>{
        if (error)throw Error(error);
        console.log('Email sent Successfully');
        console.log(info);
    })

}
