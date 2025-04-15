"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ProfileBanner from "@/components/app/ProfileBanner";
import { useEffect, useState } from "react";
import { useGetTokenQuery } from "@/redux/api/api";
import { setBlogToken } from "@/redux/slices/currentBlogTopic";
import { AppSidebar } from "@/components/app/app-sidebar";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { AppRoutes } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { resetCurrentBlogTopic } from "@/redux/slices/currentBlogTopic";
import NewChatOverlay from "@/components/app/NewChatOverlay";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userState = useAppSelector((state) => state.currentUser);
  // const [openHistoryOverlay, setOpenHistoryOverlay] = useState(false);

  const {
    isFetching,
    data: tokenData,
    isSuccess,
    isError,
  } = useGetTokenQuery({ uuid: userState?.id }, { skip: !userState?.id });

  // const handleNewTopicGnerator = () => {
  //   dispatch(resetCurrentBlogTopic());
  //   router.push(AppRoutes.DASHBOARD);
  // };

  useEffect(() => {
    if (isError) return;

    if (isSuccess && tokenData?.data?.token) {
      dispatch(setBlogToken({ blogToken: tokenData.data.token }));
    }
  }, [isSuccess, isFetching, isError, tokenData, dispatch]);
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex justify-between h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-[0px] bg-white">
            <div className="flex flex-row items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>
            <div className="flex flex-row items-center gap-2">
              {/* <Button
                onClick={handleNewTopicGnerator}
                className="w- bg-purple-600 text-white rounded-md py-3 px-4 font-medium hover:bg-purple-700 transition-colors"
              >
                New Topic
              </Button>
              <Button
                onClick={() => setOpenHistoryOverlay(true)}
                className="w- bg-purple-600 text-white rounded-md py-3 px-4 font-medium hover:bg-purple-700 transition-colors"
              >
                History
              </Button> */}
              <ProfileBanner />
            </div>
          </header>
          <main className="flex-1 p-4">{children}</main>
        </SidebarInset>
      </SidebarProvider>
      {/* <NewChatOverlay
        open={openHistoryOverlay}
        onOpenChange={setOpenHistoryOverlay}
      /> */}
    </>
  );
}
