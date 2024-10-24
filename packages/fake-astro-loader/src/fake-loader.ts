import { generateObject } from "ai";
import type { Loader } from "astro/loaders";
import type { ZodObject } from "astro/zod";
import { z } from "astro/zod";
import stringify from "json-stable-stringify";
import { zerialize } from "zodex";

import type { ModelId } from "./utils";
import { createModel } from "./utils";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type Schema = ZodObject<any>;

export type FakeLoaderOptions = {
	schema: Schema;
	prompt: string;
	modelId?: ModelId;
};

function stringifyZodSchema(schema: Schema) {
	return stringify(zerialize(schema));
}

export function fakeLoader({
	schema,
	prompt,
	modelId,
}: FakeLoaderOptions): Loader {
	return {
		name: "fake-loader",
		load: async ({ logger, store, generateDigest, meta }) => {
			logger.info("Generating fake data");

			const digest = generateDigest(stringifyZodSchema(schema));
			if (digest === meta.get("schemaDigest")) {
				logger.info("Schema unchanged, skipping generation");
				return;
			}

			store.clear();

			const model = createModel(modelId);
			const { object, usage } = await generateObject({
				model,
				schema: z.object({ fakeCollection: z.array(schema) }),
				prompt,
			});

			const { fakeCollection } = object;
			for (let i = 0; i < fakeCollection.length; i++) {
				const data = fakeCollection[i];
				store.set({
					id: String(data.id ? data.id : i),
					data,
					rendered: data.rendered ? { html: data.rendered } : undefined,
				});
			}

			meta.set("schemaDigest", digest);

			logger.info(`Generated fake data (total tokens: ${usage.totalTokens})`);
		},
		schema: () => schema,
	};
}
