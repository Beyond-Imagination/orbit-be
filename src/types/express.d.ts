import { Organization } from '@/models'
import { OrganizationSecret } from '@types/space'

declare global {
    namespace Express {
        interface Request {
            _routeWhitelists: string[]
            _routeBlacklists: string[]
            organization: Organization
            organizationSecret: OrganizationSecret
            bearerToken: string
        }
        interface Response {
            error: Error
        }
    }
}
