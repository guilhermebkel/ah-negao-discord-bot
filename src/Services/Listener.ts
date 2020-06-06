import { Message } from "discord.js"
import youtube from "ytdl-core"

import DownloadService from "~/Services/Download"

const COMMANDS = {
	GET_IN: {
		message: "entra",
		description: "Entra na sala do usuário que chamou."
	},
	GET_OUT: {
		message: "vaza",
		description: "Sai da sala do usuário que pediu."
	},
	PLAY_SONG_ON_QUEUE: {
		message: "toca",
		description: "Começa a tocar as músicas da queue."
	},
	ADD_SONG_TO_QUEUE: {
		message: "adiciona:",
		description: "Adiciona uma nova música na queue (Ex: 'adiciona: LINK_DA_MÚSICA_NO_YOUTUBE')."
	},
	FLUSH_SONG_QUEUE: {
		message: "remove tudo",
		description: "Remove todas as músicas da queue."
	},
	SHOW_SONG_QUEUE: {
		message: "mostra tudo",
		description: "Mostra todas as músicas que estão na queue."
	},
	SKIP_SONG_ON_QUEUE: {
		message: "pula",
		description: "Pula para a próxima música da queue."
	},
	SHOW_ALL_COMMANDS: {
		message: "comandos",
		description: "Mostra todos os comandos disponíveis."
	},
	GENERATE_DOWNLOAD_LINK: {
		message: "gera link:",
		description: "Cria um link de download no servidor para o arquivo recebido. (Ex: 'gera link: LINK_DO_ARQUIVO')."
	}
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
		const songUrl = message.content.split(COMMANDS.ADD_SONG_TO_QUEUE.message).pop().trim()

		ListenerService.songQueue.push(songUrl)

		message.channel.send(`ADICIONEI: ${songUrl}`)
	}

	static async flushSongQueue(message: Message) {
		ListenerService.songQueue.length = 0

		message.channel.send("REMOVI AS MÚSICAS!")
	}

	static async getSongQueueList(message: Message) {
		message.channel.send(`LISTA DE MÚSICAS: ${ListenerService.songQueue.join(",\n ")}`)
	}

	static async showAllCommands(message: Message) {
		const commands = Object.values(COMMANDS).map((value) => `[${value.message}]: ${value.description}`)

		message.channel.send(["LISTA DE COMANDOS:", ...commands])
	}

	static async generateDownloadLink(message: Message) {
		message.channel.send("CALMAE QUE VOU GERAR O NOVO LINK")

		const link = message.content.split(COMMANDS.GENERATE_DOWNLOAD_LINK.message).pop().trim()

		const downloadLink = await DownloadService.downloadFromLink(link)

		message.channel.send(`LINK PARA O ARQUIVO: ${downloadLink}`)
	}

	static async onMessage(message: Message) {
		try {
			const requested = (command: string) => message.content.includes(command)

			if (message.author.bot) {
				return
			}

			if (requested(COMMANDS.GET_IN.message)) {
				ListenerService.voiceChannelConnect(message)
			}

			if (requested(COMMANDS.GET_OUT.message)) {
				ListenerService.disconnect(message)
			}

			if (requested(COMMANDS.PLAY_SONG_ON_QUEUE.message)) {
				ListenerService.play(message)
			}

			if (requested(COMMANDS.ADD_SONG_TO_QUEUE.message)) {
				ListenerService.addSong(message)
			}

			if (requested(COMMANDS.FLUSH_SONG_QUEUE.message)) {
				ListenerService.flushSongQueue(message)
			}

			if (requested(COMMANDS.SHOW_SONG_QUEUE.message)) {
				ListenerService.getSongQueueList(message)
			}

			if (requested(COMMANDS.SKIP_SONG_ON_QUEUE.message)) {
				ListenerService.play(message)
			}

			if (requested(COMMANDS.SHOW_ALL_COMMANDS.message)) {
				ListenerService.showAllCommands(message)
			}

			if (requested(COMMANDS.GENERATE_DOWNLOAD_LINK.message)) {
				ListenerService.generateDownloadLink(message)
			}
		} catch (error) {
			console.error(error)
			message.channel.send("KKKKK DEU ERRO E NÃO CONSEGUI FAZER O QUE VOCẼ MANDOU")
		}
	}
}

export default ListenerService
