const nodemailer = require('nodemailer');
const projectConfig = require('../config');

const sendEmail = async (email, subject, html) => {
   const mailOptions = {
      from: projectConfig.email.address,
      to: email,
      subject: subject,
      html: html
   }
   const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      service: 'gmail',
      auth: {
         user: projectConfig.email.address,
         pass: projectConfig.email.password,
      }
   });
   try {
      const res = await transporter.sendMail(mailOptions);
      return !res ? false : true;
   } catch (error) {
      console.log(error);
      return false;
   }
};

module.exports = sendEmail;