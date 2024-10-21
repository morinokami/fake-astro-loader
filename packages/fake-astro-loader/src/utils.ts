import type { AnthropicProvider } from "@ai-sdk/anthropic";
import { createAnthropic } from "@ai-sdk/anthropic";
import type { OpenAIProvider } from "@ai-sdk/openai";
import { createOpenAI } from "@ai-sdk/openai";

const AnthropicModelIds = [
	"claude-3-5-sonnet-20240620",
	"claude-3-opus-20240229",
	"claude-3-sonnet-20240229",
	"claude-3-haiku-20240307",
] as const;
const OpenAIModelIds = [
	"o1-preview",
	"o1-mini",
	"gpt-4o",
	"gpt-4o-2024-05-13",
	"gpt-4o-2024-08-06",
	"gpt-4o-audio-preview",
	"gpt-4o-audio-preview-2024-10-01",
	"gpt-4o-mini",
	"gpt-4o-mini-2024-07-18",
	"gpt-4-turbo",
	"gpt-4-turbo-2024-04-09",
	"gpt-4-turbo-preview",
	"gpt-4-0125-preview",
	"gpt-4-1106-preview",
	"gpt-4",
	"gpt-4-0613",
	"gpt-3.5-turbo-0125",
	"gpt-3.5-turbo",
	"gpt-3.5-turbo-1106",
] as const;
type OpenAIModelId = (typeof OpenAIModelIds)[number];
type AnthropicModelId = (typeof AnthropicModelIds)[number];
export type ModelId = OpenAIModelId | AnthropicModelId;

export function createModel(
	modelId: AnthropicModelId | OpenAIModelId = "gpt-4o-2024-08-06",
): ReturnType<AnthropicProvider | OpenAIProvider> {
	if (AnthropicModelIds.includes(modelId as AnthropicModelId)) {
		const anthropic = createAnthropic({});
		return anthropic(modelId);
	}

	const openai = createOpenAI({});
	return openai(modelId, {
		// TODO: structuredOutputs: true,
	});
}
