export type UsersViewModelType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: UserOutputType[]
}

export type UserOutputType = {
    id: string
    login: string
    email: string
    createdAt: string
}


export type UserType = {
    login: string
    email: string
    salt: string
    hash: string
    createdAt: string
}
