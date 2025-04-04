// import { saveResponseData } from "../utils/saveResponse.js";

export function getPlaceUrl(placeId) {
	if (!placeId) {
		throw new Error("Place ID is required");
	}
	return `https://www.google.com/maps/place/${placeId}/@0,0,15z/data=!4m5!3m4!1s${placeId}!8m2!3d0!4d0`;
}

export function extractPlaceImage(html) {
	const imageRegex =
		/<meta\s+(?:content="([^"]+)"\s+(?:itemprop="image"|property="og:image")|(?:itemprop="image"|property="og:image")\s+content="([^"]+)")/i;
	const imageMatch = html.match(imageRegex);
	let imageUrl = imageMatch ? imageMatch[1] || imageMatch[2] : null;

	if (imageUrl?.includes("streetviewpixels-pa.googleapis.com")) {
		const panoidMatch = imageUrl.match(/panoid=([^&]+)/);
		if (panoidMatch) {
			const panoid = panoidMatch[1];
			imageUrl = `https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=${panoid}&cb_client=search.gws-prod.gps&w=800&h=400`;
		}
	}

	return imageUrl;
}

export function extractPlaceUrlId(html) {
	// Pattern: 0x0:0x...
	const placeIdRegex = /0x[0-9a-f]+:0x[0-9a-f]+/g;
	const matches = html.match(placeIdRegex);

	if (matches && matches.length > 0) {
		return matches[0];
	}

	return null;
}

export async function searchPlaceById(placeId) {
	const response = await fetch(`https://maps.google.com/?cid=${placeId}`);

	if (!response.ok) {
		const error = new Error(`Search request failed: ${response.statusText}`);
		error.status = response.status;
		throw error;
	}

	const html = await response.text();
	// saveResponseData(html, "searchPlaceById.html");
	const placeUrlId = extractPlaceUrlId(html);
	const placePhoto = extractPlaceImage(html);

	return {
		placeUrlId,
		placePhoto,
	};
}
