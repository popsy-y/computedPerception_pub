import mailer from 'nodemailer';

const addr = process.env.MAIL_ADDR;
const pass = process.env.MAIL_PASS;


export async function send(subject, msg){
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
        subject: subject,
        text: msg
    });

    console.log(`sent: ${info.response}`);
    console.log("finished");

    return;
}