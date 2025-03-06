import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export async function saveResponseData(data, filenamePrefix, stringify = true) {
	try {
		const outputDir = path.resolve(process.cwd(), "output");
		await mkdir(outputDir, { recursive: true });

		const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
		const filename = `${filenamePrefix}_${timestamp}.json`;

		await writeFile(path.join(outputDir, filename), stringify ? JSON.stringify(data, null, 2) : data, "utf8");

		console.log(`Response data saved to output/${filename}`);
	} catch (error) {
		console.error("Error saving response data:", error);
	}
}
