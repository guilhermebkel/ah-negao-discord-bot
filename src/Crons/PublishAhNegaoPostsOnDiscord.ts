import AhNegaoService from "~/Services/AhNegao"
import DiscordService from "~/Services/Discord"

import { Cron } from "~/Interfaces/Cron"

import discordConfig from "~/Config/discord"

class PublishAhNegaoPostsOnDiscordCron implements Cron {
	schedule = "*/10 * * * *"

	name = "PublishAhNegaoPostsOnDiscord"

	async run(): Promise<void> {
		const { channelName } = discordConfig

		const todayDay = new Date().getDate()
		let postUpperDay = todayDay

		const messages = await DiscordService.getChannelMessages(
			channelName,
			{ limit: 100 }
		)

		let todayAttachmentUrls: string[] = []

		for (let page = 1; todayDay === postUpperDay; page++) {
			const attachmentUrls = await AhNegaoService.getPagePostAttachmentUrls(page)

			todayAttachmentUrls = [
				...todayAttachmentUrls,
				...attachmentUrls
			]

			postUpperDay = await AhNegaoService.getPagePostsUpperDay(page)
		}

		// eslint-disable-next-line
		for (const attachmentUrl of todayAttachmentUrls) {
			const isAttachmentPublishedOnDiscord = messages.includes(attachmentUrl)

			if (!isAttachmentPublishedOnDiscord) {
				await DiscordService.sendChannelMessage(channelName, attachmentUrl)
			}
		}
	}
}

export default new PublishAhNegaoPostsOnDiscordCron()
