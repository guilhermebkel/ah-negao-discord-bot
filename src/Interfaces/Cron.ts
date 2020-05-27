export interface Cron {
	schedule: string
	name: string
	run(): Promise<void>
}
