export interface Commands {
    commands: {
        name: string
        description: string
    }[]
}

export interface AddCommandBody {
    channelName: string
    cron: string
    message: string
}
