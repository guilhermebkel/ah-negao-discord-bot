import Discord from "~/Core/Discord"
import Cron from "~/Core/Cron"
import PublishAhNegaoPostsOnDiscordCron from "~/Crons/PublishAhNegaoPostsOnDiscord"

class App {
	async boot() {
		console.log(`Starting... [${process.env.NODE_ENV}]`)

		await Discord.setup()
		Cron.setup()
		PublishAhNegaoPostsOnDiscordCron.run()
	}
}

export default new App()
