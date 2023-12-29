import {Router, Request, Response} from "express";
import {emailAdapter} from "../adapters/email-adapter";



//export const mongoUri = process.env.MONGO_URL

export const emailRouter = Router();

emailRouter.post("/", async (req:Request, res:Response)=> {
const result = await emailAdapter.sendEmail(req.body.email,req.body.subject,req.body.message);
res.json(result);
})
