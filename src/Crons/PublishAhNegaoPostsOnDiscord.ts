
import AhNegaoService from "~/Services/AhNegao"
import DiscordService from "~/Services/Discord"

import TimeUtil from "~/Utils/Time"

import { Cron } from "~/Interfaces/Cron"

import discordConfig from "~/Config/discord"

class PublishAhNegaoPostsOnDiscordCron implements Cron {
	schedule = "*/10 * * * *"

	name = "PublishAhNegaoPostsOnDiscord"

	async run(): Promise<void> {
		const { channelName } = discordConfig

		const messages = await DiscordService.getChannelMessages(
			channelName,
			{ limit: 100 }
		)

		const todayPagePostData = await AhNegaoService.getTodayPagePosts()

		// eslint-disable-next-line
		for (const pagePostData of todayPagePostData) {
			const messageEmbeds = messages.reduce((embeds, message) => [...embeds, ...message.embeds], [])

			const isPagePostDataPublishedOnDiscord = messageEmbeds.some((messageEmbed) => (
				messageEmbed.title === pagePostData.title
			))

			if (!isPagePostDataPublishedOnDiscord) {
				const embedMessage = DiscordService.buildEmbedMessage({
					author: TimeUtil.buildBrazilianDate(pagePostData.date),
					title: pagePostData.title,
					url: pagePostData.url
				})

				const contentMessages = pagePostData.contents.map((content) => content.value)

				const scheduledMessages = [
					embedMessage,
					...contentMessages
				]

				await DiscordService.sendBatchChannelMessage(channelName, scheduledMessages)
			}
		}
	}
}

export default new PublishAhNegaoPostsOnDiscordCron()
