import {NextFunction, Request, Response} from "express";
import {PostsQueryRepository} from "../../repositories/posts-query-repository";
import {HTTP_STATUSES} from "../../utils/comon";
import {Params, RequestWithParams} from "../../types/common";

export const validatePost = async (req: RequestWithParams<Params>, res:Response, next:NextFunction)=>{
    const post = await PostsQueryRepository.getPostById(req.params.id);
    if (!post) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    next();
}
