import express from "express";
import {videosRouter} from "./routers/videos-router";
import {testingRouter} from "./routers/testing-router";
import {blogsRouter} from "./routers/blogs-router";
import {postsRouter} from "./routers/posts-router";
import bodyParser from "body-parser";
import {authRouter} from "./routers/auth-router";
import {usersRouter} from "./routers/users-router";

export const app = express();

app.use(express.json());
app.use(bodyParser());
app.use("/testing", testingRouter);

app.use("/videos", videosRouter);
app.use("/blogs", blogsRouter);
app.use("/posts", postsRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);
