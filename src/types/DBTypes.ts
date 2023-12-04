import {VideoType} from "./videos/output";
import {BlogOutputType} from "./blogs/output";
import {PostType} from "./posts/output";

export type DBType = {
    videos: VideoType[],
    blogs: BlogOutputType[],
    posts: PostType[]
}
