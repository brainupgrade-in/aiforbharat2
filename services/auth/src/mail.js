import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendOtp(email, otp) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Your Nazar AI login code',
    text: `Your Nazar AI login code is ${otp}. It expires in 10 minutes.\n\nIf you didn't request this, ignore this email.`,
    html: `<p>Your Nazar AI login code is <strong style="font-size:24px">${otp}</strong>.</p><p>It expires in 10 minutes.</p><p>If you didn't request this, ignore this email.</p>`,
  });
}
