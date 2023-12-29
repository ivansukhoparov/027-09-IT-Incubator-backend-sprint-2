import nodemailer from "nodemailer";
import dotenv from "dotenv";
import {emailLogin, emailPassword} from "../utils/comon";

dotenv.config();

export const emailAdapter ={

    async sendEmail(email:string,subject:string,message:string){
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: emailLogin,
                pass: emailPassword
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false
            },
        });
        const info = await transporter.sendMail({
            from: '"SI Solution" <sukhoparov.ivan@gmail.com>', // sender address
            to: email,
            subject: subject,
            text: message,
            html:message
        });

        return info;

    }

}











