import {Request, Response, Router} from "express";
import {RequestWithBody} from "../types/common";
import {
    AuthType,
    EmailConfirmationCodeResendRequestType,
    EmailConfirmationCodeType,
    RegistrationInfoType
} from "../types/auth/input";
import {AuthService} from "../domains/auth-service";
import {HTTP_STATUSES} from "../utils/comon";
import {loginValidationChain} from "../middlewares/validators/auth-validators";
import {inputValidationMiddleware} from "../middlewares/validators/input-validation-middleware";
import {AuthorizationMiddleware} from "../middlewares/auth/auth-middleware";
import {
    isEmailConfirmed,
    registrationValidationChain,
    uniqueLoginOrEmail
} from "../middlewares/validators/registration-validator";


export const authRouter=Router();

authRouter.get("/me", AuthorizationMiddleware, async (req: Request, res: Response) => {
    const user = {
        login: req.user!.login,
        email: req.user!.email,
        userId: req.user!.id
    }
    res.status(HTTP_STATUSES.OK_200).json(user);
})

authRouter.post("/login",
    loginValidationChain(),
    inputValidationMiddleware,
    async (req: Request ,res: Response) => {

        const authData: AuthType = {
        loginOrEmail:req.body.loginOrEmail,
        password:req.body.password
    }
    const accessToken = await AuthService.loginUser(authData.loginOrEmail, authData.password);

    if (!accessToken) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        return
    }
    console.log(req.cookies)
        if (req.cookies.rt === "14") {
            res.status(200).json("already")
            return
        }
        res.cookie('rt', "14", {maxAge: 9000000 ,httpOnly: false, secure: false})
        res.setHeader("Access-Control-Allow-Origin",       " http://localhost:63342").status(HTTP_STATUSES.OK_200).json(accessToken);

})

authRouter.post("/logout",
    async (req: Request, res: Response) => {

    })

authRouter.post("/refresh-token",
    async (req: Request, res: Response) => {

    })

authRouter.post("/registration",
    registrationValidationChain(),
    uniqueLoginOrEmail,
    inputValidationMiddleware,
    async (req: RequestWithBody<RegistrationInfoType>, res: Response) => {

    const isSuccessful = await AuthService.registerUser(req.body.login, req.body.email, req.body.password);
    if (!isSuccessful) {
        res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500);
        return;
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
})

authRouter.post("/registration-confirmation",
    async (req: RequestWithBody<EmailConfirmationCodeType>, res: Response) => {
    const isConfirm = await AuthService.confirmEmail(req.body.code);
    if (!isConfirm) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).json({
            errorsMessages: [{
                message: "Invalid code or expiration date expired",
                field: "code"
            }]
        });
        return;
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
})

authRouter.post("/registration-email-resending",
    isEmailConfirmed,
    async (req: RequestWithBody<EmailConfirmationCodeResendRequestType>, res: Response) => {

        const isSendNewCode = await AuthService.refreshEmailConfirmationCode(req.body.email);
        if (!isSendNewCode) {
            res.status(HTTP_STATUSES.SERVER_ERROR_500);
            return;
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);

})


