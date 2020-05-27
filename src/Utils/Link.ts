class LinkUtil {
	formatLink(link: string) {
		if (!link) {
			return ""
		}

		return link
			.replace("embed/", "watch?v=")
	}
}

export default new LinkUtil()
