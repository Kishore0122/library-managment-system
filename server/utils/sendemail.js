import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendEmail = async ({ to, subject, message }) => {
  if (!to) throw new Error("Recipient email is missing!");
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    service: process.env.SMTP_SERVICE,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Library System" <${process.env.SMTP_MAIL}>`,
    to,
    subject,
    html: message,   
  };

  await transporter.sendMail(mailOptions);
  console.log('Email sent successfully');
}
