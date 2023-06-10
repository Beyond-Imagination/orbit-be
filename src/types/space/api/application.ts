import { RSA } from 'jwk-to-pem'

export interface OrganizationSecret {
    clientId: string
    clientSecret: string
    serverUrl: string
}

export interface AccessToken {
    token_type: string
    expires_in: number
    access_token: string
    scope: string
}

export interface PublicKeys {
    keys: RSA[]
}
