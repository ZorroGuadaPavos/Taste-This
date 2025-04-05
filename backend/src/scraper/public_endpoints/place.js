/**
 * Fetches place data from Google Maps for a given place ID.
 * @param {string} placeid - The unique identifier of the place to fetch data for.
 * @returns {Promise<object>} A promise that resolves to the parsed place data object.
 * @throws {Error} Throws an error if the fetch operation fails or the response cannot be parsed.
 */
export async function fetchPlaceData(placeid) {
	const url = `https://www.google.com/maps/preview/place?authuser=0&hl=en&gl=lk&pb=!1m20!1s${placeid}!3m15!1m3!1d2897.602952432643!2d79.87687425884405!3d6.9101139243550564!2m3!1f0!2f0!3f0!3m2!1i958!2i918!4f13.1!6m2!1f0!2f0!4m2!3d6.910380211799998!4d79.87802378833295!13m41!2m2!1i408!2i240!3m2!2i10!5b1!7m33!1m3!1e1!2b0!3e3!1m3!1e2!2b1!3e2!1m3!1e2!2b0!3e3!1m3!1e8!2b0!3e3!1m3!1e10!2b0!3e3!1m3!1e10!2b1!3e2!1m3!1e10!2b0!3e4!1m3!1e9!2b1!3e2!2b1!9b0!14m4!1siwXjZ4a6IdbB4-EP37Kr2Q0!3b1!7e81!15i10555!15m49!1m10!4e2!18m7!3b0!6b0!14b1!17b1!20b1!27m1!1b0!20e2!4b1!10m1!8e3!11m1!3e1!17b1!20m2!1e3!1e6!24b1!25b1!26b1!29b1!30m1!2b1!36b1!43b1!52b1!55b1!56m1!1b1!65m5!3m4!1m3!1m2!1i224!2i298!98m3!1b1!2b1!3b1!107m2!1m1!1e1!114m3!1b1!2m1!1b1!22m1!1e81!29m0!30m6!3b1!6m1!2b1!7m1!2b1!9b1!32b1!37i725`;

	try {
		const response = await fetch(url);
		const data = await response.text();

		return JSON.parse(data.split(")]}'")[1])[6];
	} catch {
		throw new Error("Failed to fetch place data");
	}
}
