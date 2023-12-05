import {Router, Request, Response} from "express";
import {RequestWithSearchTerms} from "../types/common";
import {QueryUsersRequestType, SearchUsersRepositoryType, SortUsersRepositoryType} from "../types/users/input";
import {SearchBlogRepositoryType, SortBlogRepositoryType} from "../types/blogs/input";
import {UsersQueryRepository} from "../repositories/users-query-repository";

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


