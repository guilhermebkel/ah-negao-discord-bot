export type AhNegaoPost = {
	title: string
	date: Date
	url: string
	contents: Array<{
		type: "image" | "embed" | "text",
		value: string
	}>
}

export type GetPagePostDataResponse = {
	posts: AhNegaoPost[]
	/**
	 * Greater publish date of posts
	 */
	postsUpperDate: Date
}
