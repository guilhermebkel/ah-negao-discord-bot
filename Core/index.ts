import Discord from "@Core/Discord"

class App {
	async boot() {
		console.log(`Starting... [${process.env.NODE_ENV}]`)

		await Discord.setup()
		console.log("Discord Bot is online...")
	}
}

export default new App()
