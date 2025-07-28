import nodemailer from 'nodemailer';

export const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // or your provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Auth System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is: ${otp}. It expires in 5 minutes.`,
  });
};