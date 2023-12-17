import {CommentType} from "../types/comments/output";
import {commentsCollection} from "../db/db-collections";

export class CommentsRepository{
    static async addNewComment(newComment:CommentType):Promise<string|null>{
        try{
            const result = await commentsCollection.insertOne(newComment);
            return result.insertedId.toString();
        }catch (err){
            return null;
        }
    }

}

