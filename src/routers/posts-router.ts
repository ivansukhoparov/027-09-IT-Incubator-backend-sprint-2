import {Router, Request, Response} from "express";
import {
    Params,
    RequestWithBody,
    RequestWithBodyAndParams,
    RequestWithParams,
    RequestWithSearchTerms
} from "../types/common";
import {basicAuthorizationMiddleware} from "../middlewares/auth/auth-middleware";
import {HTTP_STATUSES} from "../utils/comon";
import {PostsRepository} from "../repositories/posts-repository";
import {CreatePostDto, QueryPostRequestType, SortPostRepositoryType, UpdatePostDto} from "../types/posts/input";
import {validationPostsChains} from "../middlewares/validators/posts-validators";
import {inputValidationMiddleware} from "../middlewares/validators/input-validation-middleware";
import {PostsQueryRepository} from "../repositories/posts-query-repository";

export const postsRouter = Router();

postsRouter.get("/", async (req: RequestWithSearchTerms<QueryPostRequestType>, res: Response) => {

    const sortData: SortPostRepositoryType = {
        sortBy: req.query.sortBy || "createdAt",
        sortDirection: req.query.sortDirection || "desc",
        pageNumber: req.query.pageNumber || 1,
        pageSize: req.query.pageSize || 10
    }

    const posts = await PostsQueryRepository.getAllPosts(sortData);
    res.status(HTTP_STATUSES.OK_200).json(posts);
})

postsRouter.get("/:id", async (req: RequestWithParams<Params>, res: Response) => {
    const post = await PostsQueryRepository.getPostById(req.params.id);
    if (post) {
        res.status(HTTP_STATUSES.OK_200).json(post);
        return
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
})

postsRouter.post('/', basicAuthorizationMiddleware, validationPostsChains(), inputValidationMiddleware, async (req: RequestWithBody<CreatePostDto>, res: Response) => {
    const creatData = req.body;
    const postID = await PostsRepository.createPost(creatData);
    if (postID) {
        const newPost = await PostsRepository.getPostById(postID);

        if (newPost) {
            res.status(HTTP_STATUSES.CREATED_201).json(newPost);
            return
        }
    }
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})

postsRouter.put("/:id", basicAuthorizationMiddleware, validationPostsChains(), inputValidationMiddleware, async (req: RequestWithBodyAndParams<Params, UpdatePostDto>, res: Response) => {
    const updateData = req.body;
    const isUpdated = await PostsRepository.updatePost(req.params.id, updateData);
    if (isUpdated) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        return
    }
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
})

postsRouter.delete("/:id", basicAuthorizationMiddleware, async (req: RequestWithParams<Params>, res: Response) => {
    const isDeleted = await PostsRepository.deletePost(req.params.id);
    if (isDeleted) res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    else res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
})
