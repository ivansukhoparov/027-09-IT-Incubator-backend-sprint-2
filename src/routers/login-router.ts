import {Router, Request, Response} from "express";
import {RequestWithBody} from "../types/common";
import {AuthType} from "../types/login/input";
import {LoginService} from "../domains/login-service";
import {HTTP_STATUSES} from "../utils/comon";

export const loginRouter=Router();

loginRouter.get("/", async (req:RequestWithBody<AuthType>,res:Response)=>{
    const authData:AuthType = {
        loginOrEmail:req.body.loginOrEmail,
        password:req.body.password
    }
    const isSuccessful= await LoginService.authUser(authData.loginOrEmail,authData.password);
    if (!isSuccessful){
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        return
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
})
