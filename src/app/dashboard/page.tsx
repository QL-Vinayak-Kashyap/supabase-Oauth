"use client";

import { AppSidebar } from "@/components/app/app-sidebar";
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
import { ContentGenerator } from "@/components/app/content-generator";
import ProfileBanner from "@/components/app/ProfileBanner";
import { useEffect, useState } from "react";
import { useGetTokenQuery } from "@/redux/api/api";
import { supabase } from "@/lib/supabaseClient";
import { setUser } from "@/redux/slices/currentUserSlice";
import { useDispatch } from "react-redux";
import { setBlogToken } from "@/redux/slices/currentBlogTopic";

export default function Dashboard() {
  const dispatch =useDispatch();
  const [userData, setUserData] =useState<any>();
  
  const {isFetching, data: tokenData, isSuccess, isError} = useGetTokenQuery({uuid:userData?.id});

  const getUser = async ()=>{
    const token = JSON.parse(localStorage.getItem("sb-ggwdyutynlfgigfwmzug-auth-token") ?? "").access_token;
    const {data:{user}} = await supabase.auth.getUser(token);
    setUserData(user);
    dispatch(setUser({isLoggedIn:true,
      email:user?.email ?? "",
      token:token,
      full_name:user?.user_metadata.full_name
    }));
  }


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
        <header className="flex justify-between h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-[0px] bg-[#131734]">
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
          <ProfileBanner/>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="container mx-auto py-10">
            <div className="mx-auto max-w-5xl space-y-8">
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Content/Blog Creator
                </h1>
                <p className="text-muted-foreground">
                  Enter your topic and desired word count to generate AI-powered
                  content.
                </p>
              </div>
              <ContentGenerator />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
