export const popularDishesResponseSchema = {
	type: "object",
	properties: {
		popularDishes: {
			type: "array",
			items: {
				type: "object",
				properties: {
					name: {
						type: "string",
					},
					mentions: {
						type: "number",
					},
					sentimentScore: {
						type: "number",
					},
					reviewExcerpts: {
						type: "array",
						items: {
							type: "string",
						},
					},
					rating: {
						type: "number",
					},
				},
				required: ["name", "mentions", "sentimentScore", "reviewExcerpts", "rating"],
			},
		},
	},
	required: ["popularDishes"],
};
