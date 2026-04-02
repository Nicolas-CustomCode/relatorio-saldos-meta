export type FetchGroups = {
    id: string,
    subject: string,
    subjectTime: number,
    pictureUrl: string,
    size: number,
    creation: number,
    owner: string,
    restrict: boolean,
    announce: boolean,
    isCommunity: boolean,
    isCommunityAnnounce: boolean
}

export type dbBusinessMessaging = {
    id: string,
    business: string,
    phone: string,
    message: string,
    days: number[],
    format: string,
    active: boolean
}
