

export type BlogViewModelType={
     pagesCount : number
     page : number
     pageSize : number
     totalCount : number
     items :BlogOutputType[]
}

export type BlogOutputType ={
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export type BlogType ={
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}
