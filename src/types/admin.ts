export interface adminRegisterRequest {
    username: string
    password: string
    name: string
}

export interface adminLoginRequest {
    username: string
    password: string
}

export interface adminLogoutRequest {
    jwt: string
}

export interface adminLoginResponse {
    token: string
}

export interface organizationVersionUpdateRequest {
    serverUrl: string
    version: string
}
