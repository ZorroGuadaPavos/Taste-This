import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
	theme: {
		semanticTokens: {
			colors: {
				bg: {
					DEFAULT: {
						value: { _light: "#F3F3EE", _dark: "#312a37" },
					},
					400: {
						value: { _light: "#a8a89a", _dark: "#eae9eb" },
					},
					300: {
						value: { _light: "#bdbdad", _dark: "#c1bfc3" },
					},
					200: {
						value: { _light: "#d3d3c1", _dark: "#78727c" },
					},
					100: {
						value: { _light: "#deded0", _dark: "#2F363D" },
					},
					50: {
						value: { _light: "#e8e8df", _dark: "#453f4b" },
					},
					input: {
						value: { _light: "{colors.gray.400}", _dark: "#2c2531" },
					},
					box: {
						value: { _light: "#24292E", _dark: "#24292E" },
					},
					code: {
						value: { _light: "#191919", _dark: "#202429" },
					},
				},
				fg: {
					DEFAULT: {
						value: { _light: "#726051", _dark: "{colors.gray.200}" },
					},
					muted: {
						value: { _light: "#a8a89a", _dark: "{colors.gray.400}" },
					},
				},
				accent: {
					blue: {
						value: "#20B8CD",
					},
					"blue.dark": {
						value: "#204044",
					},
					"red.dark": {
						value: "#57303A",
					},
					"green.dark": {
						value: "#2E493F",
					},
				},
			},
		},
	},
});

export const system = createSystem(defaultConfig, config);
