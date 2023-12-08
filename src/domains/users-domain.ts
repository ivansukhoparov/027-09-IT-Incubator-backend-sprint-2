import {CreateUserType} from "../types/users/input";
import {UserOutputType, UserType} from "../types/users/output";
import {UsersRepository} from "../repositories/users-repository";
import bcrypt from "bcrypt";


export class UsersDomain {
    static async createUser(createData: CreateUserType): Promise<UserOutputType | null> {
        const createdAt = new Date().toISOString();
        const hash = await bcrypt.hash(createData.password, 10);

        const newUser: UserType = {
            login: createData.login,
            email: createData.email,
            hash: hash,
            createdAt: createdAt
        }

        const newUserId = await UsersRepository.createUser(newUser);
        if (!newUserId) return null;

        const createdUser = await UsersRepository.getUserById(newUserId);
        if (!createdUser) return null;

        return createdUser;
    }
}
