"use client"; 

import { ReactNode } from "react";
import { AppSidebar } from "../app-sidebar";

export default function TopicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}