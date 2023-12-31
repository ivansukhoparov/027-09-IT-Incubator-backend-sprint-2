import {UserOutputType, UserType} from "../types/users/output";
import {UsersRepository} from "../repositories/users-repository";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid";
import {add} from "date-fns/add"

export class UsersDomain {
    static async createUser(login: string, email: string, password: string, isConfirmed:boolean = false): Promise<UserOutputType | null> {
        const createdAt = new Date().toISOString();
        const hash = await bcrypt.hash(password, 10);
        const confirmationCodeExpiration = add(new Date, {minutes: 580})
        const confirmationCode = `${uuidv4}:${login}:${confirmationCodeExpiration}`
        const newUser: UserType = {
            login: login,
            email: email,
            hash: hash,
            createdAt: createdAt,
            emailConfirmation: {
                confirmationCode: confirmationCode,
                isConfirmed: isConfirmed
            }
        }

        const newUserId = await UsersRepository.createUser(newUser);
        if (!newUserId) return null;

        const createdUser = await UsersRepository.getUserById(newUserId);
        if (!createdUser) return null;

        return createdUser;
    }


}
