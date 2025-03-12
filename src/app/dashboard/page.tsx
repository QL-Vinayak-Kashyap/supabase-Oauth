"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabaseClient";
import React from "react";
import { GenerateBlogRequest, useGenerateBlogQuery } from "@/redux/api/api";
import { Loader2 } from "lucide-react";
import { setCurrentBlog } from "@/redux/slices/currentBlogTopic";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [reqData, setReqData] = React.useState<GenerateBlogRequest>();
  const userState = useAppSelector((state) => state.currentUser);
  const state = useAppSelector((state) => state.currentBlogTopic);
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
    data,
    isLoading: loadingFirstBlog,
  } = useGenerateBlogQuery(reqData);

  async function onSubmit(value: any) {
    try {
      value["token"] = state?.blogToken || "";
      setReqData(value);

      const datatoInsert = {
        user_id: userState.id,
        topic_name: value.topic,
        word_count: value.word_count,
      };

      // Insert into "Topics" table
      const { data: topicDataInserted, error: topicInsertError } =
        await supabase.from("Topics").insert([datatoInsert]).select();

      if (topicInsertError) throw new Error(topicInsertError.message);
      if (!topicDataInserted || topicDataInserted.length === 0)
        throw new Error("Topic insertion failed");

      const { data: blogData, isSuccess } = await callGenerateBlogQuery();
      if (!blogData || !isSuccess) throw new Error("Blog generation failed");

      const { error: blogInsertError } = await supabase
        .from("Blogs")
        .insert([
          {
            topic_id: topicDataInserted?.[0]?.id,
            content: blogData?.data?.blog,
            feedback: blogData?.data?.feedback ?? "",
          },
        ])
        .select();

      if (!blogInsertError) {
        router.push(`/dashboard/${topicDataInserted[0]?.id}`);
      }

      if (blogInsertError) throw new Error(blogInsertError.message);
    } catch (error) {
      console.error("Error in onSubmit:", error);
    }
  }

  React.useEffect(() => {
    if (data) {
      const dispatchData: any = {
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
  return (
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
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loadingFirstBlog}
                  >
                    {loadingFirstBlog && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {loadingFirstBlog ? "Generating..." : "Generate Content"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
