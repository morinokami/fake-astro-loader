# fake-astro-loader

fake-astro-loader lets you load any content you want into your Astro content collections. You define the shape of your data using [Zod](https://github.com/colinhacks/zod) schemas, and fake-astro-loader will generate the data for you using LLMs like `gpt-4o-mini`. It's useful during the prototyping phase when you don't have real data yet.

## Installation

```sh
npm install fake-astro-loader
```

## Usage

fake-astro-loader currently supports the following AI providers for generating data:

- [OpenAI](https://openai.com/)
- [Anthropic](https://www.anthropic.com/)

To use fake-astro-loader, obtain an API key from one of these providers. Once you have it, set it as an environment variable, either `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`, using the `export` command. For example:

```sh
export OPENAI_API_KEY=your-api-key
```

Additionally, you need to use Astro v4.14.0 or later to use fake-astro-loader. Enable the experimental content layer in your `astro.config.mjs`:

```js
export default defineConfig({
  experimental: {
    contentLayer: true,
  },
});
```

Now you can define your content collection in `src/content/config.ts`:

```ts
import { defineCollection, z } from "astro:content";
import { fakeLoader } from "fake-astro-loader";

const fakeBlog = defineCollection({
  loader: fakeLoader({
    modelId: "gpt-4o-mini",
    prompt: "Generate 5 blog posts about Astro.",
    schema: z.object({
      slug: z.string(),
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
    }),
  }),
});

export const collections = { fakeBlog };
```

If you want to generate HTML content for the collection, add a `rendered` field to your schema and set it to `z.string()`. Then, update the prompt to instruct the model to include HTML content in the field. After that, you can use [the `render` function](https://5-0-0-beta.docs.astro.build/en/guides/content-collections/#rendering-body-content) to display the HTML content on a page.

There's a demo project in [the `playground` directory](https://github.com/morinokami/fake-astro-loader/tree/main/playground), so feel free to check it out to see how to use fake-astro-loader.

## Options

- `schema`: A Zod schema that defines the shape of your data.
- `prompt`: A prompt that describes what kind of data you want to generate.
- `modelId`: A model ID to use for generating the data. Defaults to `gpt-4o-mini`.

## Available Model IDs

- OpenAI
  - o1-preview
  - o1-mini
  - gpt-4o
  - gpt-4o-2024-05-13
  - gpt-4o-2024-08-06
  - gpt-4o-audio-preview
  - gpt-4o-audio-preview-2024-10-01
  - gpt-4o-mini
  - gpt-4o-mini-2024-07-18
  - gpt-4-turbo
  - gpt-4-turbo-2024-04-09
  - gpt-4-turbo-preview
  - gpt-4-0125-preview
  - gpt-4-1106-preview
  - gpt-4
  - gpt-4-0613
  - gpt-3.5-turbo-0125
  - gpt-3.5-turbo
  - gpt-3.5-turbo-1106
- Anthropic
  - claude-3-5-sonnet-20240620
  - claude-3-opus-20240229
  - claude-3-sonnet-20240229
  - claude-3-haiku-20240307
