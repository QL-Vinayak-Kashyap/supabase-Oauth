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
import { Loader2, PlusCircle, X, Zap } from "lucide-react";
import { setCurrentBlog } from "@/redux/slices/currentBlogTopic";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";

const formSchema = z.object({
  // word_count: z.string(),
  topic: z.string().min(3, { message: "Topic must be at least 3 characters" }),
  word_count: z.coerce
    .number()
    .min(100, { message: "Minimum 100 words required" })
    .max(10000, { message: "Maximum 10000 words allowed" }),
  main_keyword: z
    .string()
    .min(2, { message: "Main Keyword must be at least 2 characters" })
    .max(20, { message: "Main Keyword must not greater than 20 characters" })
    .optional(),
  secondary_keywords: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [reqData, setReqData] = React.useState<GenerateBlogRequest>();
  const userState = useAppSelector((state) => state.currentUser);
  const state = useAppSelector((state) => state.currentBlogTopic);
  const [currentKeyword, setCurrentKeyword] = React.useState<string>("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      word_count: 100,
      main_keyword: "",
      secondary_keywords: [],
    },
  });

  const {
    refetch: callGenerateBlogQuery,
    data,
    isLoading: loadingFirstBlog,
  } = useGenerateBlogQuery(reqData);

  async function onSubmit(value: any) {
    console.log("value in onSubmit", value);
    try {
      value["token"] = state?.blogToken || "";
      value["word_count"] = "" + value["word_count"];
      value["secondary_keywords"] =
        value["secondary_keywords"]?.join(", ") ?? "";
      console.log("value", value);
      setReqData(value);

      const datatoInsert = {
        user_id: userState?.id,
        topic_name: value?.topic,
        word_count: value?.word_count,
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

  const addKeyword = () => {
    if (
      currentKeyword.trim() &&
      !form.getValues().secondary_keywords?.includes(currentKeyword.trim())
    ) {
      const currentKeywords = form.getValues().secondary_keywords || [];
      form.setValue("secondary_keywords", [
        ...currentKeywords,
        currentKeyword.trim(),
      ]);
      setCurrentKeyword("");
    }
  };

  const removeKeyword = (indexToRemove: number) => {
    const tempCurrentKeywords = form.getValues().secondary_keywords || [];
    const updatedKeywords = tempCurrentKeywords.filter(
      (_, index) => index !== indexToRemove
    );
    form.setValue("secondary_keywords", updatedKeywords, {
      shouldValidate: true,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword();
    }
  };

  React.useEffect(() => {
    if (data) {
      const dispatchData: any = {
        blogToken: state?.blogToken || "",
        topic: reqData?.topic,
        wordsNumber: reqData?.word_count,
        content: {
          blog: data?.data?.blog,
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
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                          Topic
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your topic"
                            {...field}
                            className="w-full rounded-md border border-border px-4 py-3 bg-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
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
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                          Number of Words
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter desired word count"
                            {...field}
                            className="w-full rounded-md border border-border px-4 py-3 bg-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="main_keyword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                          Main Keyword
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Main Keyword"
                            {...field}
                            className="w-full rounded-md border border-border px-4 py-3 bg-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-2">
                    <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                      Secondary Keywords
                    </FormLabel>
                    <div className="flex items-center">
                      <Input
                        value={currentKeyword}
                        onChange={(e) => setCurrentKeyword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Add keywords and press Enter"
                        className="flex-1 rounded-md border border-border px-4 py-3 bg-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <Button
                        type="button"
                        onClick={addKeyword}
                        variant="ghost"
                        className="ml-2"
                        disabled={!currentKeyword.trim()}
                      >
                        <PlusCircle className="h-5 w-5" />
                      </Button>
                    </div>
                    {form.getValues().secondary_keywords &&
                      form.getValues().secondary_keywords.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {form
                            .getValues()
                            .secondary_keywords.map((keyword, index) => (
                              <div
                                key={index}
                                className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center text-sm"
                              >
                                {keyword}
                                <button
                                  type="button"
                                  onClick={() => removeKeyword(index)}
                                  className="ml-2 text-purple-600 hover:text-purple-800 focus:outline-none"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                        </div>
                      )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    disabled={loadingFirstBlog}
                    type="submit"
                    className="w-full bg-purple-600 text-white rounded-md py-3 px-4 font-medium hover:bg-purple-700 transition-colors flex items-center justify-center"
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
        </div>
      </div>
    </div>
  );
}
