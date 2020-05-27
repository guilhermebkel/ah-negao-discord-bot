import * as discord from "discord.js"

import DiscordService from "~/Services/Discord"

import discordConfig from "~/Config/discord"

class Discord {
	private static _client = new discord.Client()

	static async setup() {
		Discord.login()
		Discord.setupListeners()
		await Discord.onReady()
		console.log("Discord Bot is online...")
	}

	static login(): void {
		Discord.client.login(discordConfig.botClientSecret)
	}

	static async onReady(): Promise<void> {
		return new Promise((resolve) => Discord.client.on("ready", resolve))
	}

	static get client() {
		return Discord._client
	}

	static setupListeners() {
		Discord.client.on("message", DiscordService.onMessage)
	}
}

export default Discord
