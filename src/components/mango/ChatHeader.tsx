import { Leaf } from "lucide-react";
import { ConnectionPill } from "./ConnectionPill";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  isOnline: boolean;
  className?: string;
}

export function ChatHeader({ isOnline, className }: ChatHeaderProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3",
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-mango-green text-white shadow-sm">
          <Leaf className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold leading-tight text-foreground">
            Mango App
          </span>
          <span className="text-xs text-muted-foreground">Asistente de Campo</span>
        </div>
      </div>
      <ConnectionPill isOnline={isOnline} />
    </header>
  );
}
