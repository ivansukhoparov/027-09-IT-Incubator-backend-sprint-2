import {EmailMessage} from "../types/email/input";

export const emailManager = {
    confirmationEmail: (confirmationCode: string, name:string): EmailMessage => ({
        subject: "Thanks for registration! Confirm your email",
        html: `
            <h1>Dear ${name}, thanks for your registration</h1>
                 <p>To finish registration please follow the link below:
                    <a href="https://somesite.com/confirm-email?code=${confirmationCode}">complete registration</a>
                 </p>`
    })
}
