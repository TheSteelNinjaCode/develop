"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React, { useEffect, useState } from "react";
import { trpc } from "./client";
// import { parse, stringify } from "flatted";
import { useUserAuthStore } from "../stores/useAuthStore";

export default function Provider({ children }: { children: React.ReactNode }) {
  const localToken = useUserAuthStore((s) => s.token);
  const [token, setToken] = useState(localToken || "");

  useEffect(() => {
    setToken(localToken || "");
  }, [localToken]); // Dependency array ensures this runs only when localToken changes

  const [queryClient] = useState(() => new QueryClient({}));
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:3333/trpc",
          headers() {
            return {
              Authorization: `Bearer ${token}`,
            };
          },
        }),
      ],
      // transformer: {
      //   serialize: stringify,
      //   deserialize: parse,
      // },
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
