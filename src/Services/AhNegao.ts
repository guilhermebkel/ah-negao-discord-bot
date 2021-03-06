import WebScrapService from "~/Services/WebScrap"

import LinkUtil from "~/Utils/Link"
import TimeUtil from "~/Utils/Time"

import ahNegaoConfig from "~/Config/ah-negao"

import { AhNegaoPost, GetPagePostDataResponse } from "~/Interfaces/AhNegao"

class AhNegaoService {
	private processedPosts: AhNegaoPost[] = []

	async getTodayPagePosts(): Promise<AhNegaoPost[]> {
		const todayDate = new Date()

		/**
		 * We make it minus 1 since the date on some servers
		 * date does not match the bot one. So, that way
		 * we are able to filter the posts from yesterday to today.
		 */
		const todayDay = todayDate.getDate() - 1
		let postUpperDay: number = todayDay

		let todayPagePostData: AhNegaoPost[] = []

		for (let page = 1; postUpperDay >= todayDay; page++) {
			const pageUrl = this.getPageUrl(page)

			const pagePostData = await this.getPagePostData(pageUrl)

			const todayMonth = todayDate.getMonth()

			/**
			 * We only process the data if it was created on the same month that today,
			 * it helps avoiding infinite loops due to a large amount of different days
			 * that a day in a month can have to another.
			 */
			if (todayMonth !== pagePostData.postsUpperDate.getMonth()) {
				break
			}

			const todayPosts = pagePostData.posts.filter((post) => (
				post.date.getDate() >= todayDay
			))

			todayPagePostData = [
				...todayPagePostData,
				...todayPosts
			]

			postUpperDay = pagePostData.postsUpperDate.getDate()
		}

		return todayPagePostData
	}

	async getPagePostData(pageUrl: string): Promise<GetPagePostDataResponse> {
		const pageData = await WebScrapService.getPageContent(pageUrl)

		const scraper = WebScrapService.getScraper(pageData)

		const rawArticles = scraper("article").toArray()

		const pagePostData: GetPagePostDataResponse = {
			posts: [],
			postsUpperDate: null
		}

		await Promise.all(
			rawArticles.map(async (rawArticle) => {
				const post = await this.parseArticle(rawArticle)

				pagePostData.posts.push(post)
			})
		)

		const postDatesInMilliseconds = pagePostData.posts.map((post) => +post.date)
		const greaterPostDateInMilliseconds = Math.max(...postDatesInMilliseconds)

		pagePostData.postsUpperDate = new Date(greaterPostDateInMilliseconds)

		return pagePostData
	}

	set processedPost(post: AhNegaoPost) {
		this.processedPosts.push(post)
	}

	wasPostProcessed(post: AhNegaoPost): boolean {
		const wasPostProcessed = this.processedPosts.some((processedPost) => (
			processedPost.title === post.title
		))

		return wasPostProcessed
	}

	private getPageUrl(page: number): string {
		const pageUrl = `${ahNegaoConfig.pageBaseUrl}${page}`

		return pageUrl
	}

	private async parseArticle(article: any): Promise<AhNegaoPost> {
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

		if (title) {
			post.title = title
		}

		if (url) {
			post.url = url
		}

		if (date) {
			post.date = TimeUtil.parseBrazilianDate(date)
		}

		/**
		 * It means the current article is so big that we have to go inside it
		 * in order to get all content, since we are dealing only with a little
		 * amount here.
		 */
		const isThereAnySeeMoreButton = WebScrapService.getElementByClassName(article, "ast-the-content-more-link")

		if (isThereAnySeeMoreButton) {
			const fullArticlePagePostData = await this.getPagePostData(url)

			const [fullArticlePost] = fullArticlePagePostData.posts

			post.contents = fullArticlePost.contents
		} else {
			const rawEntryContent = WebScrapService.getElementByClassName(article, "entry-content")
			const entryContents: any = rawEntryContent?.children
				?.filter((child: any) => child.name === "p")
				?.reduce((children: any, child: any) => [...children, ...child?.children], [])

			if (entryContents) {
				entryContents.forEach((entryContent: any) => {
					const name = entryContent?.name
					const type = entryContent?.type
					const src = entryContent?.attribs?.src
					const data = entryContent?.data

					const isEmbed = name === "iframe"
					const isImage = name === "img"
					const isText = type === "text" && data?.length > 1

					if (isEmbed || isImage) {
						const contentUrl = LinkUtil.formatLink(src)

						post.contents.push({
							type: isImage ? "image" : "embed",
							value: contentUrl
						})
					}

					if (isText) {
						const text = data

						post.contents.push({
							type: "text",
							value: text
						})
					}
				})
			}

			const rawGalleryContent = WebScrapService.getElementByClassName(article, "gallery")
			const galleryContents: any = rawGalleryContent?.children
				?.filter((child: any) => child.name === "figure")
				?.reduce((children: any, child: any) => [...children, ...child?.children], [])

			if (galleryContents) {
				galleryContents.forEach((galleryContent: any) => {
					const img = galleryContent?.children?.find((content: any) => content?.name === "img")

					if (img) {
						const src = img?.attribs?.src

						const contentUrl = LinkUtil.formatLink(src)

						post.contents.push({
							type: "image",
							value: contentUrl
						})
					}
				})
			}
		}

		return post
	}
}

export default new AhNegaoService()
