export interface Photo {
	name: string;
	widthPx?: number;
	heightPx?: number;
	authorAttributions?: Array<{
		displayName?: string;
		uri?: string;
		photoUri?: string;
	}>;
}
