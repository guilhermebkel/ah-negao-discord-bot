import Discord from "~/Core/Discord"
import Cron from "~/Core/Cron"

class App {
	async boot() {
		console.log(`Starting... [${process.env.NODE_ENV}]`)

		await Discord.setup()
		console.log("Discord Bot is online...")

		Cron.setup()
		console.log("Cron jobs scheduled...")
	}
}

export default new App()
