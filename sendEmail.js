import { transporter } from "./nodeMailer.js";
function sendEmail({ subject, to, html }) {
  const mailOptions = {
    from: 'vigreenhussainmoiyedi23@gmail.com',
    to,
    subject,
    html: html
  };
  console.log("sending email to " + to);

  // 3. Send the email
   transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('Error occurred:', error ,info);
    }
  });
  return "email sent successfully to " + to
}

export default sendEmail