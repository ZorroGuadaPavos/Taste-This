import type { GetRestaurantsResponse } from "@/client";

type BackendRestaurant = GetRestaurantsResponse["restaurants"][number];

export interface Place extends Omit<BackendRestaurant, "id" | "name" | "address"> {
	id: string;
	name: string;
	address: string;
}
