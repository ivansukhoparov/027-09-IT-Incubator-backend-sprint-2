import {UserOutputType, UserType} from "../types/users/output";
import {usersCollection} from "../db/db-collections";
import {ObjectId} from "mongodb";
import {userMapper, userMapperWithPassword} from "../types/users/mapper";


export class UsersRepository {

    static async getUserById(id: string): Promise<UserOutputType | null> {
        try {
            const user = await usersCollection.findOne({_id: new ObjectId(id)});
            if (!user || user.deleted) return null;
            return userMapper(user);
        } catch (err) {
            return null;
        }
    }

    static async getUserByLoginOrEmail(loginOrEmail: string) {
        try {
            const searchKey = {
                $and: [
                    {deleted: false},
                    {$or: [{login: loginOrEmail}, {email: loginOrEmail}]}
                ]
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

    /*
      this old version really delete user from DB
    static async deleteUser(id: string) {
           try {
            const result = await usersCollection.deleteOne({_id: new ObjectId(id)});
            return result.deletedCount === 1
        } catch (err) {
            return false
        }
    }
    */

    static async deleteUser(id: string) {
        try {
            const result = await usersCollection.deleteOne({_id: new ObjectId(id)});
            return result.deletedCount === 1;
        } catch (err) {
            return false
        }
    }
}
