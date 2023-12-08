import {WithId} from "mongodb";
import {UserAuthOutputType, UserOutputType, UserType} from "./output";

export const userMapper = (user: WithId<UserType>): UserOutputType => {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}

export const userMapperWithPassword = (user: WithId<UserType>): UserAuthOutputType => {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
        hash:user.hash,
        deleted: user.deleted
    }
}
