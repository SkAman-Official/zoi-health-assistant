const nodemailer = require('nodemailer');

// Create reusable transporter object
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ======================
// AMBULANCE BOOKING EMAILS
// ======================

exports.sendAmbulanceConfirmationEmail = async (userEmail, request) => {
  try {
    const mailOptions = {
      from: `Zoi Emergency Services <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: '🚑 Ambulance Request Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="background-color: #d9534f; padding: 15px; border-radius: 8px; color: white; text-align: center;">
            <h1 style="margin: 0;">Ambulance Request Confirmed</h1>
          </div>
          
          <div style="margin-top: 20px;">
            <p>Dear ${request.patientName},</p>
            <p>Your ambulance request has been received and is being processed.</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #d9534f;">Request Details:</h3>
              <p><strong>Request ID:</strong> ${request._id}</p>
              <p><strong>Emergency Type:</strong> ${request.emergencyType}</p>
              <p><strong>Patient Status:</strong> ${request.patientStatus}</p>
              <p><strong>Contact Number:</strong> ${request.contactNumber}</p>
              <p><strong>Address:</strong> ${request.address}</p>
              <p><strong>Status:</strong> ${request.status}</p>
              ${request.additionalInfo ? `<p><strong>Additional Info:</strong> ${request.additionalInfo}</p>` : ''}
            </div>
            
            <p>We will dispatch the nearest ambulance immediately. Estimated arrival time is <strong>15-20 minutes</strong>.</p>
            
            <h3 style="color: #d9534f;">What to do while you wait:</h3>
            <ul>
              <li>Stay on the line with our operator if possible</li>
              <li>Clear a pathway for ambulance access</li>
              <li>Keep the patient calm and still</li>
              <li>Gather any relevant medical information</li>
            </ul>
            
            <div style="text-align: center; margin: 25px 0;">
              <a href="${process.env.BASE_URL}/track-ambulance/${request._id}" 
                style="display: inline-block; background-color: #d9534f; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Track Your Ambulance
              </a>
            </div>
            
            <p>Thank you,<br><strong>Zoi Emergency Services</strong></p>
          </div>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    // Don't fail the request just because email failed
  }
};
exports.sendAdminAlertEmail = async request => {
  try {
    const mailOptions = {
      from: `Zoi Alert System <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `URGENT: New Ambulance Request - ${request._id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #d9534f; border-radius: 10px; background-color: #fff8f8;">
          <h1 style="color: #d9534f; text-align: center; margin-top: 0;">NEW AMBULANCE REQUEST</h1>
          
          <div style="background-color: #f2dede; padding: 15px; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #a94442;">Patient Details:</h3>
            <p><strong>Name:</strong> ${request.patientName}</p>
            <p><strong>Contact:</strong> ${request.contactNumber}</p>
            <p><strong>Emergency:</strong> ${request.emergencyType}</p>
            <p><strong>Status:</strong> ${request.patientStatus}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #a94442;">Location:</h3>
            <p>${request.address}</p>
            <p><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(request.address)}" 
            target="_blank" style="color: #d9534f;">
            View Address on Google Maps
            </a></p>
          </div>
          
          ${request.additionalInfo ? `
          <div style="margin: 20px 0;">
            <h3 style="color: #a94442;">Additional Info:</h3>
            <p>${request.additionalInfo}</p>
          </div>
          ` : ''}
          
          <div style="background-color: #fcf8e3; padding: 15px; border-radius: 8px; text-align: center;">
            <p style="font-weight: bold; color: #a94442; font-size: 18px;">
              ACTION REQUIRED: Dispatch ambulance immediately!
            </p>
            <p>Request received at: ${new Date(request.createdAt).toLocaleString()}</p>
          </div>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
    console.log(`Admin alert sent for request ${request._id}`);
  } catch (error) {
    console.error('Error sending admin alert:', error);
  }
};

// ======================
// HOSPITAL BOOKING EMAILS
// ======================

exports.sendBookingConfirmationEmail = async (userEmail, booking) => {
  try {
    const mailOptions = {
      from: `Zoi Emergency Services <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: '🏥 Hospital Booking Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="background-color: #4a90e2; padding: 15px; border-radius: 8px; color: white; text-align: center;">
            <h1 style="margin: 0;">Hospital Booking Confirmed</h1>
          </div>
          
          <div style="margin-top: 20px;">
            <p>Dear ${booking.name},</p>
            <p>Your hospital booking has been successfully confirmed.</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #4a90e2;">Booking Details:</h3>
              <p><strong>Name:</strong> ${booking.name}</p>
              <p><strong>Phone:</strong> ${booking.phone}</p>
              <p><strong>Condition:</strong> ${booking.condition}</p>
              <p><strong>Symptoms:</strong> ${booking.symptoms}</p>
              <p><strong>Hospital ID:</strong> ${booking.hospitalId}</p>
              <p><strong>Ambulance Required:</strong> ${booking.ambulanceRequired ? 'Yes' : 'No'}</p>
            </div>
            
            <p>Please proceed to ${booking.hospitalId} immediately for treatment.</p>
            
            <div style="text-align: center; margin: 25px 0;">
              <p>Thank you for choosing Zoi Emergency Services</p>
            </div>
          </div>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
    console.log(`Booking confirmation email sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
  }
};
exports.sendAdminBookingAlert = async booking => {
  try {
    const mailOptions = {
      from: `Zoi Alert System <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `URGENT: New Hospital Booking - ${booking.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #4a90e2; border-radius: 10px; background-color: #f0f7ff;">
          <h1 style="color: #4a90e2; text-align: center; margin-top: 0;">NEW HOSPITAL BOOKING</h1>
          
          <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #1565c0;">Patient Details:</h3>
            <p><strong>Name:</strong> ${booking.name}</p>
            <p><strong>Contact:</strong> ${booking.phone}</p>
            <p><strong>Condition:</strong> ${booking.condition}</p>
            <p><strong>Symptoms:</strong> ${booking.symptoms}</p>
            <p><strong>Hospital:</strong> ${booking.hospitalId}</p>
            <p><strong>Ambulance Required:</strong> ${booking.ambulanceRequired ? 'YES' : 'No'}</p>
          </div>
          
          <div style="background-color: #fff8e1; padding: 15px; border-radius: 8px; text-align: center; margin-top: 20px;">
            <p style="font-weight: bold; color: #1565c0; font-size: 18px;">
              ACTION REQUIRED: Confirm hospital booking
            </p>
            <p>Booking created at: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
    console.log(`Admin booking alert sent for ${booking.name}`);
  } catch (error) {
    console.error('Error sending admin booking alert:', error);
  }
};

// ======================
// BLOOD BOOKING EMAILS
// ======================

exports.sendBloodBookingConfirmation = async (userEmail, booking) => {
  try {
    const mailOptions = {
      from: `Zoi Blood Services <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: '🩸 Blood Booking Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="background-color: #c0392b; padding: 15px; border-radius: 8px; color: white; text-align: center;">
            <h1 style="margin: 0;">Blood Booking Confirmed</h1>
          </div>
          
          <div style="margin-top: 20px;">
            <p>Dear ${booking.patientName},</p>
            <p>Your blood booking has been successfully processed. Below are your booking details:</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #c0392b;">Booking Summary:</h3>
              <p><strong>Patient Name:</strong> ${booking.patientName}</p>
              <p><strong>Contact Person:</strong> ${booking.contactName}</p>
              <p><strong>Phone Number:</strong> ${booking.phone}</p>
              <p><strong>Blood Type:</strong> ${booking.bloodType}</p>
              <p><strong>Units Required:</strong> ${booking.units}</p>
              <p><strong>Urgency Level:</strong> ${booking.urgency.charAt(0).toUpperCase() + booking.urgency.slice(1)}</p>
              <p><strong>Hospital:</strong> ${booking.hospital}</p>
              ${booking.additionalInfo ? `<p><strong>Additional Information:</strong> ${booking.additionalInfo}</p>` : ''}
            </div>
            
            <h3 style="color: #c0392b;">Next Steps:</h3>
            <ul>
              <li>Proceed to ${booking.hospital}'s blood bank</li>
              <li>Bring valid identification and medical documents</li>
              <li>Our staff will be expecting your arrival</li>
              <li>Contact the hospital if your plans change</li>
            </ul>
            
            <p>Thank you for using Zoi Blood Services.</p>
          </div>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
    console.log(`Blood booking confirmation sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending blood booking confirmation:', error);
  }
};
exports.sendBloodBookingAdminAlert = async booking => {
  try {
    const mailOptions = {
      from: `Zoi Blood Alert System <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `URGENT: Blood Request - ${booking.bloodType} Needed`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #c0392b; border-radius: 10px; background-color: #fff0f0;">
          <h1 style="color: #c0392b; text-align: center; margin-top: 0;">NEW BLOOD BOOKING REQUEST</h1>
          
          <div style="background-color: #f2dede; padding: 15px; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #a94442;">Patient Details:</h3>
            <p><strong>Patient Name:</strong> ${booking.patientName}</p>
            <p><strong>Contact Person:</strong> ${booking.contactName}</p>
            <p><strong>Phone:</strong> ${booking.phone}</p>
            <p><strong>Blood Type:</strong> <span style="font-weight: bold; color: #c0392b;">${booking.bloodType}</span></p>
            <p><strong>Units Required:</strong> ${booking.units}</p>
            <p><strong>Urgency:</strong> ${booking.urgency.charAt(0).toUpperCase() + booking.urgency.slice(1)}</p>
            <p><strong>Hospital:</strong> ${booking.hospital}</p>
            ${booking.additionalInfo ? `<p><strong>Additional Info:</strong> ${booking.additionalInfo}</p>` : ''}
          </div>
          
          <div style="background-color: #fcf8e3; padding: 15px; border-radius: 8px; text-align: center; margin-top: 20px;">
            <p style="font-weight: bold; color: #c0392b; font-size: 18px;">
              ACTION REQUIRED: Arrange ${booking.units} unit(s) of ${booking.bloodType} blood
            </p>
            <p>Booking created at: ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="margin-top: 20px; text-align: center;">
            <a href="${process.env.ADMIN_DASHBOARD_URL || 'https://your-admin-dashboard.com'}" 
              style="display: inline-block; background-color: #c0392b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View Booking in Dashboard
            </a>
          </div>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
    console.log(`Blood booking admin alert sent for ${booking.patientName}`);
  } catch (error) {
    console.error('Error sending blood booking admin alert:', error);
  }
};

// ======================
// PHARMACY BOOKING EMAILS
// ======================

// ======================
// PHARMACY BOOKING EMAILS
// ======================

exports.sendOrderConfirmationToUser = async (userEmail, orderDetails) => {
  const mailOptions = {
    from: `"Zoi Health" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "🧾 Zoi Order Confirmation",
    html: `
      <h2>Hi there!</h2>
      <p>🎉 Your order has been placed successfully with <strong>Zoi Health</strong>.</p>
      <h3>🛍️ Order Summary:</h3>
      <ul>
        ${orderDetails.items.map(item => `<li>${item.name} — ₹${item.price} × ${item.quantity}</li>`).join("")}
      </ul>
      <p><strong>Total:</strong> ₹${orderDetails.total}</p>
      <p><strong>Delivery Date:</strong> ${orderDetails.deliveryDate}</p>
      <h3>📦 Shipping Address:</h3>
      <p>${orderDetails.address}</p>
      <p><strong>Phone:</strong> ${orderDetails.phone}</p>
      <p><strong>Payment Mode:</strong> ${orderDetails.paymentMode}</p>
      <br/>
      <p>Thank you for choosing Zoi. We’re working hard to get your order to you as quickly as possible! 💚</p>
    `
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${userEmail}`);
  } catch (error) {
    console.error(`Failed to send confirmation email to user (${userEmail}):`, error);
    throw error;
  }
};
exports.sendOrderToAdmin = async orderDetails => {
  const mailOptions = {
    from: `"Zoi Health" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "📥 New Order Received on Zoi",
    html: `
      <h2>📬 A user has placed a new order!</h2>
      <p><strong>User Email:</strong> ${orderDetails.userEmail}</p>
      <h3>🛒 Items Ordered:</h3>
      <ul>
        ${orderDetails.items.map(item => `<li>${item.name} — ₹${item.price} × ${item.quantity}</li>`).join("")}
      </ul>
      <p><strong>Total:</strong> ₹${orderDetails.total}</p>
      <p><strong>Delivery Expected By:</strong> ${orderDetails.deliveryDate}</p>
      <h3>📍 Shipping Details:</h3>
      <p>${orderDetails.address}</p>
      <p><strong>Phone:</strong> ${orderDetails.phone}</p>
      <p><strong>Payment Mode:</strong> ${orderDetails.paymentMode}</p>
    `
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Admin order notification email sent successfully.");
  } catch (error) {
    console.error("Failed to send order notification to admin:", error);
    throw error;
  }
};

// ======================
// APPOINTMENT BOOKING EMAILS
// ======================

exports.sendUserAppointmentEmail = async (to, details) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Appointment Confirmation - Zoi Health Assistant",
    html: `
      <p>Hello ${details.name},</p>
      <p>Your appointment with <strong>Dr. ${details.doctor}</strong> at <strong>${details.hospital}</strong> 
      is scheduled on <strong>${details.date}</strong> at <strong>${details.time}</strong> (IST), subject to doctor approval.</p>
      <p>Reason: ${details.reason}</p>
      <p>Thank you for choosing Zoi!</p>
    `
  };
  await transporter.sendMail(mailOptions);
};
exports.sendDoctorNotificationEmail = async (to, details) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "New Appointment Scheduled",
    html: `
      <p>Dear Doctor,</p>
      <p>You have a new appointment scheduled:</p>
      <ul>
        <li><strong>Patient:</strong> ${details.name}</li>
        <li><strong>Contact:</strong> ${details.email}, ${details.phone}</li>
        <li><strong>Date & Time:</strong> ${details.date} at ${details.time}</li>
        <li><strong>Reason:</strong> ${details.reason}</li>
        <li><strong>First Visit:</strong> ${details.isFirstVisit ? "Yes" : "No"}</li>
      </ul>
    `
  };
  await transporter.sendMail(mailOptions);
};
