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
import { supabase } from "@/lib/supabaseClient";
import { setUser } from "@/redux/slices/currentUserSlice";
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
  const [userData, setUserData] = useState<any>();

  const {
    isFetching,
    data: tokenData,
    isSuccess,
    isError,
  } = useGetTokenQuery({ uuid: userData?.id }, { skip: !userData?.id });

  const getUser = async () => {
    const token = userState.token;
    const {
      data: { user },
    } = await supabase.auth.getUser(token);
    setUserData(user);
    dispatch(
      setUser({
        isLoggedIn: true,
        email: user?.email ?? "",
        token: token,
        full_name: user?.user_metadata?.full_name,
        id: user?.id,
      })
    );
  };

  useEffect(() => {
    (async () => {
      await getUser();
    })();
  }, []);

  useEffect(() => {
    if (isError) return;

    if (isSuccess && tokenData?.data?.token) {
      dispatch(setBlogToken({ blogToken: tokenData.data.token }));
    }
  }, [isSuccess, isFetching, isError, tokenData, dispatch]);
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex justify-between h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-[0px]">
          <div className="flex flex-row items-center gap-2 ">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ProfileBanner />
        </header>
        <main className="flex-1 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
