import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  message: string;
}

/** Function to send message to email  */
const sendEmail = async (options: EmailOptions): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 465, // Ensure port is a number
    secure: true, // Use SSL
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: options.to,
    subject: options.subject,
    html: options.message,
  };

  // send email to the user email address
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
