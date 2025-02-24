"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppSelector } from '@/hooks/hooks';
import { AppSidebar } from "@/components/app/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { RootState } from '@/redux/store';
import { ContentGenerator } from '@/components/app/content-generator';

export default function Dashboard() {
        const router = useRouter();

    const currentUser =useAppSelector((store):RootState => store.currentUser)
    // console.log("above current user",currentUser);
    useEffect(() => {
        // const token = document.cookie.includes('token'); // Check if token exists
        // const ifUser =
        // if (!token) router.push('/login'); // Redirect to login if no token
        // console.log("currentUser",currentUser);
        // console.log("login status",currentUser?.isLoggedIn);
        if(!currentUser?.isLoggedIn){
            router.push('/login');   
        }
    }, []);
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              {/* <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem> */}
            </BreadcrumbList>
          </Breadcrumb>

        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="container mx-auto py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Content Generator</h1>
          <p className="text-muted-foreground">
            Enter your topic and desired word count to generate AI-powered content.
          </p>
        </div>
        <ContentGenerator />
      </div>
    </div>
          {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> */}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
