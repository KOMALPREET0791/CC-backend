import nodemailer from 'nodemailer';

export const sendWelcomeEmail = async (to, name) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or smtp, mailtrap, etc.
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Crave cart" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Welcome to Crave cart!',
    text: `Hi ${name},\n\nThanks for registering at Crave cart. We're excited to have you onboard!`,
  };

  await transporter.sendMail(mailOptions);
};
