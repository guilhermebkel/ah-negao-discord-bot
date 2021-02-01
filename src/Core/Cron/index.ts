import nodeCron from "node-cron"

import crons from "~/Crons"

class Cron {
	setup() {
		crons[0].run()
		crons.forEach((cron) => {
			nodeCron.schedule(cron.schedule, async () => {
				console.log(`[cron][${cron.name}] Running...`)

				try {
					await cron.run()
					console.log(`[cron][${cron.name}] DONE!`)
				} catch (error) {
					console.log(`[cron][${cron.name}] ERROR!`)
				}
			})
		})

		console.log(`Cron jobs scheduled... [${crons.length} jobs]`)
	}
}

export default new Cron()
