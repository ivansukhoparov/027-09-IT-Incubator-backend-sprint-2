import {Router, Request, Response} from "express";
import {RequestWithBody, RequestWithSearchTerms} from "../types/common";
import {
    CreateUserType,
    QueryUsersRequestType,
    SearchUsersRepositoryType,
    SortUsersRepositoryType
} from "../types/users/input";
import {CreateBlogDto, SearchBlogRepositoryType, SortBlogRepositoryType} from "../types/blogs/input";
import {UsersQueryRepository} from "../repositories/users-query-repository";
import {UserOutputType} from "../types/users/output";
import {UsersDomain} from "../domains/users-domain";
import {HTTP_STATUSES} from "../utils/comon";
import {basicAuthorizationMiddleware} from "../middlewares/auth/auth-middleware";
import {usersValidationChain} from "../middlewares/validators/users-validators";
import {inputValidationMiddleware} from "../middlewares/validators/input-validation-middleware";

export const usersRouter = Router();

usersRouter.get("/", async (req: RequestWithSearchTerms<QueryUsersRequestType>, res: Response) => {
    const query: QueryUsersRequestType = req.query;

    const sortData: SortUsersRepositoryType = {
        sortBy: query.sortBy || "createdAt",
        sortDirection: query.sortDirection || "desc",
        pageNumber: query.pageNumber || 1,
        pageSize: query.pageSize || 10
    }
    const searchData: SearchUsersRepositoryType = {
        searchLoginTerm: query.searchLoginTerm || null,
        searchEmailTerm: query.searchEmailTerm || null
    }

    const users = await UsersQueryRepository.getAllUsers(sortData, searchData);

    res.json(users)
})

usersRouter.post("/", basicAuthorizationMiddleware, usersValidationChain(),inputValidationMiddleware,  async (req:RequestWithBody<CreateUserType>, res:Response)=>{
    const createData: CreateUserType = {
        login: req.body.login,
        email: req.body.email,
        password: req.body.password
    }
    const createdUser:UserOutputType|null = await UsersDomain.createUser(createData);
    if (!createdUser) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400);
        return
    }
    res.status(HTTP_STATUSES.CREATED_201).json(createdUser);
})


