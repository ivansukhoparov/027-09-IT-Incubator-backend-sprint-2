import {Router, Request, Response} from "express";

export const usersRouter = Router();

usersRouter.get("/", async (req:Request,res:Response)=>{
    res.json({"msg":"users"})
})
