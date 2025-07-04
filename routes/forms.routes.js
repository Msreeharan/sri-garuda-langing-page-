import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/send-enquiry", async (req, res) => {
    try {
        const {
            name,
            email,
            mobile,
            service,
            from,
            to,
            pickupDateTime,
            dropDateTime,
        } = req.body;

        const pickupDate = new Date(pickupDateTime);
        const formattedDate = pickupDate.toLocaleDateString("en-IN");
        const formattedTime = pickupDate.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        });

        const enquiryHtml = `
      <h2>🚖 garudatoursandtravels Booking Enquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mobile:</strong> ${mobile}</p>
      <p><strong>Service Type:</strong> ${service === "1" ? "Round Trip" : "One Way Trip"}</p>
      <p><strong>Pickup Location:</strong> ${from}</p>
      <p><strong>Drop Location:</strong> ${to}</p>
      <p><strong>Pickup Date & Time:</strong> ${formattedDate} ${formattedTime}</p>
      ${service === "1"
                ? `<p><strong>Drop Date & Time:</strong> ${new Date(dropDateTime).toLocaleString("en-IN")}</p>`
                : ""}
      <br><p>📩 This enquiry was submitted from the website form.</p>
    `;

        const confirmationHtml = `
      <h2>✅ Thank You for Booking with garudatoursandtravels!</h2>
      <p>Hi ${name},</p>
      <p>We’ve received your enquiry and will get in touch with you shortly.</p>
      <p><strong>Booking Summary:</strong></p>
      <ul>
        <li><strong>Service:</strong> ${service === "1" ? "Round Trip" : "One Way Trip"}</li>
        <li><strong>From:</strong> ${from}</li>
        <li><strong>To:</strong> ${to}</li>
        <li><strong>Pickup:</strong> ${formattedDate} ${formattedTime}</li>
        ${service === "1"
                ? `<li><strong>Drop:</strong> ${new Date(dropDateTime).toLocaleString("en-IN")}</li>`
                : ""}
      </ul>
      <p>📞 We will contact you shortly to confirm the booking.</p>
      <p>Best regards,<br>garudatoursandtravels Team</p>
    `;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "mailtrscbe@gmail.com",
                pass: "jkdkseaqrzsgduao",
            },
        });

        // Send Admin Email
        await transporter.sendMail({
            from: '"garudatoursandtravels" <mailtrscbe@gmail.com>',
            to: "garudatravels.com@gmail.com",
            subject: ` New Enquiry: ${formattedDate} ${formattedTime}`,
            html: enquiryHtml,
        });

        // Send Customer Confirmation
        await transporter.sendMail({
            from: '"garudatoursandtravels" <mailtrscbe@gmail.com>',
            to: email,
            subject: "✅ We’ve Received Your Booking Enquiry",
            html: confirmationHtml,
        });

        // ✅ Render success.ejs (EJS view engine must be configured)
        res.render("success", {
            name,
            email,
            mobile,
            from,
            to,
            formattedDate,
            formattedTime,
            serviceType: service === "1" ? "Round Trip" : "One Way Trip",
            dropDateTime: service === "1" ? new Date(dropDateTime).toLocaleString("en-IN") : null,
        });
    } catch (error) {
        console.error("❌ Email Error:", error);
        res.status(500).send("❌ Failed to send enquiry and confirmation.");
    }
});

export default router;
