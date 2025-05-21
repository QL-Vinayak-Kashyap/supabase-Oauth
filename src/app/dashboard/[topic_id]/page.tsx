"use client";

import { ContentGenerator } from "@/components/app/content-generator";
import GeneratedContentCard from "@/components/app/GeneratedContentCard";
import TopicCard from "@/components/app/TopicCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { supabase } from "@/lib/supabaseClient";
import { TablesName } from "@/lib/utils";
import { useLazyGenerateBlogQuery } from "@/redux/api/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Loader2, Zap } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import { setUserLimit } from "@/redux/slices/currentUserSlice";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import TopicDescriptionDialog from "@/components/app/TopicDescriptionDialog";
import StickySupportButton from "@/components/app/StickySUpportButton";

const blogFormSchema = z.object({
  word_count: z.coerce
    .number()
    .min(100, { message: "Minimum 100 words required" })
    .max(1200, { message: "Maximum 1200 words allowed" }),
});

type BlogFormValues = z.infer<typeof blogFormSchema>; 

const page = () => {
  const { topic_id } = useParams();
  const [topicData, setTopicData] = useState<any>();
  const [isTopicDataLoading, setIsTopicDataLoading] = useState<boolean>();
  const [outlineMarkdown, setOutlineMarkdown] =
    useState<string>("# Hello Markdown");
  const [dialogOpen, setDialogOpen] = useState<boolean>();
  const [blogCount, setBlogCount] = useState<Number>();
  const [blogGeneratedState, setBlogGeneratedState] = useState<boolean>(false);
  const userState = useAppSelector((state) => state.currentUser);
  const state = useAppSelector((state) => state.currentBlogTopic);
  const dispatch = useAppDispatch();

  const [
    triggerGenerateBlog,
    { data: generatedBlog, isLoading: loadingFirstBlog },
  ] = useLazyGenerateBlogQuery();

  const blogForm = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      word_count: 1000,
    },
  });

  const fetchTopicData = async () => {
    try {
      setIsTopicDataLoading(true);
      const { data: Topics, error, status } = await supabase
        .from(TablesName.TOPICS)
        .select("*")
        .eq("id", topic_id);
      if (error) throw new Error("Error in fetching the Topic Data.");

      if(status === 200){
        setTopicData(Topics[0]);
        setOutlineMarkdown(Topics[0]?.outline);
      }
    } catch (error) {
    } finally {
      setIsTopicDataLoading(false);
    }
  };

  async function handleGenerateBlog(value: any) {
    if (userState.limitLeft === 0) {
      toast("Limit reached!!!");
      return;
    }
    try {
      value["token"] = state?.blogToken || "";
      const requestData = {
        topic: topicData.topic_name,
        tone: topicData.tone,
        outline: topicData.outline,
        main_keyword: topicData.main_keyword,
        secondary_keywords: topicData.secondary_keywords,
        ...value,
      };

      const { data: blogData, isSuccess } = await triggerGenerateBlog(
        requestData
      );
      const { data: limit, error } = await supabase
        .from("users")
        .update({ daily_limit: userState.limitLeft - 1 })
        .eq("uuid", userState.id)
        .select();

      if (!error) {
        dispatch(setUserLimit({ limitLeft: limit[0]?.daily_limit }));
      }

      if (!blogData || !isSuccess) throw new Error("Blog generation failed");

      const { error: blogInsertError } = await supabase
        .from(TablesName.BLOGS)
        .insert([
          {
            topic_id: topic_id,
            content: blogData?.data?.blog,
            feedback: blogData?.data?.feedback ?? "",
            // banner_description: blogData?.data?.banner_description,
            // meta_description: blogData?.data?.meta_description
          },
        ])
        .select();

      const { error: descriptionInsertError, data: updatedTopicData } = await supabase
        .from(TablesName.TOPICS)
        .update([
          {
            // topic_id: topic_id,
            // content: blogData?.data?.blog,
            // feedback: blogData?.data?.feedback ?? "",
            banner_description: blogData?.data?.banner_description,
            meta_description: blogData?.data?.meta_description
          },
        ])
        .eq('id', topic_id)
        .select()
        setTopicData(updatedTopicData[0]);
      if (blogData) {
        setBlogGeneratedState(true);  
        toast("Blog Generated");
      }
    } catch (error) { }
  }

  const handleOpenUpdateOutlineDailog = () => {
    setDialogOpen(true);
  };

  useEffect(() => {
    fetchTopicData();
  }, []);

  return (
    <div className="container mx-auto">
      <div className="mx-auto space-y-8 relative">
        {/* data for the topic */}
        <TopicCard topicData={topicData} isLoading={isTopicDataLoading} feedbackUpdated={blogCount} />
        <GeneratedContentCard
          generatedContent={topicData?.outline}
          isEditOutline={!blogCount}
          handleOpenUpdateOutlineDailog={handleOpenUpdateOutlineDailog}
        />
        {!blogCount && (
          <Form {...blogForm}>
            <form
              onSubmit={blogForm.handleSubmit(handleGenerateBlog)}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Content Generation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={blogForm.control}
                    name="word_count"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                          Number of Words
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter desired word count"
                            {...field}
                            className="w-full rounded-md border border-border px-4 py-3 bg-white/70 focus:outline-none focus:ring-2 focus:ring-grey-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button
                    disabled={loadingFirstBlog}
                    variant="default"
                    type="submit"
                    className="glossy-button w-full rounded-lg py-3 px-4 font-medium hover:bg-grey-700 transition-colors flex items-center justify-center"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    {loadingFirstBlog && (  
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {loadingFirstBlog ? "Generating..." : "Generate Content"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        )}
        <ContentGenerator
          topicId={topic_id}
          blogGeneratedState={blogGeneratedState}
          setBlogCount={setBlogCount}
        />
      </div>
      {dialogOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full h-full max-w-7xl relative flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Markdown Editor</h2>
              <button
                className="text-gray-600 hover:text-black"
                onClick={() => setDialogOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="flex-1 h-[100vh] overflow-hidden">
              <MdEditor
                value={outlineMarkdown}
                onChange={setOutlineMarkdown}
                style={{ height: "100vh" }}
                language="en-US"
              />
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setDialogOpen(false)}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setDialogOpen(false);
                }}
                className="mr-2"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
