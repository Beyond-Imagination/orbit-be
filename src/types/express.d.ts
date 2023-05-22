declare global {
    namespace Express {
        interface Request {
            _routeWhitelists: string[]
            _routeBlacklists: string[]
        }
        interface Response {
            error: Error
        }
    }
}
