"use client";

import {
  SidebarInset,
  SidebarProvider,
} from "../../components/ui/sidebar";
import React, { useEffect } from "react";
import { useGetTokenQuery } from "@/redux/api/api";
import { setBlogToken } from "@/redux/slices/currentBlogTopic";
import { useAppDispatch, useAppSelector } from "@/utils/customHooks/hooks";

import { AppSidebar } from "../../components/app/Blog/AppSidebar";
import Navbar from "../../components/app/DashboardNavbar";
import { setUser, setUserLimit } from "@/redux/slices/currentUserSlice";
import useUser from "@/utils/customHooks/useUser";
import { TablesName, UserName } from "../../lib/utils";
import { createClient } from "@/lib/supabase/client";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient()
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

  const checkLimit = async () => {
    const { data: limit, error } = await supabase
      .from(TablesName.PROFILE)
      .select("*")
      .eq("id", userState.id);
    if (limit) {
      // setLimitLeftState(limit[0]?.daily_limit);
      dispatch(setUserLimit({ limitLeft: limit[0]?.daily_limit }));
    }
  };

  useEffect(() => {
    checkLimit()
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
        <Navbar />
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
