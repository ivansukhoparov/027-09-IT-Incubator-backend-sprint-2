import {SearchUsersRepositoryType, SortUsersRepositoryType} from "../types/users/input";
import {blogCollection, usersCollection} from "../db/db-collections";
import {WithId} from "mongodb";
import {BlogType} from "../types/blogs/output";
import {blogMapper} from "../types/blogs/mapper";
import {usersRouter} from "../routers/users-router";
import {UserType} from "../types/users/output";
import {userMapper} from "../types/users/mapper";


export class UsersQueryRepository{

    static async getAllUsers(sortData:SortUsersRepositoryType, searchData:SearchUsersRepositoryType){
        let searchKey = {};
        let sortKey = {};
        let sortDirection: number;

        // check if have searchNameTerm create search key
        if (searchData.searchLoginTerm) searchKey = {name: {$regex: searchData.searchLoginTerm, $options: "i"}};
        if (searchData.searchEmailTerm) searchKey = {name: {$regex: searchData.searchEmailTerm, $options: "i"}};

        // calculate limits for DB request
        const documentsTotalCount = await usersCollection.countDocuments(searchKey); // Receive total count of blogs
        const pageCount = Math.ceil(documentsTotalCount / +sortData.pageSize); // Calculate total pages count according to page size
        const skippedDocuments = (+sortData.pageNumber - 1) * +sortData.pageSize; // Calculate count of skipped docs before requested page

        // check if sortDirection is "desc" assign sortDirection value -1, else assign 1
        if (sortData.sortDirection === "desc") sortDirection = -1;
        else sortDirection = 1;

        // check if have fields exists assign the same one else assign "createdAt" value
        if (sortData.sortBy === "description") sortKey = {description: sortDirection};
        else if (sortData.sortBy === "websiteUrl") sortKey = {websiteUrl: sortDirection};
        else if (sortData.sortBy === "name") sortKey = {name: sortDirection};
        else if (sortData.sortBy === "isMembership") sortKey = {isMembership: sortDirection};
        else sortKey = {createdAt: sortDirection};

        // Get documents from DB
        const users: WithId<UserType>[] = await usersCollection.find(searchKey).sort(sortKey).skip(+skippedDocuments).limit(+sortData.pageSize).toArray();

        return {
            pagesCount: pageCount,
            page: +sortData.pageNumber,
            pageSize: +sortData.pageSize,
            totalCount: documentsTotalCount,
            items: users.map(userMapper)
        }

    }
}
