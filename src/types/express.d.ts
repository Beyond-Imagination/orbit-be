import { Organization } from '@/models'
import { AddCommandBody, IOrganizationSecret, Profile } from '@/types/space'

declare global {
    namespace Express {
        interface Request {
            _routeWhitelists: { body: string[] }
            _routeBlacklists: { body: string[] }
            organization: Organization
            organizationSecret: IOrganizationSecret
            command: AddCommandBody
            user: Profile
        }
        interface Response {
            meta: {
                requestId: string
                path?: string
                method?: string
                error?: Error
            }
        }
    }
}
