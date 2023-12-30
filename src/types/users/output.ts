export type UserOutputType = {
    id: string
    login: string
    email: string
    createdAt: string
}

export type UserAuthOutputType = {
    id: string
    login: string
    email: string
    createdAt: string
    hash: string

}

export type UserType = {
    login: string
    email: string
    hash: string
    createdAt: string

}

export type UserOutputMeType = {
    email: string
    login: string
    userId: string
}
