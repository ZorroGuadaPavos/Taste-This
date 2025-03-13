import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

// export const textStyles = defineTextStyles({
// 	body: {
// 		value: {
// 			fontFamily: "Quicksand', sans-serif",
// 		},
// 	},
// });

const config = defineConfig({
	theme: {
		// textStyles,
		semanticTokens: {
			colors: {
				bg: {
					DEFAULT: {
						value: { _light: "#FAF5F5", _dark: "#2B2238" },
					},
					400: {
						value: { _light: "#D0CDCD", _dark: "#E0DBE6" },
					},
					300: {
						value: { _light: "#E2DFE0", _dark: "#B8B0BF" },
					},
					200: {
						value: { _light: "#EDE9EA", _dark: "#665B71" },
					},
					100: {
						value: { _light: "#F4F1F2", _dark: "#332A3D" },
					},
					50: {
						value: { _light: "#F9F7F8", _dark: "#3E3548" },
					},
					input: {
						value: { _light: "#FFFFFF", _dark: "#271E32" },
					},
					box: {
						value: { _light: "#FFFFFF", _dark: "#241B2F" },
					},
					code: {
						value: { _light: "#F7F0F3", _dark: "#231B29" },
					},
				},
				fg: {
					DEFAULT: {
						value: { _light: "#5D4B57", _dark: "#E6DFE3" },
					},
					muted: {
						value: { _light: "#9B8E97", _dark: "#A29AA0" },
					},
				},
				accent: {
					pink: {
						value: "#F7B1D0",
					},
					"pink.dark": {
						value: "#D985B0",
					},
					sakura: {
						value: "#FFB7C5",
					},
					matcha: {
						value: "#89B893",
					},
					"matcha.dark": {
						value: "#5D7F64",
					},
					"matcha.light": {
						value: "#DDF0E0",
					},
					lavender: {
						value: "#C8A2D4",
					},
					"lavender.light": {
						value: "#E8D7ED",
					},
				},
			},
		},
	},
});

export const system = createSystem(defaultConfig, config);
