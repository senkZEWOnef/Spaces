"use client";

import { useEffect } from "react";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js").catch(console.error);
  }, []);

  return <>{children}</>;
}