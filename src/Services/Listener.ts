import { Message } from "discord.js"
import youtube from "ytdl-core"

const COMMANDS = {
	GET_IN: "entra",
	GET_OUT: "vaza",
	PLAY_SONG_ON_QUEUE: "toca",
	ADD_SONG_TO_QUEUE: "adiciona:",
	FLUSH_SONG_QUEUE: "remove tudo",
	SHOW_SONG_QUEUE: "mostra tudo",
	SKIP_SONG_ON_QUEUE: "pula",
	SHOW_ALL_COMMANDS: "comandos"
}

class ListenerService {
	static songQueue: string[] = []

	static async voiceChannelConnect(message: Message) {
		await message.member.voice.channel.join()
		await message.channel.send("ENTREI!")
	}

	static async play(message: Message) {
		const broadcast = message.client.voice.createBroadcast()

		const currentSong = ListenerService.songQueue.shift()

		if (!currentSong) {
			return
		}

		message.channel.send(`TOCANDO: ${currentSong}`)

		const youtubeSongStream = youtube(currentSong, { filter: "audioonly" })

		broadcast.play(youtubeSongStream)

		const voiceConnections = message.client.voice.connections.values()

		// eslint-disable-next-line
		for (const connection of voiceConnections) {
			connection.play(broadcast)
		}
	}

	static async disconnect(message: Message) {
		message.member.voice.channel.leave()

		await message.channel.send("VAZEI!")
	}

	static async addSong(message: Message) {
		const songUrl = message.content.split("adiciona:").pop().trim()

		ListenerService.songQueue.push(songUrl)

		message.channel.send(`ADICIONEI: ${songUrl}`)
	}

	static async flushSongQueue(message: Message) {
		ListenerService.songQueue.length = 0

		message.channel.send("REMOVI AS MÚSICAS!")
	}

	static async getSongQueueList(message: Message) {
		message.channel.send(`LISTA DE MÚSICAS: ${ListenerService.songQueue.join(", ")}`)
	}

	static async showAllCommands(message: Message) {
		const commands = Object.values(COMMANDS)

		message.channel.send(`LISTA DE COMANDOS: ${commands.join(", ")}`)
	}

	static async onMessage(message: Message) {
		const requested = (command: string) => message.content.includes(command)

		if (message.author.bot) {
			return
		}

		if (requested(COMMANDS.GET_IN)) {
			ListenerService.voiceChannelConnect(message)
		}

		if (requested(COMMANDS.GET_OUT)) {
			ListenerService.disconnect(message)
		}

		if (requested(COMMANDS.PLAY_SONG_ON_QUEUE)) {
			ListenerService.play(message)
		}

		if (requested(COMMANDS.ADD_SONG_TO_QUEUE)) {
			ListenerService.addSong(message)
		}

		if (requested(COMMANDS.FLUSH_SONG_QUEUE)) {
			ListenerService.flushSongQueue(message)
		}

		if (requested(COMMANDS.SHOW_SONG_QUEUE)) {
			ListenerService.getSongQueueList(message)
		}

		if (requested(COMMANDS.SKIP_SONG_ON_QUEUE)) {
			ListenerService.play(message)
		}

		if (requested(COMMANDS.SHOW_ALL_COMMANDS)) {
			ListenerService.showAllCommands(message)
		}
	}
}

export default ListenerService
