import {UserOutputType, UserType} from "../types/users/output";
import {UsersRepository} from "../repositories/users-repository";
import bcrypt from "bcrypt";


export class UsersDomain {
    static async createUser(login: string, email: string, password: string): Promise<UserOutputType | null> {
        const createdAt = new Date().toISOString();
        const hash = await bcrypt.hash(password, 10);

        const newUser: UserType = {
            login: login,
            email: email,
            hash: hash,
            createdAt: createdAt,
            deleted:false
        }

        const newUserId = await UsersRepository.createUser(newUser);
        if (!newUserId) return null;

        const createdUser = await UsersRepository.getUserById(newUserId);
        if (!createdUser) return null;

        return createdUser;
    }
}
