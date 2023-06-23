import { getAccessToken, sendChannelMessage } from '@services/space'
import { AccessToken, OrganizationSecret } from '@types/space'
import { Orbit, Organization } from '@/models'

export default class Messenger {
    public async handler(arg: Orbit) {
        // 실제로 사용자에게 메시지를 전송하는 부분
        const { organization } = { organization: arg.organization } as { organization: Organization }
        const secret: OrganizationSecret = {
            serverUrl: organization.serverUrl,
            clientId: organization.clientId,
            clientSecret: organization.clientSecret,
        }
        const tokenInfo: AccessToken = await getAccessToken(secret)
        tokenInfo.access_token = `Bearer ${tokenInfo.access_token}`
        await sendChannelMessage(organization, tokenInfo.access_token, arg.channelName, arg.message)

        // 다음 메세지 큐에 들어가는 element를 선별하기 위함
        await arg.updateNextExecutionTime()
    }
}
