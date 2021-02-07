const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// console.log(process.env.SENDGRID_API_KEY);

const msg = {
  to: "muzykasv72@gmail.com", // Change to your recipient (хто отримує)

  from: "serhii.muzyka2918@gmail.com", // Change to your verified sender (від кого)
  subject: "Sending my first email using SendGrid", //* це тема повідомлення в шапці
  text: "It's my first email and use text",
  html:
    "<div><h1>My first email</h1><p>It was used html to get the markup</p><strong>It's my first email and use html</strong></div>",
};

sgMail
  .send(msg)
  .then(() => {
    console.log("Email sent");
  })
  .catch((error) => {
    console.error(error);
  });
