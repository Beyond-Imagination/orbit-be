export interface uiExtension {
    contextIdentifier: string
    extensions: (ChatBotUiExtensionIn | ApplicationHomepageUiExtensionIn | TopLevelPageUiExtensionIn | GettingStartedUiExtensionIn)[]
}

export interface right {
    contextIdentifier: string
    rightCodes: string[]
}

export interface ChatBotUiExtensionIn {
    className: 'ChatBotUiExtensionIn'
}

export interface ApplicationHomepageUiExtensionIn {
    className: 'ApplicationHomepageUiExtensionIn'
    iframeUrl: string
}

export interface TopLevelPageUiExtensionIn {
    className: 'TopLevelPageUiExtensionIn'
    displayName: string
    uniqueCode: string
    iframeUrl: string
}

export interface GettingStartedUiExtensionIn {
    className: 'GettingStartedUiExtensionIn'
    gettingStartedUrl: string
    gettingStartedTitle: string
}
