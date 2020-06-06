import Discord from "~/Core/Discord"
import Cron from "~/Core/Cron"
import Server from "~/Core/Server"

class App {
	async boot() {
		console.log(`Starting... [${process.env.NODE_ENV}]`)

		await Discord.setup()
		Cron.setup()
		await Server.setup()
	}
}

export default new App()
