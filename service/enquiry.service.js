import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Nodemailer transporter config
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "mailtrscbe@gmail.com",
        pass: "jkdkseaqrzsgduao", // Use Gmail App Password
    },
});

function sendEnquiryInvoice() {
    return {
        // 📨 Enquiry Email
        sendEnquiry: async (data) => {
            const enquiryData = {
                name: data?.name || "Customer",
                email: data?.email || "not_provided@example.com",
                phone: data?.mobile || "N/A",
                from: data?.from || "N/A",
                to: data?.to || "N/A",
                trip: parseInt(data?.service) || 0,
                pDate: data?.pickupDateTime || "N/A",
                customerId: data?.customerId || "N/A",
                createdAt: {
                    date: new Date().toLocaleDateString("en-GB", { timeZone: "IST" }),
                    time: new Date().toLocaleTimeString("en-GB", { timeZone: "IST" }),
                },
            };
            console.log("Enquiry Data:", enquiryData);

            try {
                const htmlFile = await ejs.renderFile(
                    path.join(__dirname, "mail/enquiry.mail.ejs"),
                    { data: enquiryData }
                );

                const mailOptions = {
                    from: "mailtrscbe@gmail.com",
                    to: "garudatravels.com@gmail.com", // Set to user email if needed
                    subject: `garudatoursandtravels: ${enquiryData.createdAt.date} ${enquiryData.createdAt.time}`,
                    html: htmlFile,
                };

                const info = await transporter.sendMail(mailOptions);
                console.log("[Mail] Enquiry Email Sent:", info.response);
                return { status: 200, msg: "Enquiry Email Sent" };

            } catch (err) {
                console.error("[Mail] Enquiry Email Error:", err.message);
                return { status: 500, error: err.message };
            }
        },

        // ✅ Booking Confirmation Email
        sendSuccess: async (data) => {
            console.log("data >> ", data)

            const [pickupDate, pickupTime] = (data?.pickupDateTime || "").split("T");

            const bookingData = {
                bookID: data?.bookID || data?.bookId || "N/A",
                name: data?.name || "N/A",
                email: data?.email || "N/A",
                mobile: data?.mobile || data?.phone || "N/A",
                service: data?.service === "0" ? "One Way" : "Round Trip",
                estimatedData: {
                    cName: data?.estimatedData?.cName || data?.carType || "N/A",
                    rate: data?.estimatedData?.rate || data?.rate || 0,
                    batta: data?.estimatedData?.batta || data?.betta || 0,
                    price: data?.estimatedData?.price || data?.price || 0,
                },
                pick: data?.pickupLocation || data?.from || "N/A",
                drop: data?.dropLocation || data?.to || "N/A",
                distance: data?.distance || data?.totalDistance || 0,
                duration: data?.duration || data?.totalTravelingTime || "N/A",
                rate: data?.estimatedData?.rate || data?.rate || "N/A",
                pickupDate: pickupDate || "N/A",
                pickupTime: pickupTime || "N/A",
                createdAt: {
                    date: new Date().toLocaleDateString("en-GB", { timeZone: "IST" }),
                    time: new Date().toLocaleTimeString("en-GB", { timeZone: "IST" }),
                },
            };
            

            console.log("Booking Data:", bookingData);


            try {
                const htmlFile = await ejs.renderFile(
                    path.join(__dirname, "mail/booking.mail.ejs"),
                    { data: bookingData }
                );

                const mailOptions = {
                    from: "mailtrscbe@gmail.com",
                    to: [bookingData.email, "garudatravels.com@gmail.com"],
                    subject: `garudatoursandtravels Booking Confirmation: ${bookingData.createdAt.date} ${bookingData.createdAt.time}`,
                    html: htmlFile,
                };

                const info = await transporter.sendMail(mailOptions);
                console.log("[Mail] Booking Email Sent:", info.response);
                return { status: 200, msg: "Booking Confirmation Email Sent" };

            } catch (err) {
                console.error("[Mail] Booking Email Error:", err.message);
                return { status: 500, error: err.message };
            }
        },
    };
}

export default sendEnquiryInvoice;
