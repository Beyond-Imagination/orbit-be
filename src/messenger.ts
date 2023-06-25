import { sendChannelMessage } from '@services/space'
import { Orbit, Organization } from '@/models'

export default class Messenger {
    public async handler(arg: Orbit) {
        // 실제로 사용자에게 메시지를 전송하는 부분
        const { organization } = { organization: arg.organization } as { organization: Organization }
        await sendChannelMessage(organization, arg.channelName, arg.message)

        // 다음 메세지 큐에 들어가는 element를 선별하기 위함
        await arg.updateNextExecutionTime()
    }
}
