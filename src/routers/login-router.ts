import {Router, Request, Response} from "express";

export const loginRouter=Router();

loginRouter.get("/", async (req:Request,res:Response)=>{
    res.json("please send login and password")
})
