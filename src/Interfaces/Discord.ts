import { MessageEmbed } from "discord.js"

export type BuildEmbedMessageProps = {
	author?: string
	title?: string
	url?: string
	description?: string
	image?: string
	video?: string
}

export type GetChannelMessagesResponse = {
	content: string
	embeds: Array<{
		title: string
		description: string
		url: string
	}>
}

export type SendChannelMessageInput = string | MessageEmbed
