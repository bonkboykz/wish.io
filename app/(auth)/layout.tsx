// app/(auth)/verify-email/layout.js
"use client";

import { PropsWithChildren, Suspense } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return <Suspense fallback={<div>Загрузка...</div>}>{children}</Suspense>;
}
