import {UserAuthOutputType} from "../types/users/output";
import {UsersRepository} from "../repositories/users-repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {AuthOutputType} from "../types/auth/otput";

dotenv.config();
const salt = process.env.SECRET_KEY!
export class AuthService {
    static async authUser(loginOrEmail: string, password: string): Promise<AuthOutputType | null> {
        const user:UserAuthOutputType|null = await UsersRepository.getUserByLoginOrEmail(loginOrEmail);
        if (!user) return null;

        const isSuccess = await bcrypt.compare(password, user.hash);
        if (!isSuccess) return null;

        const token = jwt.sign({userId: user.id}, salt, {expiresIn: "1h"});

        return {accessToken: token}
    }

}
