"use client";

import * as React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLazyGenerateBlogWithFeedbackQuery } from "@/redux/api/api";
import { useForm } from "react-hook-form";

import GeneratedContentCard from "./GeneratedContentCard";
import { highlightDifferencesMarkdown } from "@/lib/getDifferenceText";
import { supabase } from "@/lib/supabaseClient";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { TablesName } from "@/lib/utils";
import { toast } from "sonner";
import { setUserLimit } from "@/redux/slices/currentUserSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface GeneratedContent {
  content: string;
  markdown: string;
  wordCount: number;
}

const schema = z.object({
  feedback: z.string().min(2),
});

export function ContentGenerator({
  topicId,
  blogGeneratedState,
  setBlogCount,
}: any) {
  const [feedbackRequestData, setFeedbackRequestData] = React.useState<any>();
  const [topic, setTopic] = React.useState([]);
  const [blogs, setBlogs] = React.useState([]);
  const [blogInserted, setBlogInserted] = React.useState(false);
  const state = useAppSelector((state: any) => state.currentBlogTopic);
  const userState = useAppSelector((state: any) => state.currentUser);
  const dispatch = useAppDispatch();

  const feedbackForm = useForm({
    resolver: zodResolver(schema),
    defaultValues: { feedback: "" },
  });

  const [
    triggerGenerateBlogWithFeedback,
    { data: feedbackData, isLoading: loadingGeneratingBlogAgain },
  ] = useLazyGenerateBlogWithFeedbackQuery();

  async function handleGenerateAgain(value: any, forWord: string) {
    if (userState.limitLeft === 0) {
      toast("Your Limit reached. Please upgrade or contact org.");
      return;
    }
    try {
      value["token"] = state?.blogToken || "";
      value["blog_content"] = state?.content?.slice(-1)[0]?.blog ?? forWord;
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
    }
  }

  const insertDataInSupabase = async (data: any) => {
    setBlogInserted(true);
    const dataToBeSent = {
      topic_id: topicId,
      content: data.content.blog,
      feedback: data.content.feedback,
    };
    const { error: descriptionInsertError, data: updatedTopicData } = await supabase
        .from(TablesName.TOPICS)
        .update([
          {
            // topic_id: topic_id,
            // content: blogData?.data?.blog,
            // feedback: blogData?.data?.feedback ?? "",
            banner_description: data?.content?.bannerDescription,
            meta_description: data?.content?.metaDescription
          },
        ])
        .eq('id', topicId)
        .select()
    const { data: insertedBlog } = await supabase
      .from(TablesName.BLOGS)
      .insert([dataToBeSent])
      .select();
    if (insertedBlog) {
      setBlogInserted(false);
    }
  };

  React.useEffect(() => {
    if (feedbackData) {
      const dispatchData: any = {
        blogToken: state?.blogToken || "",
        topic: state.topic,
        wordsNumber: state.word_count,
        content: {
          blog: feedbackData.data.revised_blog,
          feedback: feedbackRequestData.feedback,
          metaDescription:feedbackData.data.meta_description,
          bannerDescription: feedbackData.data.banner_description
        },
      };
      insertDataInSupabase(dispatchData);
    }
  }, [feedbackData]);

  const getTopicName = async () => {
    const { data: Topic } = await supabase
      .from(TablesName.TOPICS)
      .select("*")
      .eq("id", topicId);

    if (Topic) {
      setTopic(Topic);
    }
  };

  const getContentFromSupabase = async () => {
    const { data: blogs } = await supabase
      .from(TablesName.BLOGS)
      .select("*")
      .eq("topic_id", topicId);
    if (blogs) {
      setBlogCount(blogs.length);
      setBlogs(blogs);
    }
  };

  React.useEffect(() => {
    if (topicId) {
      getTopicName();
      getContentFromSupabase();
    }
  }, [feedbackData, blogInserted, blogGeneratedState]);

  return (
    <div className="space-y-8">
      {blogs.length !== 0 && (
        <div>
          {blogs.sort((a,b)=> a.id - b.id).map((item: any, index: number) => {
            let diffContent = item.content;
            if (index !== 0) {
              diffContent = highlightDifferencesMarkdown(
                blogs[index - 1].content,
                item.content
              );
            }
            return (
              <div key={item.id} className="mb-4">
                {item.feedback !== "" ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Earlier Recommendation:</CardTitle>
                      <CardDescription>"{item.feedback}"</CardDescription>
                    </CardHeader>
                  </Card>
                ) : null}
                <GeneratedContentCard
                  key={item.id}
                  index={index}
                  totalItems={blogs.length}
                  generatedContent={diffContent}
                  forWord={item.content}
                  // setGeneratedContent={setGeneratedContent}
                  feedbackForm={feedbackForm}
                  handleGenerateAgain={handleGenerateAgain}
                  loadingGeneratingBlogAgain={loadingGeneratingBlogAgain}
                  topicName={topic[0]?.topic_name}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
