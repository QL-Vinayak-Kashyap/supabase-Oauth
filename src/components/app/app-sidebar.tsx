"use client";

import * as React from "react";
import { VersionSwitcher } from "@/components/app/version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { resetCurrentBlogTopic } from "@/redux/slices/currentBlogTopic";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [topicLoading, setTopicLoading] = React.useState(false);
  const [topics, setTopics] = React.useState([]);
  const router = useRouter();
  const state = useSelector((state) => state.currentUser);
  const blogState = useSelector((state) => state.currentBlogTopic);
  const data = {
    versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  };
  const dispatch = useDispatch();

  const handleNewTopicGnerator = () => {
    dispatch(resetCurrentBlogTopic());
    router.push("/dashboard");
  };

  const getTopics = async () => {
    try {
      setTopicLoading(true);
      let { data: topics, error, } = await supabase
        .from("Topics")
        .select("*")
        .eq("user_id", state.id);
      setTopics(topics);
    } catch (error) {
      console.log("error", error);
    } finally {
      setTopicLoading(false);
    }
  };

  console.log("topics", topics);

  React.useEffect(() => {
    getTopics();
  }, [blogState.topic]);

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
        {/* <SearchForm /> */}
      </SidebarHeader>
      <SidebarContent>
        <Button onClick={handleNewTopicGnerator}>New Topic</Button>
        <SidebarGroup>
          {topicLoading && (
            <SidebarGroupContent>Loading...</SidebarGroupContent>
          )}
          {!topicLoading &&
            topics?.map((item: any, index: number) => (
              <SidebarGroupContent key={index}>
                <Link href={`/dashboard/${item.id}`}>{item.topic_name}</Link>
              </SidebarGroupContent>
            ))}
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
