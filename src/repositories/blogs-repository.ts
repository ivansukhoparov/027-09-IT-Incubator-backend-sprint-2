import {BlogType, BlogOutputType} from "../types/blogs/output";
import {CreateBlogDto, UpdateBlogDto} from "../types/blogs/input";
import {client} from "../db/db";
import {ObjectId, WithId} from "mongodb";
import {blogMapper} from "../types/blogs/mapper";
import {blogCollection, postCollection} from "../db/db-collections";
import {CreatePostDto} from "../types/posts/input";
import {PostOutputType, PostType} from "../types/posts/output";
import {PostsRepository} from "./posts-repository";

export class BlogsRepository {

    // return all blogs from database
    static async getAllBlogs() {
        const blogs: WithId<BlogType>[] = await blogCollection.find({}).toArray();
        return blogs.map(blogMapper)
    };

    // return one blog by id
    static async getBlogById(id: string): Promise<BlogOutputType | null> {
        try {
            const blog: WithId<BlogType> | null = await blogCollection.findOne({_id: new ObjectId(id)});
            if (!blog) {
                return null;
            }
            return blogMapper(blog)
        } catch (err) {
            return null;
        }
    }

    // create new blog
    static async createBlog(data: CreateBlogDto) {
        const createdAt = new Date();
        const newBlog: BlogType = {
            ...data,
            createdAt: createdAt.toISOString(),
            isMembership: false
        }
        const result = await blogCollection.insertOne(newBlog)
        return result.insertedId.toString();

    }

    // update existing blog
    static async updateBlog(id: string, data: UpdateBlogDto) {

        const result = await blogCollection.updateOne({_id: new ObjectId(id)},
            {
                $set:
                    {
                        name: data.name,
                        description: data.description,
                        websiteUrl: data.websiteUrl
                    }
            }
        );

        return result.matchedCount === 1;
    }

    //delete blog
    static async deleteBlog(id: string) {
        try {
            const result = await blogCollection.deleteOne({_id: new ObjectId(id)});

            return result.deletedCount === 1;
        } catch (err) {
            return false;
        }

    }
}

