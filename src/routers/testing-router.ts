import {Router, Request, Response} from "express";

import {blogCollection, dbBlogs, postCollection, videosCollection} from "../db/db-collections";

export const testingRouter = Router()

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
    await blogCollection.deleteMany({});
    await postCollection.deleteMany({});
    await videosCollection.deleteMany({});
    res.sendStatus(204);
})
