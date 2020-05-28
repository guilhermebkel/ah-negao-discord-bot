class LinkUtil {
	formatLink(link: string) {
		if (!link) {
			return ""
		}

		let formattedLink = link

		if (this.isYoutubeLink(link)) {
			formattedLink = link.replace("embed/", "watch?v=")
		}

		if (this.isGfyCatLink(link)) {
			const slug = link.split("/").pop()

			formattedLink = `https://thumbs.gfycat.com/${slug}-mobile.mp4`
		}

		return formattedLink
	}

	isYoutubeLink(link: string) {
		return link.includes("youtube")
	}

	isGfyCatLink(link: string) {
		return link.includes("gfycat")
	}
}

export default new LinkUtil()
