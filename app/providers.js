"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";

export const AuthProvider = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export const ProviderUI = ({ children }) => {
  return <NextUIProvider>{children}</NextUIProvider>;
};
