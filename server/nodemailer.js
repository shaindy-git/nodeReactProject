const nodemailer = require('nodemailer');

// הגדרת טרנספורט של nodemailer (הגדרות SMTP של Outlook)
const transporter = nodemailer.createTransport({
  service: 'Outlook365', // או 'hotmail' אם אתה משתמש בחשבון Hotmail
  auth: {
    user: '38215188814@mby.co.il', // כתובת המייל שלך
    pass: 'Student@264', // הסיסמה שלך
  }
});

// פונקציה לשליחת המייל
function sendEmail(to, subject, text) {
  const mailOptions = {
    from: '38215188814@mby.co.il', // כתובת המייל שלך
    to: to, // כתובת המייל של הנמען
    subject: subject, // נושא המייל
    text: text, // תוכן המייל
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info.response);
      }
    });
  });
}

module.exports = sendEmail;
