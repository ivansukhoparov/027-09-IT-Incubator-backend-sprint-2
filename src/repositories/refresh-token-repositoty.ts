import {refreshTokensCollection} from "../db/db-collections";

export class RefreshTokenRepositoty{

    static async createNewToken(userId:string){
        const isSuccess = await refreshTokensCollection.insertOne({userId:userId});
        return isSuccess.insertedId.toString();
    }

    static async checkTokenIsExist(token:string){
        const isExist = await refreshTokensCollection.findOne({token:token});
        return !!isExist
    }
}

