import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

import type { AIProvider, ChatMessage, CompleteInput } from "@/lib/ai/types";

const DEFAULT_ANTHROPIC_MODEL = "claude-sonnet-4-5";
const DEFAULT_OPENAI_MODEL = "gpt-4.1-mini";

function toAnthropicMessages(messages: ChatMessage[]) {
  return messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));
}

function toOpenAiMessages(system: string, messages: ChatMessage[]) {
  return [
    { role: "system" as const, content: system },
    ...messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  ];
}

class AnthropicProvider implements AIProvider {
  readonly name = "anthropic" as const;
  private client: Anthropic;
  private model: string;

  constructor() {
    this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    this.model = process.env.AI_MODEL || DEFAULT_ANTHROPIC_MODEL;
  }

  async complete({
    messages,
    system,
    maxTokens = 800,
  }: CompleteInput): Promise<string> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: maxTokens,
      system,
      messages: toAnthropicMessages(messages),
    });
    const block = response.content.find((part) => part.type === "text");
    return block && block.type === "text" ? block.text : "";
  }

  async *stream({ messages, system }: CompleteInput): AsyncIterable<string> {
    const stream = this.client.messages.stream({
      model: this.model,
      max_tokens: 800,
      system,
      messages: toAnthropicMessages(messages),
    });

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        yield event.delta.text;
      }
    }
  }
}

class OpenAIProvider implements AIProvider {
  readonly name = "openai" as const;
  private client: OpenAI;
  private model: string;

  constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.model = process.env.AI_MODEL || DEFAULT_OPENAI_MODEL;
  }

  async complete({
    messages,
    system,
    maxTokens = 800,
  }: CompleteInput): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      max_tokens: maxTokens,
      messages: toOpenAiMessages(system, messages),
    });
    return response.choices[0]?.message?.content ?? "";
  }

  async *stream({ messages, system }: CompleteInput): AsyncIterable<string> {
    const stream = await this.client.chat.completions.create({
      model: this.model,
      max_tokens: 800,
      stream: true,
      messages: toOpenAiMessages(system, messages),
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) yield delta;
    }
  }
}

export function createAIProvider(): AIProvider {
  const provider = (process.env.AI_PROVIDER || "anthropic").toLowerCase();
  if (provider === "openai") {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set");
    }
    return new OpenAIProvider();
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }
  return new AnthropicProvider();
}
