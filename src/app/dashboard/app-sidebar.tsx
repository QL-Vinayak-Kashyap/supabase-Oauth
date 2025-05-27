"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { AppRoutes } from "@/lib/utils";
import { Home, Settings, MessageSquare } from "lucide-react";
import { TablesName } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { topic_id } = useParams();

  const [blogs, setBlogs] = React.useState([]);

  const menuItems = [];

  blogs.forEach((blog, index) => {
    menuItems.push({
      name: `Content ${index + 1}`,
      // href: `${AppRoutes.DASHBOARD}/${topicId}/content/${blog.id}`,
    });
  });

  const getContentFromSupabase = async () => {
    const { data: blogs } = await supabase
      .from(TablesName.BLOGS)
      .select("*")
      .eq("topic_id", topic_id);
    if (blogs) {
      setBlogs(blogs);
    }
  };
  React.useEffect(() => {
    getContentFromSupabase();
  }, [topic_id]);
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <h2 className="text-lg font-semibold p-4">Topic Menu</h2>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent className="space-y-2">
            {menuItems?.map((item, index) => {
              return (
                <Link href="" key={index}>
                  <Button variant="ghost" className="w-full">
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
