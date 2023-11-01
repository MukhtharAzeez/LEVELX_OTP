const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'SendGrid',
            auth: {
                user: process.env.SENDGRID_USER,
                pass: process.env.SENDGRID_PASS,
            },
        });

        //2) Define email options
        const emailOptions = {
            from: `LevelX, <${process.env.EMAIL_ADDRESS}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
        };

        //3) Send the email
        return new Promise((resolve, reject) => {
            transporter.sendMail(emailOptions, (err, info) => {
                if (err) {
                    console.log(err)
                    reject(false);
                } else {
                    resolve(true);
                }
            });
        });
    } catch (error) {
        console.log("error",error)
    }
};

module.exports = sendEmail; 