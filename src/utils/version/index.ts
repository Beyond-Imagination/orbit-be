import { installInfo, errors } from '@/types'

import v010 from './v0.1.0'
import v030 from './v0.3.0'
import v040 from './v0.4.0'
import v050 from './v0.5.0'

const version = {
    '0.1.0': v010,
    '0.3.0': v030,
    '0.4.0': v040,
    '0.5.0': v050,
    latest: v050,
}

export function getInstallInfo(targetVersion = 'latest'): installInfo {
    if (targetVersion in version) {
        return JSON.parse(JSON.stringify(version[targetVersion]))
    }
    throw new errors.InvalidVersion()
}

export function gettingStartedUrl(serverUrl: string, applicationName: string, applicationId: string): string {
    return `/topLevelPageExtension/${applicationName}-${applicationId}-Orbit`
}
