import { Organization } from '@/models'
import { AddCommandBody, OrganizationSecret } from '@types/space'

declare global {
    namespace Express {
        interface Request {
            _routeWhitelists: { body: string[] }
            _routeBlacklists: { body: string[] }
            organization: Organization
            organizationSecret: OrganizationSecret
            bearerToken: string
            command: AddCommandBody
        }
        interface Response {
            meta: {
                requestId: string
                path?: string
                error?: Error
            }
        }
    }
}
