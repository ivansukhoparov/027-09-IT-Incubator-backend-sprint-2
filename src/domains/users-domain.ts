import {CreateUserType} from "../types/users/input";
import {UserOutputType, UserType} from "../types/users/output";
import {UsersRepository} from "../repositories/users-repository";



export class UsersDomain {
    static async createUser(createData: CreateUserType):Promise<UserOutputType|null> {
        const createdAt = new Date().toISOString();
        const salt = "va3df3";

        const hash = await this._createHash(createData.password, salt);

        const newUser: UserType = {
            login: createData.login,
            email: createData.email,
            salt: salt,
            hash: hash,
            createdAt: createdAt
        }

        const newUserId = await UsersRepository.createUser(newUser);
        if (!newUserId) return null;

        const createdUser = await UsersRepository.getUserById(newUserId);
        if (!createdUser) return null;

        return createdUser;
    }

    static async _createHash(password: string, salt: string) {
        return password + salt;
    }
}
