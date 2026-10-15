const nodemailer = require("nodemailer");
require("dotenv").config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
const sendEmail = (email, subject, body) => {
  const mailOptions = {
    from: `Zoi Health <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    text: body,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Zoi Health Assistant</h2>
        <div style="padding: 20px; background-color: #f8fafc; border-radius: 8px;">
          ${body.replace(/\n/g, "<br>")}
        </div>
        <p style="margin-top: 20px; color: #64748b;">
          Best regards,<br>
          The Zoi Team
        </p>
      </div>
    `
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

// For user signups
const sendWelcomeEmail = (email, name) => {
  const subject = "Welcome to Zoi Health App!";
  const body = `Hello ${name},\n\nThank you for signing up with Zoi Health App! We're excited to have you on board.`;
  sendEmail(email, subject, body);
};

// For doctor signups
const sendDoctorWelcomeEmail = (email, fullName, specialization, licenseNumber) => {
  const subject = `Welcome to Zoi- Health Assistant, Dr. ${fullName}!`;
  const body = `
    Dear Dr. ${fullName},

    Welcome to Zoi- Health Assistant!
    Your medical practitioner account has been successfully created with:
    - Specialization: ${specialization}
    - License Number: ${licenseNumber}
    
    You can now access your medical dashboard and start accepting appointments.
    
    Please keep your login credentials secure.
  `;
  sendEmail(email, subject, body);
};

// New: For ambulance request confirmation to user
const sendAmbulanceUserConfirmation = (email, name, requestDetails) => {
  const subject = "Ambulance Request Confirmation";
  const body = `
    Hello ${name},

    Your ambulance request has been received and is being processed.

    Request Details:
    - Request ID: ${requestDetails.requestId}
    - Patient Name: ${requestDetails.patientName}
    - Emergency Type: ${requestDetails.emergencyType}
    - Patient Status: ${requestDetails.patientStatus}
    - Contact Number: ${requestDetails.contactNumber}
    - Address: ${requestDetails.address}
    - Location: ${requestDetails.location.latitude}, ${requestDetails.location.longitude}
    - Request Time: ${requestDetails.createdAt}

    Estimated arrival time: 15-20 minutes

    We'll send another notification when the ambulance is dispatched.

    Thank you,
    The Zoi Health Team
  `;
  sendEmail(email, subject, body);
};

// New: For ambulance request notification to admin
const sendAmbulanceAdminNotification = (adminEmail, userDetails, requestDetails) => {
  const subject = `URGENT: New Ambulance Request (${requestDetails.emergencyType})`;
  const body = `
    New Ambulance Request Requires Immediate Attention

    User Details:
    - Name: ${userDetails.name}
    - Email: ${userDetails.email}

    Request Details:
    - Request ID: ${requestDetails.requestId}
    - Patient Name: ${requestDetails.patientName}
    - Emergency Type: ${requestDetails.emergencyType}
    - Patient Status: ${requestDetails.patientStatus}
    - Contact Number: ${requestDetails.contactNumber}
    - Address: ${requestDetails.address}
    - Location: ${requestDetails.location.latitude}, ${requestDetails.location.longitude}
    - Request Time: ${requestDetails.createdAt}

    Action Required:
    Dispatch the nearest available ambulance immediately.

    Google Maps: https://www.google.com/maps?q=${requestDetails.location.latitude},${requestDetails.location.longitude}
  `;
  sendEmail(adminEmail, subject, body);
};
module.exports = {
  sendWelcomeEmail,
  sendDoctorWelcomeEmail,
  sendAmbulanceUserConfirmation,
  // Export new functions
  sendAmbulanceAdminNotification
};
