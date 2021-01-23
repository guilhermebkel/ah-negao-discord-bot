import {
	TextChannel,
	ChannelLogsQueryOptions,
	MessageEmbed
} from "discord.js"

import Discord from "~/Core/Discord"

import {
	BuildEmbedMessageProps,
	SendChannelMessageInput,
	GetChannelMessagesResponse
} from "~/Interfaces/Discord"

class DiscordService {
	async getChannelMessages(
		channelName: string,
		filter: ChannelLogsQueryOptions
	): Promise<GetChannelMessagesResponse[]> {
		try {
			const channel = await this.getChannel<TextChannel>(channelName)

			const rawMessages = await channel.messages.fetch(filter)

			const messages: GetChannelMessagesResponse[] = rawMessages.map((message) => ({
				content: message.content,
				embeds: message.embeds.map((embed) => ({
					title: embed.title,
					description: embed.description,
					url: embed.url
				}))
			}))

			return messages
		} catch (error) {
			console.error(error)
			return []
		}
	}

	async sendChannelMessage(
		channelName: string,
		message: SendChannelMessageInput
	): Promise<boolean> {
		try {
			const channel = await this.getChannel<TextChannel>(channelName)

			await channel.send(message)

			return true
		} catch (error) {
			console.error(error)
			return false
		}
	}

	async sendBatchChannelMessage(
		channelName: string,
		messages: SendChannelMessageInput[]
	): Promise<void> {
		// eslint-disable-next-line
		for (const message of messages) {
			await this.sendChannelMessage(channelName, message)
		}
	}

	async getChannel<ChannelType>(channelName: string): Promise<ChannelType> {
		const { channels } = Discord.client

		const channel = channels.cache
			.find((channelItems: any) => channelItems.name === channelName)

		return (channel as any) as ChannelType
	}

	buildEmbedMessage(props: BuildEmbedMessageProps): MessageEmbed {
		const {
			author,
			title,
			description,
			url,
			image
		} = props

		const embedMessage = new MessageEmbed()

		if (author) {
			embedMessage.setAuthor(author)
		}

		if (title) {
			embedMessage.setTitle(title)
		}

		if (url) {
			embedMessage.setURL(url)
		}

		if (description) {
			embedMessage.setDescription(description)
		}

		if (image) {
			embedMessage.setImage(image)
		}

		return embedMessage
	}
}

export default new DiscordService()
