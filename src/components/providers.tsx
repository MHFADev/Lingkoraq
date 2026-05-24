"use client";

import { ReactNode } from "react";
import { ReactLenis } from "lenis/react";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
        {children}
      </ReactLenis>
    </ThemeProvider>
  );
}
