import WebScrapService from "~/Services/WebScrap"

import LinkUtil from "~/Utils/Link"
import TimeUtil from "~/Utils/Time"

import ahNegaoConfig from "~/Config/ah-negao"

import { AhNegaoPost, GetPagePostDataResponse } from "~/Interfaces/AhNegao"

class AhNegaoService {
	async getTodayPagePosts(): Promise<AhNegaoPost[]> {
		const todayDay = new Date().getDate()
		let postUpperDay: number = todayDay

		let todayPagePostData: AhNegaoPost[] = []

		for (let page = 1; todayDay === postUpperDay; page++) {
			const pagePostData = await this.getPagePostData(page)

			todayPagePostData = [
				...todayPagePostData,
				...pagePostData.posts
			]

			postUpperDay = pagePostData.postsUpperDate.getDate()
		}

		return todayPagePostData
	}

	async getPagePostData(page = 1): Promise<GetPagePostDataResponse> {
		const pageUrl = this.getPageUrl(page)

		const pageData = await WebScrapService.getPageContent(pageUrl)

		const scraper = WebScrapService.getScraper(pageData)

		const rawArticles = scraper("article").toArray()

		const pagePostData: GetPagePostDataResponse = {
			posts: [],
			postsUpperDate: null
		}

		rawArticles.forEach((rawArticle) => {
			const post = this.parseArticle(rawArticle)

			pagePostData.posts.push(post)
		})

		const postDatesInMilliseconds = pagePostData.posts.map((post) => +post.date)
		const greaterPostDateInMilliseconds = Math.max(...postDatesInMilliseconds)

		pagePostData.postsUpperDate = new Date(greaterPostDateInMilliseconds)

		return pagePostData
	}

	private getPageUrl(page: number): string {
		const pageUrl = `${ahNegaoConfig.pageBaseUrl}${page}`

		return pageUrl
	}

	private parseArticle(article: CheerioElement): AhNegaoPost {
		const post: AhNegaoPost = {
			title: "",
			url: "",
			date: null,
			contents: []
		}

		const rawTitle = WebScrapService.getElementByClassName(article, "entry-title")
		const title = rawTitle?.children?.[0]?.children?.[0]?.data
		const url = rawTitle?.children?.[0]?.attribs?.href

		const rawDate = WebScrapService.getElementByClassName(article, "published")
		const date = rawDate?.children?.[0]?.data

		const rawContent = WebScrapService.getElementByClassName(article, "entry-content")
		const contents: CheerioElement[] = rawContent?.children
			?.filter((child) => child.name === "p")
			?.reduce((children, child) => [...children, ...child?.children], [])

		if (title) {
			post.title = title
		}

		if (url) {
			post.url = url
		}

		if (date) {
			post.date = TimeUtil.parseBrazilianDate(date)
		}

		if (contents) {
			contents.forEach((content) => {
				const name = content?.name
				const type = content?.type

				const isEmbed = name === "iframe"
				const isImage = name === "img"

				if (isEmbed || isImage) {
					const contentUrl = LinkUtil.formatLink(content?.attribs?.src)

					post.contents.push({
						type: isImage ? "image" : "embed",
						value: contentUrl
					})
				}

				if (type === "text") {
					const text = content?.data

					post.contents.push({
						type: "text",
						value: text
					})
				}
			})
		}

		return post
	}
}

export default new AhNegaoService()
