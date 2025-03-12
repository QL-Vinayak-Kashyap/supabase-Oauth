"use client";

import * as React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGenerateBlogWithFeedbackQuery } from "@/redux/api/api";
import { useForm } from "react-hook-form";

import { setCurrentBlog } from "@/redux/slices/currentBlogTopic";
import GeneratedContentCard from "./GeneratedContentCard";
import { highlightDifferencesMarkdown } from "@/lib/getDifferenceText";
import { supabase } from "@/lib/supabaseClient";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";

interface GeneratedContent {
  content: string;
  markdown: string;
  wordCount: number;
}

export function ContentGenerator({ topicId }: any) {
  const dispatch = useAppDispatch();
  const [feedbackRequestData, setFeedbackRequestData] = React.useState<any>();
  // const [blogLoader, setBlogLoader] = React.useState(false);
  const [blogs, setBlogs] = React.useState([]);
  const state = useAppSelector((state: any) => state.currentBlogTopic);

  const feedbackForm = useForm({
    defaultValues: { feedback: "" },
  });

  const {
    refetch: callGenerateBlogWithFeedbackQuery,
    data: feedbackData,
    isLoading: loadingGeneratingBlogAgain,
  } = useGenerateBlogWithFeedbackQuery(feedbackRequestData, {
    skip: !feedbackRequestData,
  });

  async function handleGenerateAgain(value: any) {
    try {
      value["token"] = state?.blogToken || "";
      value["blog_content"] = state?.content?.slice(-1)[0]?.blog || "";
      setFeedbackRequestData(value);

      const {
        data: blogDataAfterFeedback,
        error: errorBlogDataAfterFeedback,
        isSuccess,
      } = await callGenerateBlogWithFeedbackQuery();

      if (!blogDataAfterFeedback || !isSuccess)
        throw new Error("Blog generation failed");

      if (errorBlogDataAfterFeedback) {
        throw new Error(errorBlogDataAfterFeedback);
      }
      if (!blogDataAfterFeedback || !blogDataAfterFeedback.data?.blog) {
        throw new Error("Blog generation failed or returned empty content");
      }
    } catch (error) {
      console.error("Error in Generating Again:", error);
    }
  }

  const insertDataInSupabase = async (data: any) => {
    const dataToBeSent = {
      topic_id: topicId,
      content: data.content.blog,
      feedback: data.content.feedback,
    };

    const { data: dataCreated } = await supabase
      .from("Blogs")
      .insert([dataToBeSent])
      .select();
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
        },
      };
      insertDataInSupabase(dispatchData);
      // dispatch(setCurrentBlog(dispatchData));
    }
  }, [feedbackData]);

  const getContentFromSupabase = async () => {
    let { data: blogs, error } = await supabase
      .from("Blogs")
      .select("*")
      .eq("topic_id", topicId);
    if (blogs) {
      setBlogs(blogs);
    }
  };

  React.useEffect(() => {
    if (topicId) {
      getContentFromSupabase();
    }
  }, [feedbackData]);

  return (
    <div className="space-y-8">
      {blogs.length !== 0 && (
        <div>
          <h3>{state.topic}</h3>
          {blogs.map((item: any, index: number) => {
            let diffContent = item.content;
            if (index !== 0) {
              diffContent = highlightDifferencesMarkdown(
                blogs[index - 1].content,
                item.content
              );
            }
            return (
              <div key={index} className="mb-4">
                {item.feedback !== "" ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Your last Feedback:</CardTitle>
                      <CardDescription>"{item.feedback}"</CardDescription>
                    </CardHeader>
                  </Card>
                ) : null}
                <GeneratedContentCard
                  key={index}
                  index={index}
                  totalItems={blogs.length}
                  generatedContent={diffContent}
                  forWord={item.content}
                  // setGeneratedContent={setGeneratedContent}
                  feedbackForm={feedbackForm}
                  handleGenerateAgain={handleGenerateAgain}
                  loadingGeneratingBlogAgain={loadingGeneratingBlogAgain}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
