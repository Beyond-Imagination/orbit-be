export interface Commands {
    commands: {
        name: string
        description: string
    }[]
}

export interface AddCommandBody {
    format: string
    channelName: string
    cron: string
    timezone: string
    message: string
}
