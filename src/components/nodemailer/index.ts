import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport(
  'smtps://my.choice7272%40gmail.com:Sosiska12@smtp.gmail.com'
);

const sendMail = (to, subject, text) => transporter.sendMail({
  to,
  subject,
  from: 'help@мойвыбор.рф',
  text
}, (error, info) => {
  if (error) {
    return console.log(`error: ${error}, to: ${to}`);
  }
  console.log(`Message Sent ${info.response} to ${to}`);
});

export default sendMail;
