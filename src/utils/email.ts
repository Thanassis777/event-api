import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export default async function sendEmailFunc(to, subject, html) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  };

  // Send email
  await transporter.sendMail(mailOptions);
}
