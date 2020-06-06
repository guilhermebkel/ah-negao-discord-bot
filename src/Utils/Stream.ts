import Stream from "stream"
import { promisify } from "util"

class StreamUtil {
	async pipeline(...fn: any) {
		return promisify(Stream.pipeline)(fn)
	}
}

export default new StreamUtil()
