import express from "express"
import cors from "cors"

import DownloadController from "~/Controllers/Download"

import serverConfig from "~/Config/server"

class Server {
	private _app = express()

	async setup() {
		this.setupMiddlewares()
		this.setupRoutes()
		await this.initServer()
	}

	setupRoutes(): void {
		this._app.get("/:fileName", DownloadController.download)
	}

	setupMiddlewares(): void {
		this._app.use(cors())
	}

	async initServer(): Promise<void> {
		return new Promise((resolve) => {
			this._app.listen(serverConfig.port, () => {
				console.log(`Server started... [${serverConfig.port}]`)
				resolve()
			})
		})
	}
}

export default new Server()
