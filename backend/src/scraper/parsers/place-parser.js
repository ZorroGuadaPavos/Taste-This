export default async function parsePlace(data) {
	if (!data) {
		return null;
	}

	const mediaData = data[51]?.[0] || [];
	const addressComponents = data[2] || null;
	const accessibilityData = data[100]?.[1]?.[0]?.[2] || null;

	const parsedData = {
		id: data[10] || null,
		name: data[11] || null,
		rating: data[4]?.[7] || null,
		reviewCount: data[4]?.[8] || null,
		categories: data[13] || null,
		address: addressComponents ? addressComponents.join(", ") : null,
		priceLevel: data[4]?.[2] || null,
		openNow: Boolean(data[34]?.[4]?.[0]),
		phone: data[178]?.[0]?.[0] || null,
		website: data[7]?.[1] || null,
		photos: [],
		videos: [],
		accessibility: accessibilityData ? accessibilityData.map((item) => item[1]) : null,
	};

	if (mediaData.length > 0) {
		parsedData.photos = mediaData
			.filter((media) => media[20] !== "Video" && media[6]?.[0])
			.map((media) => media[6][0].split("=")[0])
			.filter(Boolean)
			.slice(0, 7);

		// const allVideoUrls = [];
		// for (const media of mediaData) {
		// 	if (media[20] === "Video" && media[26]?.[1]) {
		// 		for (const item of media[26][1]) {
		// 			if (item?.[3]) allVideoUrls.push(item[3]);
		// 		}
		// 	}
		// }
		// parsedData.videos = allVideoUrls;
	}

	return parsedData;
}
