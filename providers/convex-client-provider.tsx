"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

// Lazy initialization of Convex client to avoid errors during SSR/build
// when NEXT_PUBLIC_CONVEX_URL is not set
function createConvexClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    console.warn("NEXT_PUBLIC_CONVEX_URL is not set. Convex features will be disabled.");
    return null;
  }
  return new ConvexReactClient(url);
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const convex = useMemo(() => createConvexClient(), []);

  // If no convex client (missing env var), just render children without provider
  if (!convex) {
    return <>{children}</>;
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
