import axios from "axios"
import cheerio from "cheerio"

class WebScrapService {
	async getPageContent(pageUrl: string): Promise<string> {
		const { data } = await axios.get(pageUrl)

		return data
	}

	getScraper(pageData: string) {
		return cheerio.load(pageData)
	}
}

export default new WebScrapService()
