import {commentsCollection} from "../db/db-collections";
import {ObjectId} from "mongodb";
import {commentMapper} from "../types/comments/mapper";

export class CommentsQueryRepository {
    static async getAllCommentsByPostId(postId: string) {

    }

    static async getCommentById(commentId: string) {
        try {
            const comment = await commentsCollection.findOne({_id: new ObjectId(commentId)});
            if (comment) return commentMapper(comment);
            else return null;
        }catch (err){
            return null;
        }
    }
}

