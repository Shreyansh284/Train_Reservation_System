import { Loader2 } from "lucide-react";

interface LoadingProps {
  className?: string;
  size?: number;
}

export function Loading({ className = "", size = 24 }: LoadingProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className="animate-spin" size={size} />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
