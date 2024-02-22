import sendEmailFunc from '../utils/email';

export const sendEmail = async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    // Use the sendEmail function from email.ts to send the email
    await sendEmailFunc(to, subject, text);

    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'An error occurred while sending the email.' });
  }
};
