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

	/**
	 *
	 * @param brazilianDate A string in brazilian date format.
	 * Ex:
	 * 	- 22/01/2021
	 */
	parseBrazilianDate(brazilianDate: string): Date {
		const [day, month, year] = brazilianDate?.split("/")?.map(Number)

		const isValidDay = !isNaN(day)
		const isValidMonth = !isNaN(month)
		const isValidYear = !isNaN(year)

		if (!isValidDay || !isValidMonth || !isValidYear) {
			return null
		}

		const parsedDate = new Date(year, month - 1, day)

		return parsedDate
	}

	buildBrazilianDate(date: Date): string {
		const day = date.getDate()
		const month = date.getMonth() + 1
		const year = date.getFullYear()

		const brazilianDate = `${day < 10 ? `0${day}` : day}/${month < 10 ? `0${month}` : month}/${year}`

		return brazilianDate
	}
}

export default new Time()
