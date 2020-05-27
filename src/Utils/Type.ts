class TypeUtil {
	isNumber(value: any) {
		// eslint-disable-next-line
		return !isNaN(+value)
	}
}

export default new TypeUtil()
