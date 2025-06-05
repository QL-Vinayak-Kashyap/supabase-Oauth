"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookCheck, ArrowLeft, RefreshCw, FileText, Zap, Loader2, Save } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { useLazyGenerateBlogQuery } from "@/redux/api/api";
import { AppRoutes, TablesName } from "@/lib/utils";
import { setUserLimit } from "@/redux/slices/currentUserSlice";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { StepGenerateProps } from "@/types";
import { resetBlogState, resetCurrentBlogTopic, setTopicId, updateBlogData } from "@/redux/slices/currentBlogTopic";
import Loading from "../Loading";
import GeneratedContentCard from "../GeneratedContentCard";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";


const blogFormSchema = z.object({
  word_count: z.coerce
    .number()
    .min(100, { message: "Minimum 100 words required" })
    .max(1200, { message: "Maximum 1200 words allowed" }),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

const StepGenerate = ({
  blogData,
  onBack
}: StepGenerateProps) => {
  const userState = useAppSelector((state) => state.currentUser);
  const state = useAppSelector((state) => state.currentBlogTopic);
  const [isGeneratingTopic, setIsGeneratingTopic] = useState(false);
  const [blogGenerated, setBlogGenerated] = useState<string>("");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showGeneratedContent, setShowGeneratedContent] = useState<boolean>(!state.blogData?.generatedBlog);
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);

  const blogForm = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      word_count: 1000,
    },
  });

  const [
    triggerGenerateBlog,
    { data: generatedBlogData, isLoading: loadingFirstBlog },
  ] = useLazyGenerateBlogQuery();

  async function handleGenerateBlog(topic_id: string) {
    if (userState.limitLeft === 0) {
      toast("Limit reached!!!");
      return;
    }
    try {
      const requestData: any = {
        topic: state.blogData.topic,
        tone: state.blogData.tone,
        outline: state.blogData.outline,
        main_keyword: state.blogData.primaryKeywords,
        secondary_keywords: state.blogData.secondaryKeywords.join(", ") ?? "",
        token: state?.blogToken
      };

      const { data: generatedBlogData, isSuccess } = await triggerGenerateBlog(
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

      if (!generatedBlogData || !isSuccess) throw new Error("Blog generation failed");

      if (isSuccess) {
        setBlogGenerated(generatedBlogData?.data?.blog);
        dispatch(updateBlogData({ generatedBlog: generatedBlogData }))
        setShowGeneratedContent(true);
      }

      if (isSuccess) {
        // dispatch(resetBlogState())
        toast("Blog Generated");
      }
    } catch (error) {
      toast(error);
    }
  }


  const handleGenerateTopic = async () => {
    setIsGeneratingTopic(true);
    try {
      const datatoInsert = {
        user_id: userState?.id,
        topic_name: blogData?.topic,
        word_count: "100",
        main_keyword: blogData?.primaryKeywords,
        secondary_keywords: blogData?.secondaryKeywords,
        outline: blogData?.outline,
        tone: blogData?.tone,
      };

      const { data: topicDataInserted, error: topicInsertError } =
        await supabase.from("Topics").insert([datatoInsert]).select();

      if (topicDataInserted) {
        dispatch(setTopicId(topicDataInserted[0].id))
        handleGenerateBlog(topicDataInserted[0].id);
      }

      if (topicInsertError) throw new Error(topicInsertError.message);
      if (!topicDataInserted || topicDataInserted.length === 0)
        throw new Error("Topic insertion failed");

    } catch (error) {
      toast(error);
    } finally {
      setIsGeneratingTopic(false);
    }
  };

  const handleSaveBlog = async () => {
    try {
      const { error: blogInsertError } = await supabase
        .from(TablesName.BLOGS)
        .upsert([
          {
            topic_id: state.topic_id,
            content: generatedBlogData?.data?.blog,
            feedback: generatedBlogData?.data?.feedback ?? "",
            banner_description: generatedBlogData?.data?.banner_description,
            meta_description: generatedBlogData?.data?.meta_description
          },
        ])
        .select();

      if (blogInsertError) {
        throw new Error("Error in saving blog, Please created again!")
      }

    } catch (error) {
      toast(error);
    }


  }

  const handleEditBlogCreated = () => {
    dispatch(resetCurrentBlogTopic());
    router.push(`${AppRoutes.BLOG}/${state.topic_id}`);
  }

  const handleCreateNewBlog = () => {
    dispatch(resetCurrentBlogTopic());
    router.push(`${AppRoutes.DASHBOARD}/blog-writer`);
  }

  return (
    <div className="space-y-4">
      {
        showGeneratedContent ? <GeneratedContentCard
          generatedContent={blogGenerated}
          // forWord={item.content}
          topicName={blogData?.topic}
        /> : <>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <BookCheck className="w-5 h-5 text-primary" />
              <h3 className="text-md font-medium">Generate Blog</h3>
            </div>
            <p className="text-sm text-gray-500">
              Review your selections and generate your blog post with AI.
            </p>
          </div>

          <Card className="shadow-sm">
            <CardContent className="p-4 space-y-3">
              <div>
                <p className="text-sm font-medium">Topic:</p>
                <p className="text-sm">{blogData?.topic}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium">Primary Keyword:</p>
                <p className="text-sm">{blogData?.primaryKeywords}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium">Secondary Keywords:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {blogData?.secondaryKeywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium">Tone:</p>
                <p className="text-sm">{blogData?.tone}</p>
              </div>
            </CardContent>
          </Card>
          {/* // word form */}
          {
            loadingFirstBlog ? <Loading /> : <>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-medium">Enter the number of words</h3>
                </div>
                <p className="text-sm text-gray-500">
                  Provide a number of words for your blog post.
                </p>
              </div>

              <Form {...blogForm}>
                <form
                  onSubmit={blogForm.handleSubmit(handleGenerateTopic)}
                  className="space-y-6"
                >
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

                  <div className="flex justify-between">
                    {/* <Button variant="ghost" onClick={onBack} className="flex items-center gap-1">
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button> */}
                    <Button
                      type="submit"
                      disabled={isGeneratingTopic}
                      className="flex items-center gap-1"
                    >
                      {isGeneratingTopic ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <BookCheck className="h-4 w-4" />
                          Generate Blog
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </>
          }</>
      }
      <div className="flex ">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-1" disabled={loadingFirstBlog}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        {/* <Button variant="ghost" onClick={handleSaveBlog} className="flex items-center gap-1">
        <ArrowLeft className="h-4 w-4" />
        Save & Continue
      </Button> */}
        {
          showGeneratedContent ? <AlertDialog open={saveConfirmOpen} onOpenChange={setSaveConfirmOpen}>
            <AlertDialogTrigger onClick={() => handleSaveBlog()}>Save & Continue</AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader> 
                <AlertDialogTitle>Do you want to edit it or create a new Blog?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this topic. This action cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleEditBlogCreated}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Edit
                </AlertDialogAction>
                <AlertDialogAction
                  onClick={handleCreateNewBlog}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Create New
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog> : <></>
        }
      </div>
    </div>
  );
};

export default StepGenerate;