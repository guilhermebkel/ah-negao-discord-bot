import fs from "fs"
import request from "request"
import axios from "axios"

import StreamUtil from "~/Utils/Stream"

class DownloadService {
	async downloadFromLink(link: string) {
		const metadata = await this.buildMetadata(link)

		const writeStream = fs.createWriteStream(metadata.fileName)
		const downloadStream = request(link)

		await StreamUtil.pipeline(
			downloadStream,
			writeStream
		)

		return `https://ah-negao-discord-bot.s2.guilherr.me/${metadata.fileName}`
	}

	async buildMetadata(link: string) {
		const response = await axios.head(link)

		const { headers } = response

		return {
			size: headers["content-length"],
			contentType: headers["content-type"],
			fileName: headers["content-disposition"].split("filename=").pop().replace(/"/g, "")
		}
	}
}

export default new DownloadService()
