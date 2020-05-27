import AhNegaoService from "~/Services/AhNegao"
import DiscordService from "~/Services/Discord"

import { Cron } from "~/Interfaces/Cron"

import discordConfig from "~/Config/discord"

class CheckNewPostsCron implements Cron {
	async run(): Promise<void> {
		const messages = await DiscordService.getChannelMessages(discordConfig.channelName)
		console.log(messages)

		const attachmentUrls = await AhNegaoService.getPagePostAttachmentUrls(1)
		console.log(attachmentUrls)

		const day = await AhNegaoService.getPagePostsDay(4)
		console.log(day)

		await DiscordService.sendChannelMessage(discordConfig.channelName, attachmentUrls[1])
	}
}

export default new CheckNewPostsCron()
