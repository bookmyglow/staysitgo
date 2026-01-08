import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const fromEmail = {
  email: process.env.SENDGRID_FROM_EMAIL,
  name: process.env.SENDGRID_FROM_NAME || 'StaySitGo'
};

export const sendEmail = async (to, subject, html, text) => {
  const msg = {
    to,
    from: fromEmail,
    subject,
    text,
    html
  };

  try {
    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

export const sendEmailVerification = async (email, token, firstName) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ed6f1a;">Verify Your Email Address</h2>
      <p>Hello ${firstName},</p>
      <p>Thank you for signing up with StaySitGo! Please verify your email address by entering the following code:</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
        <h1 style="color: #0ba5e9; margin: 0; letter-spacing: 5px;">${token}</h1>
      </div>
      
      <p>This code will expire in 24 hours.</p>
      <p>If you did not create an account with us, please ignore this email.</p>
      
      <p>Best regards,<br>The StaySitGo Team</p>
    </div>
  `;

  const text = `
Hello ${firstName},

Thank you for signing up with StaySitGo! Please verify your email address by entering the code:

${token}

This code will expire in 24 hours.

Best regards,
The StaySitGo Team
  `;

  return sendEmail(email, 'Verify Your Email - StaySitGo', html, text);
};

export const sendSmsVerification = async (phone, token) => {
  const message = `StaySitGo: Your verification code is: ${token}`;
  
  const twilio = require('twilio');
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
    return true;
  } catch (error) {
    console.error('SMS sending error:', error);
    return false;
  }
};

export const sendEmailNotification = async (to, subject, message) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ed6f1a;">${subject}</h2>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <p>Best regards,<br>The StaySitGo Team</p>
    </div>
  `;

  const text = `${subject}\n\n${message}\n\nBest regards,\nThe StaySitGo Team`;

  return sendEmail(to, subject, html, text);
};

export const sendBookingConfirmation = async (email, parentName, sitterName, bookingDetails) => {
  const { startDate, endDate, totalAmount, cancellationFee } = bookingDetails;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ed6f1a;">Booking Confirmed!</h2>
      <p>Hello ${parentName},</p>
      <p>Great news! Your pet sitting booking has been confirmed by ${sitterName}.</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0;">
        <h3>Booking Details:</h3>
        <ul>
          <li><strong>Dates:</strong> ${startDate} to ${endDate}</li>
          <li><strong>Total Amount:</strong> $${totalAmount}</li>
          <li><strong>Cancellation Fee:</strong> $${cancellationFee} (if cancelled within 7 days)</li>
        </ul>
      </div>

      <p>You can view the full details and communicate with your pet sitter in your dashboard.</p>
      
      <p>Best regards,<br>The StaySitGo Team</p>
    </div>
  `;

  return sendEmail(email, 'Booking Confirmed - StaySitGo', html);
};

export const sendPasswordReset = async (email, resetToken, firstName) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ed6f1a;">Reset Your Password</h2>
      <p>Hello ${firstName},</p>
      <p>We received a request to reset your password. Click the button below to reset it:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #ed6f1a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px;">Reset Password</a>
      </div>
      
      <p>If you didn't request this, please ignore this email.</p>
      
      <p>Best regards,<br>The StaySitGo Team</p>
    </div>
  `;

  return sendEmail(email, 'Password Reset - StaySitGo', html);
};