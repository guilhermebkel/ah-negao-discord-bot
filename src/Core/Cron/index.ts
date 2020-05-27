import crons from "~/Crons"

class Cron {
	setup() {
		crons.forEach((cron) => cron.run())
	}
}

export default new Cron()
