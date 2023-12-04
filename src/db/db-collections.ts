import {client} from "./db";
import {BlogType} from "../types/blogs/output";
import {PostType} from "../types/posts/output";
import {VideoType} from "../types/videos/output";


export const dbBlogs = client.db("node-blogs");

export const blogCollection = dbBlogs.collection<BlogType>("blogs");
export const postCollection = dbBlogs.collection<PostType>("post");
export const videosCollection = dbBlogs.collection<VideoType>("videos");
