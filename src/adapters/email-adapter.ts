import nodemailer from "nodemailer";
import {emailFrom, transporterOption} from "./common";
import {EmailMessage} from "../types/email/input";
import {UserOutputAuthType} from "../types/users/output";
import {emailManager} from "./email-manager";

export class EmailAdapter {
    static async sendEmailConfirmationEmail(user: UserOutputAuthType) {
        const isEmailSent = this._sendEmail(user.email,
            emailFrom.registrationService,
            emailManager.confirmationEmail(user.emailConfirmation.confirmationCode,user.login));
        if (!isEmailSent) return false;
        return true;
    }

    static async _sendEmail(mailTo: string, mailFrom: string, emailMessage: EmailMessage) {
        try {
            const transporter = nodemailer.createTransport(transporterOption);
            const sentEmailInfo = await transporter.sendMail(
                {
                    ...emailMessage,
                    from: mailFrom,
                    to: mailTo,
                });
            console.log("email sent");
            console.log(sentEmailInfo);
            return true;
        } catch (err) {
            console.log("email don't sent");
            console.log(err);
            return false;
        }

    }
}











