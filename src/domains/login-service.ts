import {UserAuthOutputType} from "../types/users/output";
import {UsersRepository} from "../repositories/users-repository";
import bcrypt from "bcrypt";

export class LoginService{
    static async authUser(loginOrEmail:string, password:string){
        const user:UserAuthOutputType|null = await UsersRepository.getUserByLoginOrEmail(loginOrEmail);
        if (!user) return false;
        return bcrypt.compare(password,user.hash);
    }
}
