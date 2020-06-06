import fs from "fs"
import request from "request"
import axios from "axios"

import StreamUtil from "~/Utils/Stream"

import serverConfig from "~/Config/server"

class DownloadService {
	async downloadFromLink(link: string) {
		const metadata = await this.buildMetadata(link)

		const writeStream = fs.createWriteStream(metadata.fileName)
		const downloadStream = request(link)

		await StreamUtil.pipeline(
			downloadStream,
			writeStream
		)

		return `${serverConfig.url}/${metadata.fileName}`
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
