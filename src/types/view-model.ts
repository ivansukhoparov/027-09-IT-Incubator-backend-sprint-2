import {BlogOutputType} from "./blogs/output";
import {PostOutputType} from "./posts/output";
import {UserOutputType} from "./users/output";

type ViewModelType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
}

export type BlogViewModelType = ViewModelType & { items: BlogOutputType[] }

export type PostsViewModelType = ViewModelType & { items: PostOutputType[] }

export type UsersViewModelType = ViewModelType & { items: UserOutputType[] }
