export interface Cron {
	run(): Promise<void>
}
