import { User, Bot } from "lucide-react";
import { OfferCard, type OfferCardData } from "./OfferCard";
import { cn } from "@/lib/utils";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  offer?: OfferCardData;
  timestamp: string;
}

interface ChatBubbleProps {
  message: Message;
  onPublishOffer?: (offer: OfferCardData) => void;
  className?: string;
}

export function ChatBubble({ message, onPublishOffer, className }: ChatBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full gap-2.5",
        isUser ? "flex-row-reverse" : "flex-row",
        className
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-mango-green text-white" : "bg-muted text-muted-foreground"
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div className={cn("flex max-w-[78%] flex-col", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "relative rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
            isUser
              ? "rounded-br-sm bg-mango-green-bubble text-foreground"
              : "rounded-bl-sm border border-border bg-card text-foreground shadow-sm"
          )}
        >
          <p>{message.content}</p>
          {message.offer && (
            <div className="mt-3">
              <OfferCard
                offer={message.offer}
                onPublish={() => message.offer && onPublishOffer?.(message.offer)}
              />
            </div>
          )}
        </div>
        <span className="mt-1 text-[10px] text-muted-foreground">{message.timestamp}</span>
      </div>
    </div>
  );
}
