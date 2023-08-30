"use client";

import { Spinner } from "@nextui-org/react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-[50vh]">
      <Spinner color="primary" size="lg" />
    </div>
  );
}
