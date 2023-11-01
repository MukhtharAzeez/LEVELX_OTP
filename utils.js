const sgMail = require('@sendgrid/mail')


function generateOTP() {
    // Generate a random 4-digit number
    const min = 1000; 
    const max = 9999; 
    const otp = Math.floor(Math.random() * (max - min + 1)) + min;
    return otp;
}


const sendEmail = async (options) => {
    const {email, subject, text} =  options
    return new Promise((resolve, reject) => {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const otp = generateOTP();
        const msg = {
            to: email,
            from: process.env.SENDGRID_USER,
            subject,
            text: `${text} ${otp}`,
        };
        sgMail
            .send(msg)
            .then((data) => {
                // console.log('Email sent', data);
                resolve(true); // Resolve the Promise when email is sent successfully
            })
            .catch((error) => {
                // console.log('Error sending email', error);
                reject(false); // Reject the Promise on error
            });
    });
};

module.exports = sendEmail; 