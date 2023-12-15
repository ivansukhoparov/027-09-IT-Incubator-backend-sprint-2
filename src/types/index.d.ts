import {UserOutputType, UserType} from "./users/output";

declare global {
    namespace Express {
        export interface Request {
            user: UserOutputType
        }
    }
}
