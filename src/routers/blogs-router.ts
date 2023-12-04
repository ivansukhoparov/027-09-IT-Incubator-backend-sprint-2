import {Router, Request, Response} from "express";
import {BlogsRepository} from "../repositories/blogs-repository";
import {
    Params,
    RequestWithBody,
    RequestWithBodyAndParams,
    RequestWithParams,
    RequestWithSearchTerms, RequestWithSearchTermsAndParams
} from "../types/common";
import {
    CreateBlogDto,
    QueryBlogRequestType,
    SearchBlogRepositoryType,
    SortBlogRepositoryType,
    UpdateBlogDto
} from "../types/blogs/input";
import {inputValidationMiddleware} from "../middlewares/validators/input-validation-middleware";
import {validationBlogsChains} from "../middlewares/validators/blogs-validators";
import {basicAuthorizationMiddleware} from "../middlewares/auth/auth-middleware";
import {HTTP_STATUSES} from "../utils/comon";
import {BlogsQueryRepository} from "../repositories/blogs-query-repository";
import {validationPostsChains, validationPostsChainsNoBlogId} from "../middlewares/validators/posts-validators";
import {CreatePostDto, QueryPostRequestType, SortPostRepositoryType} from "../types/posts/input";
import {PostsQueryRepository} from "../repositories/posts-query-repository";
import {PostsRepository} from "../repositories/posts-repository";
import {PostOutputType} from "../types/posts/output";


export const blogsRouter = Router();

blogsRouter.get("/", async (req: RequestWithSearchTerms<QueryBlogRequestType>, res: Response) => {

    const query: QueryBlogRequestType = req.query

    const sortData: SortBlogRepositoryType = {
        sortBy: query.sortBy || "createdAt",
        sortDirection: query.sortDirection || "desc",
        pageNumber: query.pageNumber || 1,
        pageSize: query.pageSize || 10
    }
    const searchData: SearchBlogRepositoryType = {
        searchNameTerm: query.searchNameTerm || null
    }

    const blogs = await BlogsQueryRepository.getAllBlogs(sortData, searchData);
    if (!blogs) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return
    }
    res.status(HTTP_STATUSES.OK_200).json(blogs);
})

blogsRouter.get("/:id", async (req: RequestWithParams<Params>, res: Response) => {
    const blog = await BlogsRepository.getBlogById(req.params.id);
    if (blog) {
        res.status(HTTP_STATUSES.OK_200).json(blog);
        return
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
})

blogsRouter.get("/:id/posts", async (req: RequestWithSearchTermsAndParams<Params, QueryPostRequestType>, res: Response) => {

    const sortData: SortPostRepositoryType = {
        sortBy: req.query.sortBy || "createdAt",
        sortDirection: req.query.sortDirection || "desc",
        pageNumber: req.query.pageNumber || 1,
        pageSize: req.query.pageSize || 10
    }

    const posts = await PostsQueryRepository.getAllPosts(sortData, req.params.id,);
    if (posts.items.length < 1) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    res.status(HTTP_STATUSES.OK_200).json(posts);

})

blogsRouter.post('/',
    basicAuthorizationMiddleware,
    validationBlogsChains(),
    inputValidationMiddleware,
    async (req: RequestWithBody<CreateBlogDto>, res: Response) => {
        const creatData = req.body;
        const blogID = await BlogsRepository.createBlog(creatData);
        const newBlog = await BlogsRepository.getBlogById(blogID);
        if (newBlog) {
            res.status(HTTP_STATUSES.CREATED_201).json(newBlog);
            return
        }
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    })

blogsRouter.post("/:id/posts",
    basicAuthorizationMiddleware,
    validationPostsChainsNoBlogId(),
    inputValidationMiddleware,
    async (req: RequestWithBodyAndParams<Params, CreatePostDto>, res: Response) => {
        const blogId = req.params.id;
        const createData = req.body;
        const newPostId = await PostsRepository.createPostToBlog(blogId, createData);

        if (!newPostId) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        const createdPost = await PostsQueryRepository.getPostById(newPostId);
        res.status(HTTP_STATUSES.CREATED_201).json(createdPost)
    })

blogsRouter.put("/:id",
    basicAuthorizationMiddleware,
    validationBlogsChains(),
    inputValidationMiddleware,
    async (req: RequestWithBodyAndParams<Params, UpdateBlogDto>, res: Response) => {
        const updateData = req.body;
        const isUpdated = await BlogsRepository.updateBlog(req.params.id, updateData);
        if (isUpdated) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
            return
        }
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    })

blogsRouter.delete("/:id",
    basicAuthorizationMiddleware,
    async (req: RequestWithParams<Params>, res: Response) => {
        const isDeleted = await BlogsRepository.deleteBlog(req.params.id);
        if (isDeleted) res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        else res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    })
