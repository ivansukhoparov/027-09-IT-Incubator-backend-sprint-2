import {compareSync} from "bcrypt";
import {CommentType} from "../types/comments/output";
import {UsersQueryRepository} from "../repositories/users-query-repository";
import {UsersRepository} from "../repositories/users-repository";

export class CommentsService{

    static async createComment(postId:string, content:string){

        const user = UsersRepository.getUserById("id")
        const newComment:CommentType={
            content:content,
            postId:postId,
            commentatorInfo:{
                userId:"id",
                userLogin:"login"
            },
            createdAt:"data"
        }
    }
}
