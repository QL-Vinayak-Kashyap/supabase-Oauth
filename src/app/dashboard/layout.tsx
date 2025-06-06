"use client";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import React, { useEffect } from "react";
import { useGetTokenQuery } from "@/redux/api/api";
import { setBlogToken } from "@/redux/slices/currentBlogTopic";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";

import { AppSidebar } from "../../components/app/Blog/AppSidebar";
import Navbar from "@/components/app/DashboardNavbar";

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
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <Navbar/>
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
