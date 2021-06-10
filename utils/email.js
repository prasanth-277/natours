const nodemailer = require("nodemailer");

const sendEmail = (options) => {
  //create transporter
  const transporter = nodemailer.createTransport({
      service:'Gmail',
      auth:{
          user:'email@gmail.com',
          pass:'123123123'
      }
      //Activate in gmail less secure app option
  })
  //define email options
  //send the email
};
