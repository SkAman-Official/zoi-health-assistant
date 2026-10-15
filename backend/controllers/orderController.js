const jwt = require("jsonwebtoken");
const {
  sendOrderConfirmationToUser,
  sendOrderToAdmin
} = require("../utils/email");
exports.placeOrder = async (req, res) => {
  try {
    const {
      items,
      total,
      address,
      phone,
      paymentMode
    } = req.body;

    // Default fallback email in case JWT fails
    let userEmail = "guest@example.com";

    // Extract token from Authorization header
    console.log("Raw Authorization Header:", req.headers.authorization);
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded JWT:", decoded); // ✅ Add this
        if (decoded?.email) {
          userEmail = decoded.email;
        }
      } catch (err) {
        console.warn("JWT verification failed:", err.message);
        console.log("Decoded JWT:", decoded);
      }
    }
    const deliveryDate = new Date(Date.now() + Math.random() * 5 * 86400000).toDateString(); // random delivery date (0–5 days from now)

    const orderDetails = {
      userEmail,
      items,
      total,
      address,
      phone,
      paymentMode,
      deliveryDate
    };
    await sendOrderConfirmationToUser(userEmail, orderDetails);
    await sendOrderToAdmin(orderDetails);
    res.status(200).json({
      message: "Order placed and emails sent."
    });
  } catch (err) {
    console.error("Order Error:", err.message);
    res.status(500).json({
      message: "Error placing order."
    });
  }
};
