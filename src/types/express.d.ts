import { Admin, Organization } from '@/models'
import { AddCommandBody, IOrganizationSecret, Profile } from '@/types/space'
import { AdminJWTPayload } from '@/types/admin'

declare global {
    namespace Express {
        interface Request {
            _routeWhitelists: { body: string[] }
            _routeBlacklists: { body: string[] }
            organization: Organization
            organizationSecret: IOrganizationSecret
            command: AddCommandBody
            user: Profile
            admin: Admin
            jwtPayload: AdminJWTPayload
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
