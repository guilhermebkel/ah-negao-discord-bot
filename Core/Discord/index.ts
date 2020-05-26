import * as discord from "discord.js"

import discordConfig from "@Config/discord"

class Discord {
	client = new discord.Client()

	async setup() {
		this.login()
		await this.onReady()
	}

	login(): void {
		this.client.login(discordConfig.botClientSecret)
	}

	async onReady(): Promise<void> {
		return new Promise((resolve) => this.client.on("ready", resolve))
	}
}

export default new Discord()
