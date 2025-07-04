import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mailtrscbe@gmail.com",
    pass: "jkdkseaqrzsgduao",
  },
});

const mailOptions = (data) => ({
  from: "mailtrscbe@gmail.com",
  to: "srigarudatravels.com@gmail.com",
  subject: "garudatoursandtravels Enquiry",
  html: `
        <h1>garudatoursandtravels Enquiry</h1>
        Name: ${data?.name}<br>
        Email: ${data?.email}<br>
        Mobile: ${data?.mobile}<br>
        Message: ${data?.message}`,
});

const sendMail = (data) => {
  const options = mailOptions(data);
  transporter.sendMail(options, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

export default sendMail;