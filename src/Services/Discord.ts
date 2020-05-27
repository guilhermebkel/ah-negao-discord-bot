import { Message, TextChannel } from "discord.js"

import Discord from "~/Core/Discord"

class DiscordService {
	async getChannelMessages(channelName: string): Promise<string[]> {
		const channel = await this.getChannel<TextChannel>(channelName)

		const rawMessages = await channel.messages.fetch({ limit: 100 })

		const messages = rawMessages.map((message) => message.content)

		return messages
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

	async onMessage(message: Message) {
		console.log(message.content)
	}
}

export default new DiscordService()
