import { Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConnectionPillProps {
  isOnline: boolean;
  className?: string;
}

export function ConnectionPill({ isOnline, className }: ConnectionPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm",
        isOnline
          ? "bg-mango-green/10 text-mango-green-dark"
          : "bg-mango-offline/10 text-mango-offline",
        className
      )}
    >
      {isOnline ? (
        <Wifi className="h-3.5 w-3.5" />
      ) : (
        <WifiOff className="h-3.5 w-3.5" />
      )}
      {isOnline ? "Online" : "Offline"}
    </span>
  );
}
