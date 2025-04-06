import { SortEnum } from "../types/enums.js";

/**
 * Validates parameters for the Google Maps review scraper.
 *
 * @param {string} placeId - The Google Maps place ID.
 * @param {string} sort_type - Must be a valid key in SortEnum.
 * @param {string|number} pages - "max" or a number.
 * @param {boolean} clean - Must be a boolean.
 * @throws {Error} If any parameter is invalid.
 */
export function validateParams(placeId, sort_type, pages, clean) {
	if (!placeId) {
		throw new Error("Place ID is required");
	}
	if (!SortEnum[sort_type]) {
		throw new Error(`Invalid sort type: ${sort_type}`);
	}
	if (pages !== "max" && Number.isNaN(Number(pages))) {
		throw new Error(`Invalid pages value: ${pages}`);
	}
	if (typeof clean !== "boolean") {
		throw new Error(`Invalid value for 'clean': ${clean}`);
	}
}
