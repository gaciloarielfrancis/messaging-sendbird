export type TMessage = {
    messageId?: number
    channelUrl: string
    senderId: string
    message: string
    isDeleted?: boolean
    created?: string
    updated?: string
}