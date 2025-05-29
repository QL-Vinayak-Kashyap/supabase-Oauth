"use client";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ProfileBanner from "@/components/app/ProfileBanner";
import React, { useEffect, useState } from "react";
import { useGetTokenQuery } from "@/redux/api/api";
import { setBlogToken } from "@/redux/slices/currentBlogTopic";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { supabase } from "@/lib/supabaseClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import moment from "moment";
import { AppRoutes, cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { AppSidebar } from "../../components/app/Blog/AppSidebar";
export interface Topics {
  id: string;
  topic_name: string;
  created_at: Date;
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const pathName = usePathname();
  const [topicLoading, setTopicLoading] = React.useState<boolean>(false);
  const [topics, setTopics] = React.useState<Topics[]>([]);
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.currentUser);

  const {
    isFetching,
    data: tokenData,
    isSuccess,
    isError,
  } = useGetTokenQuery({ uuid: userState?.id }, { skip: !userState?.id });
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    if (isError) return;
    if (isSuccess && tokenData?.data?.token) {
      dispatch(setBlogToken({ blogToken: tokenData.data.token }));
    }
  }, [isSuccess, isFetching, isError, tokenData, dispatch]);

  const getTopics = async () => {
    try {
      setTopicLoading(true);
      const { data: topics } = await supabase
        .from("Topics")
        .select("*")
        .eq("user_id", userState.id);
      setTopics(topics);
    } catch (error) {
      console.log("error", error);
    } finally {
      setTopicLoading(false);
    }
  };

  useEffect(() => {
    getTopics();
  }, []);
  return (
    <SidebarProvider>
      <SidebarInset>
        <header className="flex justify-between h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-[0px] bg-white z-50">
          <div className="flex flex-row items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}  >
            <DialogTrigger asChild>
              <Button variant="outline">Open Chat History</Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[80vh] p-0">
              <DialogHeader>
                <VisuallyHidden>
                  <DialogTitle>Chat History</DialogTitle>
                </VisuallyHidden>
              </DialogHeader>

              <div className=" rounded-lg bg-background text-foreground p-4">
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-muted-foreground mb-2">
                    Actions
                  </h3>
                  <Button
                    onClick={() => {
                      setDialogOpen(false);
                      router.push(`${AppRoutes.DASHBOARD}`);
                    }}
                    variant="ghost"
                    className="w-full justify-start text-sm hover:bg-muted"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Create New Private Chat
                  </Button>
                </div>

                <Separator className="my-2" />

                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-muted-foreground mb-2">
                    History
                  </h3>
                  <div className="space-y-2 overflow-scroll  h-[300px]">
                    {topics.map(({ topic_name, created_at, id }) => {
                      const isActive = pathName === `${AppRoutes.DASHBOARD}/${id}`;
                      return (
                        <Button
                          key={id}
                          variant="ghost"
                          className={cn(
                            "group flex w-full items-center justify-between rounded-lg px-2 py-1 text-sm transition-colors",
                            isActive
                              ? "bg-hover text-hover-foreground"
                              : "hover:bg-hover text-hover-foreground"
                          )}
                          onClick={() => {
                            setDialogOpen(false);
                            router.push(
                              `${AppRoutes.DASHBOARD}/${id}?content=""`
                            );
                          }}
                        >
                          <span className="truncate">
                            {topic_name ? topic_name : "Not Available"}
                          </span>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {moment(created_at).fromNow()}
                          </span>
                        </Button>
                      )
                    }
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <div className="flex flex-row items-center gap-2">
            <ProfileBanner />
          </div>
        </header>
        <main className="flex-1 px-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
