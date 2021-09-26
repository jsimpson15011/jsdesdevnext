export type tag = {
    _id: string,
    title: string,
    isActive: boolean,
    isVisible: boolean
}

export type project = {
    backgroundImage?: string,
    description?: string,
    externalUrl?: string,
    isVisible?: boolean,
    mainImage?: string,
    subTitle?: string,
    tags?: {
        title: string,
        _id: string
    }[],
    title?: string,
    _id: string,
}