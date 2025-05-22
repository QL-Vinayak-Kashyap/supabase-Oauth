"use client";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ProfileBanner from "@/components/app/ProfileBanner";
import { useEffect } from "react";
import { useGetTokenQuery } from "@/redux/api/api";
import { setBlogToken } from "@/redux/slices/currentBlogTopic";
import { AppSidebar } from "@/components/app/app-sidebar";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.currentUser);

  const {
    isFetching,
    data: tokenData,
    isSuccess,
    isError,
  } = useGetTokenQuery({ uuid: userState?.id }, { skip: !userState?.id });


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
          <header className="flex justify-between h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-[0px] bg-white z-50">
            <div className="flex flex-row items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>
            <div className="flex flex-row items-center gap-2">
              <ProfileBanner />
            </div>
          </header>
          <main className="flex-1 px-4">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
