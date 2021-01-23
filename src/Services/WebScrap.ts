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

	getElementByClassName(currentElement: CheerioElement, selectedClass: string) {
		let selectedElement: CheerioElement

		const currentElementClasses = currentElement?.attribs?.class || ""

		const currentElementHasSelectedClass = currentElementClasses?.includes(selectedClass)

		if (currentElementHasSelectedClass) {
			selectedElement = currentElement
		} else {
			const children = currentElement?.children || []

			children.forEach((child) => {
				const childSelectedElement = this.getElementByClassName(child, selectedClass)

				if (childSelectedElement) {
					selectedElement = childSelectedElement
				}
			})
		}

		return selectedElement
	}
}

export default new WebScrapService()
