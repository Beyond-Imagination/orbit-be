export interface InitPayload {
    className: string
    clientId: string
    clientSecret: string
    serverUrl: string
    state: string
    userId: string
}

export interface ChangeServerUrlPayload {
    className: string
    clientId: string
    newServerUrl: string
}

export interface ApplicationUninstalledPayload {
    className: string
    clientId: string
    serverUrl: string
}

export interface ListCommandsPayload {
    className: string
    accessToken: string
    verificationToken: string
    userId: string
    serverUrl: string
    clientId: string
    orgId: string
}

export interface MessagePayload {
    className: 'MessagePayload'
    message: {
        messageId: string
        channelId: string
        messageData?: any
        body: {
            className: 'ChatMessage.Text'
            text: string
        }
        attachments?: any
        externalId?: any
        createdTime: string
    }
    clientId: string
    userId: string
    verificationToken: any
}
