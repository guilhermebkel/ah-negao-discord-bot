import Discord from "~/Core/Discord"
import Cron from "~/Core/Cron"

class App {
	async boot() {
		console.log(`Starting... [${process.env.NODE_ENV}]`)

		await Discord.setup()
		Cron.setup()
	}
}

export default new App()
