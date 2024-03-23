export interface PostOrbitRequest {
    channelName: string
    format: string
    message: string
    cron: string
    weekly: {
        days: number[]
        time: string
    }
    timezone: string
}
