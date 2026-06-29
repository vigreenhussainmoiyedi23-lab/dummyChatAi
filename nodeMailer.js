import nodemailer from "nodemailer";
import "dotenv/config";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GOOGLE_USER,
        pass: process.env.GOOGLE_APP_PASSWORD, // The 16-character App Password
    },
});

