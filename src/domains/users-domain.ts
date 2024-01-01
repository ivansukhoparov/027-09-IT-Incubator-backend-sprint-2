import {UserOutputType, UserType} from "../types/users/output";
import {UsersRepository} from "../repositories/users-repository";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid";
import {add} from "date-fns/add"
import {btoa} from "buffer";
import {usersCollection} from "../db/db-collections";
import {ObjectId} from "mongodb";

export class UsersDomain {
    static async createUser(login: string, email: string, password: string, isConfirmed:boolean = false): Promise<UserOutputType | null> {
        const createdAt = new Date().toISOString();
        const hash = await bcrypt.hash(password, 10);
        const confirmationCodeExpiration = add(new Date, {minutes: 580}).toISOString()
        const confirmationCode = `${btoa(uuidv4())}:${btoa(login)}:${btoa(confirmationCodeExpiration)}`
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

    static async updateUserEmailConfirmationStatus (userId:string){
       try {
            const isUpdated = await usersCollection.updateOne({_id: new ObjectId(userId)}, {$set: {"emailConfirmation.isConfirmed": true}});
            return isUpdated.matchedCount===1;
        }catch (err){
           return false
       }
    }
}
