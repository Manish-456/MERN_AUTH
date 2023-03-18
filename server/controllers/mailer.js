const { EMAIL, PASSWORD } = require("../config/config");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

let config = {
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    },
  };
  let transporter = nodemailer.createTransport(config);
  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "MERN-AUTH",
      link: "https://mern-auth-jfvr.onrender.com",
    },
  });

/** Send mail from real gmail account */
const mailer =async (req, res) => {
   const {username,  text, subject} = req.body;
  let response = {
    body: {
      name :  username,
      intro: text || "Welcome to MERN-AUTH App",
      outro: "Looking forward to do more business",
    },
  };

  let mail = MailGenerator.generate(response);
  let message = {
    from: "MERN-AUTH",
    to: req.body.email,
    subject: subject || "Signup successful",
    html: mail,
  };
  transporter
    .sendMail(message)
    .then(() => {
      return res.status(201).json({
        msg: "You should receive an email",
      });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
};

module.exports = mailer
