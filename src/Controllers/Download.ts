import fs from "fs"
import { Request, Response } from "express"

class DownloadController {
	download(req: Request, res: Response) {
		const { fileName } = req.params

		const fileExists = fs.existsSync(fileName)

		if (!fileExists) {
			return res.status(404).send("File not found")
		}

		const readStream = fs.createReadStream(fileName)

		return readStream.pipe(res)
	}
}

export default new DownloadController()
