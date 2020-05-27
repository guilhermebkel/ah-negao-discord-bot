import * as discord from "discord.js"

import ListenerService from "~/Services/Listener"

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
		Discord.client.login(discordConfig.botToken)
	}

	static async onReady(): Promise<void> {
		return new Promise((resolve) => Discord.client.on("ready", resolve))
	}

	static get client() {
		return Discord._client
	}

	static setupListeners() {
		Discord.client.on("message", ListenerService.onMessage)
	}
}

export default Discord
