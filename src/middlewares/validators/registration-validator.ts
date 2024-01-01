
import {body} from "express-validator";
import {RequestWithBody} from "../../types/common";
import {NextFunction, Response} from "express";

import {HTTP_STATUSES} from "../../utils/comon";
import {RegistrationInfoType} from "../../types/auth/input";
import {UsersRepository} from "../../repositories/users-repository";


const loginValidator = body("login").trim().isString().notEmpty().isLength({min:3, max:30}).matches(new RegExp("^[a-zA-Z0-9_-]*$"));
const emailValidator= body("email").trim().notEmpty().isString().isLength({min:5, max:100});
const passwordValidator = body("password").trim().notEmpty().isString().isLength({min:6, max:20});
export const uniqueLoginOrEmail = async (req: RequestWithBody<RegistrationInfoType>, res:Response, next:NextFunction)=>{
    const userByLogin = await UsersRepository.getUserByLoginOrEmail(req.body.login);
    if (userByLogin){
        res.status(HTTP_STATUSES.BAD_REQUEST_400).json({
            errorsMessages: [{
                message: "Login already in use",
                field: "login"
            }]
        });
        return;
    }
    const userByEmail = await UsersRepository.getUserByLoginOrEmail(req.body.email);
    if (userByEmail) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).json({
            errorsMessages: [{
                message: "Email already in use",
                field: "email"
            }]
        });
        return;
    }
    next();
};

export const registrationValidationChain = () => [loginValidator,emailValidator,passwordValidator];
