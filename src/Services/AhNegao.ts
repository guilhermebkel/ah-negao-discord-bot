import WebScrapService from "~/Services/WebScrap"

import TypeUtil from "~/Utils/Type"

import ahNegaoConfig from "~/Config/ah-negao"

class AhNegaoService {
	async getPagePostAttachmentUrls(page = 1): Promise<string[]> {
		const pageUrl = `${ahNegaoConfig.pageBaseUrl}${page}`

		const pageData = await WebScrapService.getPageContent(pageUrl)

		const scraper = WebScrapService.getScraper(pageData)

		const rawPostAttachments = scraper(".in p").toArray()

		const attachmentUrls = []

		rawPostAttachments.forEach((attachment) => {
			attachment.children.forEach((attachmentChild) => {
				if (attachmentChild.name === "iframe" || attachmentChild.name === "img") {
					attachmentUrls.push(attachmentChild?.attribs?.src)
				}
			})
		})

		return attachmentUrls
	}

	async getPagePostsDay(page = 1): Promise<number> {
		let day = 999

		const pageUrl = `${ahNegaoConfig.pageBaseUrl}${page}`

		const pageData = await WebScrapService.getPageContent(pageUrl)

		const scraper = WebScrapService.getScraper(pageData)

		const rawPagePostDays = scraper(".dia").toArray()

		rawPagePostDays.forEach((pagePostDay) => {
			pagePostDay.children.forEach((pagePostDayChild) => {
				const isValidNumber = TypeUtil.isNumber(pagePostDayChild?.data)

				if (isValidNumber && +pagePostDayChild?.data < day) {
					day = +pagePostDayChild?.data
				}
			})
		})

		return day
	}
}

export default new AhNegaoService()
