const mailer = require('nodemailer');

const addr = process.env.MAIL_ADDR;
const pass = process.env.MAIL_PASS;


async function send(){
    const transporter = mailer.createTransport({
        service: "Gmail",
        auth: {
            user: addr,
            pass: pass
        }
    });
    
    const info = await transporter.sendMail({
        from: addr,
        to: addr,
        subject: "testSubject",
        text: "test text"
    });

    console.log(`sent: ${info.response}`);
    console.log("finished");
}

send();