"use client";

import * as React from "react";
import { VersionSwitcher } from "./version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarRail,
} from "../ui/sidebar";
import { Button } from "../ui/button";
import { resetCurrentBlogTopic } from "@/redux/slices/currentBlogTopic";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/utils/customHooks/hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

import { toast } from "sonner";
import { AppRoutes, cn } from "../../lib/utils";
import { Skeleton } from "../ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { createClient } from "../../lib/supabase/client";

interface Topics {
  id: string;
  topic_name: string;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const supabase = createClient()
  const [topicLoading, setTopicLoading] = React.useState<boolean>(false);
  const [topics, setTopics] = React.useState<Topics[]>([]);
  const [editingTopic, setEditingTopic] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const router = useRouter();
  const state = useAppSelector((state) => state.currentUser);
  const blogState = useAppSelector((state) => state.currentBlogTopic);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const data = {
    versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  };
  const dispatch = useAppDispatch();
  const pathName = usePathname();

  const handleNewTopicGnerator = () => {
    dispatch(resetCurrentBlogTopic());
    router.push(AppRoutes.DASHBOARD);
  };

  const handleDeleteTopic = async (id: string) => {
    setDeleteId(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteTopic = async () => {
    const { error } = await supabase
      .from("Topics")
      .delete()
      .eq("id", deleteId)
      .select("*");
    if (error) {
      toast(error.message);
    }
    setDeleteConfirmOpen(false);
    await getTopics();
    router.push(AppRoutes.DASHBOARD);
  };

  const handleOpenUpdateDialog = (id: string, name: string) => {
    setEditingTopic(name);
    setEditingId(id);
    setDialogOpen(true);
  };

  const handleUpdateTopic = async () => {
    setIsSaving(true);
    if (editingTopic.trim()) {
      const { data, error } = await supabase
        .from("Topics")
        .update({ topic_name: editingTopic })
        .eq("id", editingId)
        .select("*");
      setDialogOpen(false);
    }
    setIsSaving(false);
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
  }, [blogState.blogData.topic, dialogOpen, deleteConfirmOpen]);

  return (
    <>
      <Sidebar {...props}>
        <SidebarHeader>
          <VersionSwitcher
            versions={data.versions}
            defaultVersion={data.versions[0]}
          />
        </SidebarHeader>
        <SidebarContent className="p-4">
          <Button
            onClick={handleNewTopicGnerator}
            className="w-full py-3 px-4 font-medium hover:bg-grey-700 transition-colors"
          >
            New Topic
          </Button>
          <SidebarGroup className="gap-1">
            {topicLoading ? (
              <SidebarGroupContent>
                <Skeleton className="h-6 w-3/4 mb-2" />
              </SidebarGroupContent>
            ) : (
              topics?.toReversed().map((item: Topics, index: number) => {
                const isActive =
                  pathName === `${AppRoutes.DASHBOARD}/${item.id}`;

                return (
                  <div
                    key={index}
                    className={cn(
                      "group flex w-full items-center rounded-lg px-2 py-1 text-sm transition-colors",
                      isActive
                        ? "bg-hover text-hover-foreground"
                        : "hover:bg-hover text-hover-foreground"
                    )}
                    // className="flex items-center w-full hover:bg-grey-50 p-1 px-2 rounded-lg"
                  >
                    <Link
                      href={`${AppRoutes.DASHBOARD}/${item.id}`}
                      className="w-full"
                    >
                      <TooltipProvider key={index}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarGroupContent
                              key={item.id}
                              className={`group flex w-full items-center rounded-lg text-sm font-medium transition-colors ${
                                isActive
                                  ? "bg-grey-100 text-grey-700"
                                  : "hover:bg-grey-50 text-gray-700"
                              } max-w-[150px] overflow-hidden whitespace-nowrap text-ellipsis`}
                              // className="group flex w-full items-center rounded-lg py-2 hover:bg-grey-50 text-sm text-gray-700 font-medium transition-colors"
                            >
                              {item.topic_name}
                            </SidebarGroupContent>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            {item.topic_name}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:text-grey-900 hover:bg-grey-50"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white">
                        <DropdownMenuItem
                          className="flex items-center cursor-pointer"
                          onClick={() =>
                            handleOpenUpdateDialog(item.id, item.topic_name)
                          }
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit Topic
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="flex items-center cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteTopic(item.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Topic
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                );
              })
            )}
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Topic</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <input
              className="w-full rounded-md border border-border px-4 py-3 bg-white/70 focus:outline-none focus:ring-2 focus:ring-grey-500"
              value={editingTopic}
              onChange={(e) => setEditingTopic(e.target.value)}
              placeholder="Topic name"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="mr-2" disabled={isSaving}>
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleUpdateTopic} disabled={isSaving}>
              {isSaving ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this topic. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteTopic}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
