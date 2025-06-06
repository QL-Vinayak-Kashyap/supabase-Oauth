"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BookOpen, PlusCircle } from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathName = usePathname();

  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-16 border-b-gray-100 border-b-2 justify-center items-start">
        <Link href="/">
          <div className="flex items-center">
            <img
              src="/writeeasy.png"
              alt="WriteEasy Logo"
              className="h-10 w-10 mr-2"
            />
            <h1 className="text-2xl font-normal tracking-tighter">
              Write<span className="font-bold">Easy</span>
            </h1>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="">
        <SidebarGroup>
          <SidebarGroupContent className="">
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "flex items-center gap-2 rounded py-2 text-sm transition-colors",
                    pathName.includes("blog-writer")
                      ? "bg-gray-200 font-semibold text-primary"
                      : "bg-white text-primary hover:bg-gray-100"
                  )}
                >
                  <Link href="/dashboard/blog-writer">
                    <PlusCircle className="h-4 w-4" />
                    Add New Article
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>  

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "flex items-center gap-2 rounded py-2 text-sm transition-colors",
                    pathName.includes("blog-library")
                      ? "bg-gray-200 font-semibold text-primary"
                      : "bg-white text-primary hover:bg-gray-100"
                  )}
                >
                  <Link href="/dashboard/blog-library">
                    <BookOpen className="h-4 w-4" />
                    History
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
} 
