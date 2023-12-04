import {WithId} from "mongodb";
import {UserOutputType, UserType} from "./output";

export const userMapper = (user: WithId<UserType>): UserOutputType => {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}
