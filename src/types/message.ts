export type TMessage = {
    messageId?: number
    channelId: number
    senderId: number
    message: string
    isDeleted?: boolean
    created?: string
    updated?: string
}