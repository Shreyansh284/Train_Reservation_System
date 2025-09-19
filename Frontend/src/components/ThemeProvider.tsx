import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ReactNode } from "react";

type Props = {
    children: ReactNode;
};

// Wrapper to control dark/light theme using Tailwind's class strategy
export function ThemeProvider({ children }: Props) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {children}
        </NextThemesProvider>
    );
}

export default ThemeProvider;
