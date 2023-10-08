import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v4 } from 'uuid'

import { SECRET_KEY } from '@config'
import { AdminModel, Organization, OrganizationModel } from '@/models'
import { admin, errors } from '@/types'
import { revokeToken } from '@utils/blacklist'
import { getInstallInfo } from '@utils/version'
import { update } from '@services/space'

export async function register(username: string, password: string, name: string): Promise<void> {
    return await AdminModel.saveAdmin(username, password, name)
}

export async function login(username: string, password: string): Promise<admin.adminLoginResponse> {
    const admin = await AdminModel.findByUsername(username)
    if (!admin) {
        throw new errors.AdminNotFoundException()
    }

    if (!bcrypt.compareSync(password, admin.password)) {
        throw new errors.AuthenticationFailedException()
    }

    if (!admin.hasApproved) {
        throw new errors.AdminNotApprovedException()
    }
    AdminModel.updateOne({ _id: admin._id }, { lastLoggedIn: new Date() })
    // 현재는 대칭키 방식으로 암호화된 토큰 발행
    const accessToken: string = jwt.sign({ id: admin._id, username: admin.username }, SECRET_KEY, {
        expiresIn: '1h',
        jwtid: v4(), // replay attack 방지, 추후 token revoke 위함
    })
    return { token: accessToken }
}

export function logout(jwt: string): void {
    revokeToken(jwt)
}

export async function approve(request: admin.adminApproveRequest) {
    await AdminModel.updateOne({ username: request.username }, { hasApproved: true, approvedAt: new Date() })
}

export async function versionUpdate(organization: Organization, version: string) {
    const installInfo = getInstallInfo(version)
    await update(organization, installInfo)
    organization.version = installInfo.version
    await new OrganizationModel(organization).save()
}
