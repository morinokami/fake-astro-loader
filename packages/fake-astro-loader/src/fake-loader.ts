import { generateObject } from "ai";
import type { Loader } from "astro/loaders";
import type { ZodSchema } from "astro/zod";
import { z } from "astro/zod";

import type { ModelId } from "./utils";
import { createModel } from "./utils";

export type FakeLoaderOptions = {
	schema: ZodSchema;
	prompt: string;
	modelId?: ModelId;
};

export function fakeLoader({
	schema,
	prompt,
	modelId,
}: FakeLoaderOptions): Loader {
	return {
		name: "fake-loader",
		load: async ({ logger, store }) => {
			logger.info("Generating fake data");
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

			logger.info(`Generated fake data (total tokens: ${usage.totalTokens})`);
		},
		schema: () => schema,
	};
}
