import {CommentType} from "../types/comments/output";
import {commentsCollection} from "../db/db-collections";
import {ObjectId} from "mongodb";

export class CommentsRepository{
    static async addNewComment(newComment:CommentType):Promise<string|null>{
        try{
            const result = await commentsCollection.insertOne(newComment);
            return result.insertedId.toString();
        }catch (err){
            return null;
        }
    }

    static async deleteCommentById(commentId:string){
        try {
            const result = await commentsCollection.deleteOne({_id:new ObjectId(commentId)});
            return result.deletedCount === 1;
        }catch (err){
            return null
        }
    }
}

