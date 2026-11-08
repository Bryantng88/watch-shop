import type {Conversation} from "./simulation";

export function waitingMediaDraft(chat: Conversation | undefined, productId: string) {
  const last = chat?.messages.at(-1);
  const request = last?.mediaDraftRequest;
  return last?.role === "assistant" && request?.mode === "draft" && request.productId === productId
    ? request.sourceMessageId
    : undefined;
}
