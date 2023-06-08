export interface uiExtension {
    contextIdentifier: string
    extension: {
        className: string
        displayName?: string
        uniqueCode?: string
        iframeUrl?: string
    }[]
}

export interface right {
    codes: string[]
}
