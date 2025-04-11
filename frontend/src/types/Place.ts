export interface Place {
	id: string;
	name: string;
	address: string;
	rating: number | null;
	reviewCount: number | null;
	categories: string[] | null;
	priceLevel: string | null;
	openNow: boolean;
	phone: string | null;
	website: string | null;
	photos: string[];
	accessibility: string[] | null;
}
