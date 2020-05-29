import { Message, TextChannel, ChannelLogsQueryOptions } from "discord.js"

import Discord from "~/Core/Discord"

class DiscordService {
	async getChannelMessages(
		channelName: string,
		filter: ChannelLogsQueryOptions
	): Promise<string[]> {
		try {
			const channel = await this.getChannel<TextChannel>(channelName)

			const rawMessages = await channel.messages.fetch(filter)

			const messages = rawMessages.map((message) => message.content)

			return messages
		} catch (error) {
			console.error(error)
			return []
		}
	}

	async sendChannelMessage(channelName: string, message: string): Promise<boolean> {
		try {
			const channel = await this.getChannel<TextChannel>(channelName)

			await channel.send(message)

			return true
		} catch (error) {
			console.error(error)
			return false
		}
	}

	async getChannel<ChannelType>(channelName: string): Promise<ChannelType> {
		const { channels } = Discord.client

		const channel = channels.cache
			.find((channelItems: any) => channelItems.name === channelName)

		return (channel as any) as ChannelType
	}
}

export default new DiscordService()
