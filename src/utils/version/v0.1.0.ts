import { installInfo } from '@/types'

const data: installInfo = {
    version: '0.1.0',
    uiExtension: {
        contextIdentifier: 'global',
        extensions: [
            {
                className: 'ChatBotUiExtensionIn',
            },
        ],
    },
    right: {
        contextIdentifier: 'global',
        rightCodes: ['Channel.PostMessages'],
    },
}

export default data
