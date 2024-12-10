import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendNotificationEmail(to, subject, message) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text: message,
    html: `<div>${message}</div>`
  };

  return transporter.sendMail(mailOptions);
}