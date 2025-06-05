"use client";

import TopicCard from "@/components/app/TopicCard";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { supabase } from "@/lib/supabaseClient";
import { TablesName } from "@/lib/utils";
import { useLazyGenerateBlogWithFeedbackQuery } from "@/redux/api/api";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import "md-editor-rt/lib/style.css";
import { setUserLimit } from "@/redux/slices/currentUserSlice";
import Loading from "@/components/app/Loading";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { setCurrentTopicBlogs } from "@/redux/slices/currentBlogs";
import ProfileBanner from "@/components/app/ProfileBanner";
import GeneratedContentCard from "@/components/app/GeneratedContentCard";
import Link from "next/link";

type FeedbackTypes = {
  feedback: string;
};

const schema = z.object({
  feedback: z.string().min(2),
});

const page = () => {
  const { topic_id } = useParams();
  const [topicData, setTopicData] = useState<any>();
  const [isTopicDataLoading, setIsTopicDataLoading] = useState<boolean>();
  const userState = useAppSelector((state) => state.currentUser);
  const state = useAppSelector((state) => state.currentBlogTopic);
  const { generatedBlog } = useAppSelector((state) => state.currentBlog);
  const dispatch = useAppDispatch();
  const [feedbackRequestData, setFeedbackRequestData] = useState<FeedbackTypes>();

  const feedbackForm = useForm({
    resolver: zodResolver(schema),
    defaultValues: { feedback: "" },
  });

  const [
    triggerGenerateBlogWithFeedback,
    { data: feedbackData, isLoading: loadingGeneratingBlogAgain },
  ] = useLazyGenerateBlogWithFeedbackQuery();

  async function handleGenerateAgain(value: any) {
    if (userState.limitLeft === 0) {
      toast("Your Limit reached. Please upgrade or contact org.");
      return;
    }
    try {
      value["token"] = state?.blogToken || "";
      value["blog_content"] = generatedBlog[0]?.content;
      setFeedbackRequestData(value);

      const {
        data: blogDataAfterFeedback,
        error: errorBlogDataAfterFeedback,
        isSuccess,
      } = await triggerGenerateBlogWithFeedback(value);

      const { data: limit, error } = await supabase
        .from("users")
        .update({ daily_limit: userState.limitLeft - 1 })
        .eq("uuid", userState.id)
        .select();

      if (!error) {
        dispatch(setUserLimit({ limitLeft: limit[0]?.daily_limit }));
      }

      if (!blogDataAfterFeedback || !isSuccess)
        throw new Error("Blog generation failed");

      if (errorBlogDataAfterFeedback) {
        throw new Error(errorBlogDataAfterFeedback);
      }
    } catch (error) {
      console.error("Error in Generating Again:", error);
    } finally {
      feedbackForm.reset();
    }
  }


  const fetchTopicData = async () => {
    try {
      setIsTopicDataLoading(true);
      const { data: Topics, error, status } = await supabase
        .from(TablesName.TOPICS)
        .select("*")
        .eq("id", topic_id);
      if (error) throw new Error("Error in fetching the Topic Data.");

      if (status === 200) {
        setTopicData(Topics[0]);
        getContentFromSupabase();
      }
    } catch (error) {
      toast(error)
    } finally {
      setIsTopicDataLoading(false);
    }
  };

  const getContentFromSupabase = async () => {
    const { data: blogs } = await supabase
      .from(TablesName.BLOGS)
      .select("*")
      .eq("topic_id", topic_id);
    if (blogs) {
      dispatch(setCurrentTopicBlogs({ generatedBlog: blogs }))
    }
  };


  const updateDataInSupabase = async (data: any) => {
    const dataToBeSent = {
      topic_id: topic_id,
      content: data.content.blog,
      feedback: data.content.feedback,
      banner_description: data?.content?.bannerDescription,
      meta_description: data?.content?.metaDescription,
    };
    try {
      const { data: insertedBlog, error: insertionError } = await supabase
        .from(TablesName.BLOGS)
        .update([dataToBeSent]).eq("topic_id", topic_id);
      if (insertionError) {
        throw new Error("Error in insertion of blog")
      }
      if (insertedBlog) {
        getContentFromSupabase()
      }
    } catch (error) {
      toast(error)
    }
  };

  // useEffect(() => {
  //   getContentFromSupabase();
  // }, [blogInserted])

  useEffect(() => {
    fetchTopicData();
  }, []);


  useEffect(() => {
    if (feedbackData) {
      const dispatchData: any = {
        blogToken: state?.blogToken || "",
        topic: state.blogData.topic,
        wordsNumber: 1000,
        content: {
          blog: feedbackData.data.revised_blog,
          feedback: feedbackRequestData.feedback,
          metaDescription: feedbackData.data.meta_description,
          bannerDescription: feedbackData.data.banner_description,
        },
      };
      updateDataInSupabase(dispatchData);
    }
  }, [feedbackData])
  return (
    <>
      <header className="container flex justify-between h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-[0px] bg-white z-50">
        <Link href="/">
        <div className="flex items-center">
          <img
            src="/writeeasy.png"
            alt="WriteEasy Logo"
            className="h-8 w-8 mr-2"
            />
          <h1 className="text-2xl font-bold tracking-tighter">
            Write<span className="font-extrabold">Easy</span>
          </h1>
        </div>
            </Link>
        <div className="flex flex-row items-center gap-2">
        </div>
        <div className="flex flex-row items-center gap-2">
          <ProfileBanner />
        </div>
      </header>     
      <div className="container mx-auto relative">
        <div className="mx-auto relative">
          {/* data for the topic */}
          <TopicCard topicData={topicData} generatedBlogData={generatedBlog} isLoading={isTopicDataLoading} feedbackUpdated={1} />
          {isTopicDataLoading || loadingGeneratingBlogAgain ?
            <Loading /> :
            <GeneratedContentCard
              // index={index}
              generatedContent={generatedBlog[0]?.content ?? ""}
              topicName={topicData?.topic_name}
            />
          }
          <div className="sticky bottom-0 w-full mx-auto p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-2">
              Provide Ideas for Regeneration
            </h2>
            <Form {...feedbackForm}>
              <form
                onSubmit={feedbackForm.handleSubmit(handleGenerateAgain)}
              >
                <FormField
                  control={feedbackForm.control}
                  name="feedback"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          className="w-full p-2 border rounded-lg"
                          placeholder="Type here..."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  className="glossy-button mt-4 w-full"
                  type="submit"
                  disabled={loadingGeneratingBlogAgain}
                >
                  {loadingGeneratingBlogAgain && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {loadingGeneratingBlogAgain
                    ? "Regenerating..."
                    : "Regenerate Content"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
