import fetch from 'node-fetch'

import { Organization } from '@/models'
import { ChatMessage } from '@types/space'
import { logger } from '@utils/logger'

async function sendMessage(organization: Organization, token: string, message: ChatMessage) {
    const url = `${organization.serverUrl}/api/http/chats/messages/send-message`
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    })
    if (!response.ok) {
        logger.error('fail to send message', { serverUrl: organization.serverUrl, cause: await response.text() })
    }
}

export async function sendTextMessage(organization: Organization, token: string, userId: string, text: string) {
    const message: ChatMessage = {
        channel: `member:id:${userId}`,
        content: {
            className: 'ChatMessage.Text',
            text: text,
        },
    }
    await sendMessage(organization, token, message)
}

export async function sendAddSuccessMessage(organization: Organization, token: string, userId: string) {
    await sendTextMessage(organization, token, userId, 'a new orbit message added')
}

export async function sendAddFailMessage(organization: Organization, token: string, userId: string) {
    await sendTextMessage(organization, token, userId, 'fail to add a new orbit message. check your command')
}

export async function sendOrbitListMessage(organization: Organization, token: string, userId: string) {
    // todo: implement orbit list message
    await sendTextMessage(organization, token, userId, 'orbit list')
}

export async function sendDeleteSuccessMessage(organization: Organization, token: string, userId: string) {
    await sendTextMessage(organization, token, userId, 'the orbit message deleted')
}

export async function sendDeleteFailMessage(organization: Organization, token: string, userId: string) {
    await sendTextMessage(organization, token, userId, 'fail to delete the orbit message')
}
