import WebScrapService from "~/Services/WebScrap"

import TypeUtil from "~/Utils/Type"
import LinkUtil from "~/Utils/Link"

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
					const url = LinkUtil.formatLink(attachmentChild?.attribs?.src)

					attachmentUrls.push(url)
				}
			})
		})

		return attachmentUrls
	}

	/**
	 * Gets the max day of a post page
	 */
	async getPagePostsUpperDay(page = 1): Promise<number> {
		let day = 0

		const pageUrl = `${ahNegaoConfig.pageBaseUrl}${page}`

		const pageData = await WebScrapService.getPageContent(pageUrl)

		const scraper = WebScrapService.getScraper(pageData)

		const rawPagePostDays = scraper(".dia").toArray()

		rawPagePostDays.forEach((pagePostDay) => {
			pagePostDay.children.forEach((pagePostDayChild) => {
				const isValidNumber = TypeUtil.isNumber(pagePostDayChild?.data)

				if (isValidNumber && +pagePostDayChild?.data > day) {
					day = +pagePostDayChild?.data
				}
			})
		})

		return day
	}
}

export default new AhNegaoService()
