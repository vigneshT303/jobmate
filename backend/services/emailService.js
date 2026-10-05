const nodemailer = require('nodemailer');

let transporter = null;

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}


const sendEmail = async ({ to, subject, html, text }) => {
  if (!transporter) {
    console.log(`[Email Service - Simulated] To: ${to} | Subject: ${subject}`);
    return true;
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'JobMate Careers <noreply@jobmate.com>',
      to,
      subject,
      text,
      html
    });
    console.log(`[Email Sent] Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[Email Failed] ${error.message}`);
    return false;
  }
};


const sendApplicationReceivedEmail = async (applicant, job) => {
  const subject = `Job Application Received: ${job.title} at ${job.company?.name || 'JobMate'}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #4f46e5;">JobMate Career Notification</h2>
      <p>Dear <strong>${applicant.fullName}</strong>,</p>
      <p>Thank you for applying for the position of <strong>${job.title}</strong> at <strong>${job.company?.name || 'our partner company'}</strong>.</p>
      <p>Your application has been received and stored securely in our system. You can track your application status at any time in your JobMate dashboard.</p>
      <div style="margin: 20px 0; padding: 15px; background: #f8fafc; border-left: 4px solid #4f46e5; border-radius: 4px;">
        <p style="margin: 0;"><strong>Job Role:</strong> ${job.title}</p>
        <p style="margin: 5px 0 0 0;"><strong>Location:</strong> ${job.location} (${job.workMode})</p>
        <p style="margin: 5px 0 0 0;"><strong>Status:</strong> Applied</p>
      </div>
      <p>Best regards,<br/><strong>Team JobMate</strong></p>
    </div>
  `;
  return sendEmail({ to: applicant.email, subject, html, text: `Thank you for applying for ${job.title}.` });
};


const sendStatusUpdateEmail = async (applicant, job, newStatus, comment) => {
  const subject = `Application Status Update: ${job.title} - ${newStatus}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #4f46e5;">JobMate Application Update</h2>
      <p>Dear <strong>${applicant.fullName}</strong>,</p>
      <p>Your application status for the position <strong>${job.title}</strong> at <strong>${job.company?.name || 'Company'}</strong> has been updated to:</p>
      <h3 style="color: #10b981; margin: 10px 0;">${newStatus}</h3>
      ${comment ? `<p><strong>Feedback / Notes:</strong> ${comment}</p>` : ''}
      <p>Log in to your JobMate account to view next steps or more details.</p>
      <p>Best wishes,<br/><strong>Team JobMate Recruitment</strong></p>
    </div>
  `;
  return sendEmail({ to: applicant.email, subject, html, text: `Your application status for ${job.title} is now ${newStatus}.` });
};

module.exports = {
  sendEmail,
  sendApplicationReceivedEmail,
  sendStatusUpdateEmail
};
