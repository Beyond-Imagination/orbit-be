import { Admin, AdminModel } from '@models/admin'
import bcrypt from 'bcrypt'
import { AdminNotFound, AdminNotPermitted, AuthenticationFailed } from '@types/errors/admin'
import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '@config'
import { v4 } from 'uuid'
import { revokeToken } from '@utils/blacklist'
import { adminLoginResponse } from '@types/admin'

export async function register(username: string, password: string, name: string): Promise<void> {
    return await Admin.saveAdmin(username, password, name)
}

export async function login(username: string, password: string): Promise<adminLoginResponse> {
    const admin = await AdminModel.findByUsername(username)
    if (!admin) {
        throw new AdminNotFound()
    }

    if (!bcrypt.compareSync(password, admin.password)) {
        throw new AuthenticationFailed()
    }

    if (!admin.hasApproved) {
        throw new AdminNotPermitted()
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
