import { Send } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

export function ChatInput({ onSend, disabled, className }: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex items-end gap-2 border-t border-border bg-card px-3 py-3",
        className
      )}
    >
      <div className="relative flex-1">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
          placeholder="Escribe un mensaje..."
          className="h-11 w-full rounded-full border border-input bg-background px-4 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-mango-green focus:outline-none focus:ring-2 focus:ring-mango-green/20 disabled:opacity-60"
        />
      </div>
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mango-green text-white shadow-sm transition-colors hover:bg-mango-green-dark disabled:opacity-50 disabled:hover:bg-mango-green"
      >
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}
