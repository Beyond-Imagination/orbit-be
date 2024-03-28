import { installInfo } from '@/types'
import { CLIENT_URL } from '@/config'

import v040 from '@/utils/version/v0.4.0'

const data: installInfo = {
    version: '0.5.0',
    uiExtension: {
        contextIdentifier: v040.uiExtension.contextIdentifier,
        extensions: [
            ...v040.uiExtension.extensions,
            {
                className: 'TopLevelPageUiExtensionIn',
                displayName: 'Orbit',
                uniqueCode: 'Orbit',
                iframeUrl: CLIENT_URL,
            },
            {
                className: 'GettingStartedUiExtensionIn',
                gettingStartedUrl: '',
                gettingStartedTitle: 'go to Orbit',
            },
        ],
    },
    right: v040.right,
}

export default data
