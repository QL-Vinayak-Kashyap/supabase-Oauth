"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useGenerateBlogQuery,
  useGenerateBlogWithFeedbackQuery,
} from "@/redux/api/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@reduxjs/toolkit/query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { setCurrentBlog } from "@/redux/slices/currentBlogTopic";
import GeneratedContentCard from "./GeneratedContentCard";
import { highlightDifferencesMarkdown } from "@/lib/getDifferenceText";

interface GeneratedContent {
  content: string;
  markdown: string;
  wordCount: number;
}

export function ContentGenerator() {
  const dispatch = useDispatch();
  const [generatedContent, setGeneratedContent] =React.useState<GeneratedContent | null>(null);
  const [reqData, setReqData] = React.useState({});
  const [feedbackRequestData, setFeedbackRequestData] = React.useState({});
  // const state =useSelector((state) => state.currentBlogTopic)
  const state = useSelector((state: RootState) => state.currentBlogTopic);

  const feedbackForm = useForm({
    defaultValues: { feedback: "" },
  });

  const formSchema = z.object({
    topic: z.string().min(3, "Topic must be at least 3 characters"),
    word_count: z.string(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      word_count: "",
    },
  });

  const {
    refetch: callGenerateBlogQuery,
    data, isLoading:loadingFirstBlog
  } = useGenerateBlogQuery(reqData);

  const {
    refetch: callGenerateBlogWithFeedbackQuery,
    data: feedbackData,
    isLoading:loadingGeneratingBlogAgain
  } = useGenerateBlogWithFeedbackQuery(feedbackRequestData);

  async function onSubmit(value: any) {
    value["token"] = state?.blogToken || "";
    setReqData(value);
     await callGenerateBlogQuery();
  }

  async function handleGenerateAgain(value: any) {
    value["token"] = state?.blogToken || "";
    value["blog_content"] = state?.content?.slice(-1)[0].blog  || "";
    setFeedbackRequestData(value);
    await callGenerateBlogWithFeedbackQuery(); 
  }

  React.useEffect(() => {
    if (data) {
      setGeneratedContent(data.data.blog);
      const dispatchData = {
        blogToken: state?.blogToken || "",
        topic: reqData.topic,
        wordsNumber: reqData.word_count,
        content: {
          blog: data.data.blog,
          feedback: "",
        },
      };
      dispatch(setCurrentBlog(dispatchData));
    }
  }, [data]);
  React.useEffect(() => {
    if (feedbackData) {
      setGeneratedContent(feedbackData.data.blog);
      const dispatchData = {
        blogToken: state?.blogToken || "",
        topic: reqData.topic,
        wordsNumber: reqData.word_count,
        content: {
          blog: feedbackData.data.revised_blog,
          feedback: feedbackRequestData.feedback,
        },
      };
      dispatch(setCurrentBlog(dispatchData));
    }
  }, [feedbackData]);

  return (
    <div className="space-y-8">
      {!generatedContent && (state?.content.length === 0) && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generation Parameters</CardTitle>
                <CardDescription>
                  Enter the details for your content generation.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your topic" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="word_count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Words</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter desired word count"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loadingFirstBlog}>
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
      {(state?.content.length !== 0) && (
        <div>
          <h3>{state.topic}</h3>
        {state?.content.map((item: any, index:number)=>{
          let diffContent = item.blog;
          if(index !== 0){
             diffContent = highlightDifferencesMarkdown(state?.content[index-1].blog, item.blog);
            console.log("diffContent",diffContent);
          }
        
        return(
          <div key={index} className="mb-4">
            {item.feedback !=="" ? (
              <Card>
              <CardHeader>
                <CardTitle>Your last Feedback:</CardTitle>
                <CardDescription>"{item.feedback}"</CardDescription>
              </CardHeader>
            </Card>
            ): null}
          <GeneratedContentCard key={index} index={index} totalItems={state?.content.length} generatedContent={diffContent} setGeneratedContent={setGeneratedContent} feedbackForm={feedbackForm} handleGenerateAgain={handleGenerateAgain} loadingGeneratingBlogAgain={loadingGeneratingBlogAgain} />
          </div>
        )})}
        </div>
      )}
    </div>
  );
}
