import {NextFunction, Request, Response} from "express";
import {btoa} from "buffer";
import {HTTP_STATUSES} from "../../utils/comon";

const login = "admin";
const password = "qwerty";
const method = "Basic"
// middleware для проверки авторизации
export const basicAuthorizationMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.header("authorization")?.split(" "); // Получаем значение поля в заголовке
    const auth = btoa(`${login}:${password}`); // кодируем наши логин и пароль в basic64

    if (authHeader) {
        const authMethod = authHeader[0];
        const authInput = authHeader[1] // получаем значение Basic из заголовка}

        // сравниваем нашу пару логин:пароль закодированную в basic64 с парой, пришедшей в заголовке реквеста
        if (authInput === auth && authMethod === method) {
            // если пары равны переходим по цепочке дальше
            next();
        }else {
            // в противном случае отправляем ошибку 401
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        }
    } else {
        // в противном случае отправляем ошибку 401
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    }
}