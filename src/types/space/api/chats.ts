export interface ChatMessage {
    channel: string
    content: ChatMessageText
}

export interface ChatMessageText {
    className: 'ChatMessage.Text'
    text: string
}
