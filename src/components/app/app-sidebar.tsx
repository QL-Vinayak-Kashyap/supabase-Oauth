"use client";

import * as React from "react";
import { VersionSwitcher } from "@/components/app/version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { resetCurrentBlogTopic } from "@/redux/slices/currentBlogTopic";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";

interface Topics {
  id: string;
  topic_name: string;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [topicLoading, setTopicLoading] = React.useState<boolean>(false);
  const [topics, setTopics] = React.useState<Topics[]>([]);
  const router = useRouter();
  const state = useAppSelector((state) => state.currentUser);
  const blogState = useAppSelector((state) => state.currentBlogTopic);
  const data = {
    versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  };
  const dispatch = useAppDispatch();

  const handleNewTopicGnerator = () => {
    dispatch(resetCurrentBlogTopic());
    router.push("/dashboard");
  };

  const getTopics = async () => {
    try {
      setTopicLoading(true);
      const { data: topics } = await supabase
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
      </SidebarHeader>
      <SidebarContent>
        <Button
          onClick={handleNewTopicGnerator}
          className="group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        >
          New Topic
        </Button>
        <SidebarGroup>
          {topicLoading && (
            <SidebarGroupContent>Loading...</SidebarGroupContent>
          )}
          {!topicLoading &&
            topics?.toReversed().map((item: Topics, index: number) => (
              <SidebarGroupContent
                key={item.id}
                className="group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                <Link href={`/dashboard/${item.id}`}>{item.topic_name}</Link>
              </SidebarGroupContent>
            ))}
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
