import {UserOutputAuthType} from "../types/users/output";
import {UsersRepository} from "../repositories/users-repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {AuthOutputType} from "../types/auth/otput";
import {UsersDomain} from "./users-domain";
import {EmailAdapter} from "../adapters/email-adapter";
import {add} from "date-fns/add";
import {btoa} from "buffer";
import {v4 as uuidv4} from "uuid";
import {RefreshTokenRepositoty} from "../repositories/refresh-token-repositoty";

dotenv.config();

const secretKey = {
    accessToken: process.env.ACCESS_TOKEN_SECRET_KEY!,
    refreshToken: process.env.ACCESS_TOKEN_SECRET_KEY!
};

export class AuthService {

    static async loginUser(loginOrEmail: string, password: string): Promise<AuthOutputType | null> {

        const user:UserOutputAuthType|null = await UsersRepository.getUserByLoginOrEmail(loginOrEmail);
        if (!user) return null;

        const isSuccess = await bcrypt.compare(password, user.hash);
        if (!isSuccess) return null;

        const accessToken = this._createNewAccessToken(user.id);
        const refreshToken = this._createNewRefreshToken(user.id);
        return {accessToken: accessToken,refreshToken: refreshToken}

    }



    static async getUserIdByToken(token:string):Promise<string|null>{
        try {
            const result:any = jwt.verify(token, secretKey.accessToken);
            return result.userId
        }catch (err){
            return null
        }
    }

    static async registerUser(login: string, email: string, password: string) {

        await UsersDomain.createUser(login, email, password);
        const createdUser = await UsersRepository.getUserByLoginOrEmail(email);
        if (!createdUser) return false;
        const isEmailSent = await EmailAdapter.sendEmailConfirmationEmail(createdUser);
        if (!isEmailSent) {
            await UsersRepository.deleteUser(createdUser.id);
            return false;
        }
        return true;
    }

    static async refreshEmailConfirmationCode(email: string) {
        const newConfirmationCode = this._createConfirmationCode(email);
        const isUserUpdated = await UsersDomain.updateUserEmailConfirmationCode( email, newConfirmationCode);
        if (!isUserUpdated) return false;
        const user = await UsersRepository.getUserByCustomKey("email", email);
        if (!user) return false;
        return await EmailAdapter.reSendEmailConfirmationEmail(user);
    }

    static async confirmEmail(confirmationCode: string) {

        const receiptedCode = this._confirmationCodeToData(confirmationCode);
        if (!receiptedCode) return false;

        const user = await UsersRepository.getUserByLoginOrEmail(receiptedCode.userEmail)

        if (!user) return false;
        if (user.emailConfirmation.isConfirmed) return false;
        if (confirmationCode !== user.emailConfirmation.confirmationCode) return false;

        const userCode = this._confirmationCodeToData(user.emailConfirmation.confirmationCode);

        if (receiptedCode.expirationDate < new Date().toISOString()) return false;

        const isConfirmed = await UsersDomain.updateUserEmailConfirmationStatus(user.id);

        return isConfirmed;
    }

    static _confirmationCodeToData(code: string) {
        try{
            const mappedCode = code.split(":").map(el => atob(el));
            return {
                confirmationCode: mappedCode[0],
                userEmail: mappedCode[1],
                expirationDate: mappedCode[2]
            }
        } catch (err){
            return null
        }
    }

    static _createConfirmationCode(email: string, lifeTime: {} = {hours: 48}) {
        const confirmationCodeExpiration = add(new Date, lifeTime).toISOString()
        return `${btoa(uuidv4())}:${btoa(email)}:${btoa(confirmationCodeExpiration)}`
    }

    static _createNewAccessToken(userId:string){
        return jwt.sign({userId:userId}, secretKey.accessToken, {expiresIn: "10s"});
    }
    static  _createNewRefreshToken(userId:string){
        return jwt.sign({userId:userId}, secretKey.refreshToken, {expiresIn: "20s"});
    }

}
