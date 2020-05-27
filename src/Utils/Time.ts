class Time {
	getBackedDaysDate(backDays = 1): Date {
		const today = new Date()

		const todayParams = {
			day: today.getDate(),
			month: today.getMonth() + 1,
			year: today.getFullYear()
		}

		const backedDaysDate = new Date()

		backedDaysDate.setDate(todayParams.day - backDays)
		backedDaysDate.setMonth(todayParams.month)
		backedDaysDate.setFullYear(todayParams.year)

		return backedDaysDate
	}
}

export default new Time()
