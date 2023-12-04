import {BlogOutputType} from "./blogs/output";
import {PostOutputType} from "./posts/output";
import {UserOutputType} from "./users/output";

export type ViewModelType<R> = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: R[]
}
