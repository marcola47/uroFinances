import nodemailer from 'nodemailer';

export default function sendEmail(mailBody) {
  const transport = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  transport.sendMail(mailBody, (error, info) => {
    if (error) 
      console.log(error);
    
    console.log(`Message sent: ${info.messageId}`);
  });
}