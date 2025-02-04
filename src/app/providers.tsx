"use client";

import React from "react";
import { WalletzConfig, WalletzProvider } from "walletz";

const LocalWalletzConfig: WalletzConfig = {
  rpcUrl: "https://api.mainnet-beta.solana.com",
  autoConnect: true,
};

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletzProvider config={LocalWalletzConfig}>
      <>{children}</>
    </WalletzProvider>
  );
}
