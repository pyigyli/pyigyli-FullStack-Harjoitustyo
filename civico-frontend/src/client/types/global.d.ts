export {}
declare global {
	interface Window {
		env: {[key: string]: string}
	}
}