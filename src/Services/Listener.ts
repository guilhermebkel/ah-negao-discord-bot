import { Message } from "discord.js"

class ListenerService {
	async onMessage(message: Message) {
		console.log(message.content)
	}
}

export default new ListenerService()
