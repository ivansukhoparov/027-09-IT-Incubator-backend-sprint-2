export type PostsViewModelType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: PostOutputType[]
}

export type PostOutputType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export type PostType = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

