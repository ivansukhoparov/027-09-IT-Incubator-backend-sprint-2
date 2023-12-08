import {CreateUserType} from "../types/users/input";
import {UserOutputType, UserType} from "../types/users/output";
import {usersRouter} from "../routers/users-router";
import {usersCollection} from "../db/db-collections";
import {ObjectId} from "mongodb";
import {userMapper, userMapperWithPassword} from "../types/users/mapper";
import {UsersDomain} from "../domains/users-domain";


export class UsersRepository {

    static async getUserById(id: string): Promise<UserOutputType | null> {
        try {
            const user = await usersCollection.findOne({_id: new ObjectId(id)});
            if (!user) return null;
            return userMapper(user);
        } catch (err) {
            return null;
        }
    }

    static async getUserByLoginOrEmail(loginOrEmail: string) {
        try {
            const searchKey = {
                $or: [{login: loginOrEmail}, {email: loginOrEmail}]
            };
            const user = await usersCollection.findOne(searchKey);
            if (!user) return null;

            return userMapperWithPassword(user);

        } catch (err) {
            return null;
        }
    }

    static async createUser(createData: UserType): Promise<string | null> {
        try {
            const result = await usersCollection.insertOne(createData);
            return result.insertedId.toString();
        } catch (err) {
            return null
        }
    }
}
