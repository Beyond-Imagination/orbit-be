import { Admin } from '@models/admin'

export async function register(username: string, password: string, name: string): Promise<void> {
    return await Admin.saveAdmin(username, password, name)
}
