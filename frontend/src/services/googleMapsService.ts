import { GoogleMapsConfig } from "@/config/maps";

interface DisplayNameObject {
	text: string;
	languageCode: string;
}

interface RawPlace {
	displayName?: DisplayNameObject | string;
	formattedAddress?: string;
	id?: string;
	googleMapsUri?: string;
}

export interface TextSearchPlace {
	displayName: string;
	formattedAddress: string;
	id?: string;
	googleMapsUrl?: string;
}

export interface TextSearchResponse {
	places: TextSearchPlace[];
}

export interface TextSearchError {
	type: "error";
	message: string;
}

export interface TextSearchResult {
	data?: TextSearchResponse;
	error?: TextSearchError;
}

function extractDisplayName(displayName: DisplayNameObject | string | undefined): string {
	if (!displayName) return "";
	if (typeof displayName === "string") return displayName;
	return displayName.text || "";
}

function transformPlace(rawPlace: RawPlace): TextSearchPlace {
	return {
		id: rawPlace.id,
		displayName: extractDisplayName(rawPlace.displayName),
		formattedAddress: rawPlace.formattedAddress || "",
		googleMapsUrl: rawPlace.googleMapsUri,
	};
}

export async function searchPlacesByText(query: string): Promise<TextSearchResult> {
	try {
		if (!query.trim()) return { error: { type: "error", message: "Please enter a search query" } };

		const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Goog-Api-Key": GoogleMapsConfig.apiKey,
				"X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.id,places.googleMapsUri",
			},
			body: JSON.stringify({ textQuery: query, languageCode: "en" }),
		});

		if (!response.ok) {
			console.error("Google Maps API error:", response.json());
			return { error: { type: "error", message: "Failed to search places. Please try again later." } };
		}

		const data = await response.json();
		const places = Array.isArray(data.places) ? data.places.map(transformPlace) : [];
		return { data: { places } };
	} catch (error) {
		console.error("Error searching places:", error);
		return { error: { type: "error", message: "An error occurred while searching. Please try again later." } };
	}
}
