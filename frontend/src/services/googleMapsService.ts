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
	name?: string;
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

export interface PlaceDetails {
	id: string;
	displayName: string;
	formattedAddress?: string;
	websiteUri?: string;
	internationalPhoneNumber?: string;
	rating?: number;
	priceLevel?: string;
	priceRange?: {
		startPrice?: {
			currencyCode?: string;
			units?: string;
			nanos?: number;
		};
		endPrice?: {
			currencyCode?: string;
			units?: string;
			nanos?: number;
		};
	};
	businessStatus?: string;
	types?: string[];
	regularOpeningHours?: {
		openNow?: boolean;
	};
	photos?: Array<{
		name: string;
		widthPx?: number;
		heightPx?: number;
		authorAttributions?: Array<{
			displayName?: string;
			uri?: string;
			photoUri?: string;
		}>;
	}>;
}

export interface PlaceDetailsResponse {
	place: PlaceDetails;
}

export interface PlaceDetailsError {
	type: "error";
	message: string;
}

export interface PlaceDetailsResult {
	data?: PlaceDetailsResponse;
	error?: PlaceDetailsError;
}

function extractDisplayName(displayName: DisplayNameObject | string | undefined): string {
	if (!displayName) return "";
	if (typeof displayName === "string") return displayName;
	return displayName.text || "";
}

function transformPlace(rawPlace: RawPlace): TextSearchPlace {
	const displayName = extractDisplayName(rawPlace.displayName);
	return {
		id: rawPlace.id,
		displayName: displayName,
		name: displayName,
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

function transformPlaceDetails(rawPlace: any): PlaceDetails {
	return {
		id: rawPlace.id || "",
		displayName: extractDisplayName(rawPlace.displayName),
		formattedAddress: rawPlace.formattedAddress || "",
		websiteUri: rawPlace.websiteUri || "",
		internationalPhoneNumber: rawPlace.internationalPhoneNumber || "",
		rating: rawPlace.rating,
		priceLevel: rawPlace.priceLevel,
		priceRange: rawPlace.priceRange || undefined,
		businessStatus: rawPlace.businessStatus,
		types: rawPlace.types || [],
		regularOpeningHours: rawPlace.regularOpeningHours || {},
		photos: rawPlace.photos || [],
	};
}

export async function getPlaceDetails(placeId: string): Promise<PlaceDetailsResult> {
	if (!placeId.trim()) {
		return { error: { type: "error", message: "Place ID is required" } };
	}
	try {
		const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-Goog-Api-Key": GoogleMapsConfig.apiKey,
				"X-Goog-FieldMask":
					"id,displayName,formattedAddress,websiteUri,internationalPhoneNumber,rating,priceLevel,priceRange,businessStatus,types,regularOpeningHours,photos",
			},
		});

		if (!response.ok) {
			console.error("Google Maps API error:", await response.json());
			return { error: { type: "error", message: "Failed to fetch place details. Please try again later." } };
		}

		const data = await response.json();
		const place = transformPlaceDetails(data);
		return { data: { place } };
	} catch (error) {
		console.error("Error fetching place details:", error);
		return {
			error: { type: "error", message: "An error occurred while fetching place details. Please try again later." },
		};
	}
}
