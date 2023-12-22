import {Response, Router} from "express";
import {Params, RequestWithParams} from "../types/common";
import {CommentsQueryRepository} from "../repositories/comments-query-repository";
import {HTTP_STATUSES} from "../utils/comon";
import {CommentsRepository} from "../repositories/comments-repository";
import {accessRight, bearerAuthorizationMiddleware} from "../middlewares/auth/auth-middleware";

export const commentsRouter = Router();

commentsRouter.get("/:id", async (req: RequestWithParams<Params>, res: Response) => {
    const comment = await CommentsQueryRepository.getCommentById(req.params.id);
    if (!comment) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.status(HTTP_STATUSES.OK_200).json(comment);
})

commentsRouter.delete("/:id", bearerAuthorizationMiddleware, accessRight, async (req: RequestWithParams<Params>, res: Response) => {
    const isDeleted = await CommentsRepository.deleteCommentById(req.params.id);
    if (isDeleted === null) {
        res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500);
        return;
    }
    if (!isDeleted) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
})
