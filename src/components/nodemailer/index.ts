import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport(
  'smtps://my.choice7272%40gmail.com:sosiska11@smtp.gmail.com'
);

const mailOptions = {
  from: 'my.choice7272@gmail.com',
  to: 'amina.mazurova42@gmail.com',
  subject: 'Ti pidar',
  text: 'Hello from node.js',
};

const sendMail = (to, subject, text) => transporter.sendMail({
  to,
  subject,
  from: 'help@мойвыбор.рф',
  text
}, (error, info) => {
  if (error) {
    return console.log(`error: ${error}`);
  }
  console.log(`Message Sent ${info.response}`);
});

export default sendMail;
