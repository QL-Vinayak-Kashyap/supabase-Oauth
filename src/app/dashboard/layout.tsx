"use client";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import React, { useEffect } from "react";
import { useGetTokenQuery } from "@/redux/api/api";
import { setBlogToken } from "@/redux/slices/currentBlogTopic";
import { useAppDispatch, useAppSelector } from "@/utils/customHooks/hooks";

import { AppSidebar } from "../../components/app/Blog/AppSidebar";
import Navbar from "@/components/app/DashboardNavbar";
import { setUser } from "@/redux/slices/currentUserSlice";
import useUser from "@/utils/customHooks/useUser";
import { UserName } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.currentUser);
  const { loading, user, session } = useUser();

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

  useEffect(() => {
    dispatch(setUser({
      isLoggedIn: true,
      email: user?.email ?? "",
      token: session?.access_token,
      full_name: user?.user_metadata?.full_name ?? UserName.ADMIN,
      id: user?.id,
    }))
  }, [loading, user, session])

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <Navbar/>
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
