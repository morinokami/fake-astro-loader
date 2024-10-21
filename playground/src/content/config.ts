import { defineCollection, z } from "astro:content";
import { fakeLoader } from "fake-astro-loader";

const fakeBlog = defineCollection({
	loader: fakeLoader({
		modelId: "gpt-4o-mini",
		prompt:
			"Generate 5 blog posts about Astro. `rendered` must be a string of HTML.",
		schema: z.object({
			slug: z.string(),
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date(),
			heroImage: z.enum([
				"blog-placeholder-1.jpg",
				"blog-placeholder-2.jpg",
				"blog-placeholder-3.jpg",
				"blog-placeholder-4.jpg",
				"blog-placeholder-5.jpg",
				"blog-placeholder-about.jpg",
			]),
			rendered: z.string(),
		}),
	}),
});

export const collections = { fakeBlog };
