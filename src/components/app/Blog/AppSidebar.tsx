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
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { setCurrentSelectedId, setCurrentTopicBlogs } from "@/redux/slices/currentBlogs";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const dispatch =useAppDispatch();
  const pathname = usePathname();
  const { topic_id } = useParams();
  const {generatedBlog} =useAppSelector((state: any)=>state.currentBlog)

  const [blogs, setBlogs] = React.useState([]);

  const menuItems = [];

  blogs.forEach((blog, index) => {
    menuItems.push({
      name: `Content ${index + 1}`,
    });
  });

  // const getContentFromSupabase = async () => {
  //   const { data: blogs } = await supabase
  //     .from(TablesName.BLOGS)
  //     .select("*")
  //     .eq("topic_id", topic_id);
  //   if (blogs) {
  //     setBlogs(blogs);
  //     dispatch(setCurrentTopicBlogs(blogs))
  //   }
  // };
  // console.log("blogs", blogs);
  // React.useEffect(() => {
  //   getContentFromSupabase();
  // }, [topic_id]);
  console.log("currentBlog.generatedBlog",generatedBlog);
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <h2 className="text-lg font-semibold p-4">Topic Menu</h2>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent className="space-y-2">
            {generatedBlog?.map((item, index) => {
              return (<div key={index}>
                  <Button onClick={()=> dispatch(setCurrentSelectedId({currentSelectedId: item.id}))} variant="ghost" className="w-full">
                    {item.id}
                  </Button> 
              </div>
              );
            })}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
