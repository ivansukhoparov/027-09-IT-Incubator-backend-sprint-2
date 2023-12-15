import {Response, Router} from "express";
import {RequestWithBody} from "../types/common";
import {AuthType} from "../types/auth/input";
import {AuthService} from "../domains/auth-service";
import {HTTP_STATUSES} from "../utils/comon";
import {loginValidationChain} from "../middlewares/validators/auth-validators";
import {inputValidationMiddleware} from "../middlewares/validators/input-validation-middleware";


export const authRouter=Router();

authRouter.post("/login", loginValidationChain(), inputValidationMiddleware, async (req: RequestWithBody<AuthType>, res: Response) => {
    const authData:AuthType = {
        loginOrEmail:req.body.loginOrEmail,
        password:req.body.password
    }
    const accessToken= await AuthService.authUser(authData.loginOrEmail,authData.password);

    if (!accessToken) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        return
    }

    res.status(HTTP_STATUSES.OK_200).json(accessToken);
})
