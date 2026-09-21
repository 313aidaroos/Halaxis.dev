export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type CompleteInput = {
  messages: ChatMessage[];
  system: string;
  maxTokens?: number;
};

export interface AIProvider {
  readonly name: "anthropic" | "openai";
  complete(input: CompleteInput): Promise<string>;
  stream(input: CompleteInput): AsyncIterable<string>;
}
