import type {ReactNode} from "react";
import {AuthGate} from "./auth-gate";

export default function LaunchLibraryAuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AuthGate>{children}</AuthGate>;
}
