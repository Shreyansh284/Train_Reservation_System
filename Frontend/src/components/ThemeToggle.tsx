import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
    className?: string;
    size?: "icon" | "sm" | "lg" | "default";
};

// A single button that toggles theme and morphs between sun and moon
export function ThemeToggle({ className, size = "icon" }: Props) {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const isDark = (mounted ? resolvedTheme : theme) === "dark";

    return (
        <Button
            aria-label="Toggle theme"
            variant="ghost"
            size={size}
            className={cn("relative", className)}
            onClick={() => setTheme(isDark ? "light" : "dark")}
        >
            {/* Sun */}
            <Sun
                className={cn(
                    "h-5 w-5 transition-all duration-300",
                    isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                )}
            />
            {/* Moon */}
            <Moon
                className={cn(
                    "absolute h-5 w-5 transition-all duration-300",
                    isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                )}
            />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}

export default ThemeToggle;
