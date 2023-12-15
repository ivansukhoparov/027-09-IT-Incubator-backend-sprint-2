export type OutputCommentType = {
    id: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    }
    createdAt: string
}

export type CommentType = {
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    }
    createdAt: string
}
