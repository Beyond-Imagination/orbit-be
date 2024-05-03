export interface PostOrbitRequest {
    channelName: string
    type: string
    message: string
    cron: string
    weekly: {
        days: number[]
        time: string
    }
    timezone: string
}
