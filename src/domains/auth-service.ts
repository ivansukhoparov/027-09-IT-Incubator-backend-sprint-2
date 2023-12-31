import {UserOutputAuthType} from "../types/users/output";
import {UsersRepository} from "../repositories/users-repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {AuthOutputType} from "../types/auth/otput";
import {UsersDomain} from "./users-domain";
import {EmailAdapter} from "../adapters/email-adapter";

dotenv.config();
debugger;
const secretKey = "qwerty"
export class AuthService {
    static async loginUser(loginOrEmail: string, password: string): Promise<AuthOutputType | null> {
        const user:UserOutputAuthType|null = await UsersRepository.getUserByLoginOrEmail(loginOrEmail);
        if (!user) return null;

        const isSuccess = await bcrypt.compare(password, user.hash);
        if (!isSuccess) return null;

        const token = jwt.sign({userId: user.id}, secretKey, {expiresIn: "1d"});

        return {accessToken: token}
    }

    static async getUserIdByToken(token:string):Promise<string|null>{
        try {
            const result:any = jwt.verify(token, secretKey);
            return result.userId
        }catch (err){
            return null
        }
    }

    static async registerUser(login: string, email: string, password: string) {

        const created = await UsersDomain.createUser(login, email, password);
        const createdUser = await UsersRepository.getUserByLoginOrEmail(email);
        if (!createdUser) return false;
        const isEmailSent = await EmailAdapter.sendEmailConfirmationEmail(createdUser);
        if (!isEmailSent) {
            await UsersRepository.deleteUser(createdUser.id);
            return false;
        }
        return true;
    }
}
