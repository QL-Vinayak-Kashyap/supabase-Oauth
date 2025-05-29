"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookCheck, ArrowLeft, RefreshCw, FileText, Zap, Loader2 } from "lucide-react";
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
  const [isGenerating, setIsGenerating] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter()

  const blogForm = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      word_count: 1000,
    },
  });


  const handleGenerateTopic = async () => {
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
        router.push(`${AppRoutes.DASHBOARD}/${topicDataInserted[0]?.id}?content=new`);
      }

      if (topicInsertError) throw new Error(topicInsertError.message);
      if (!topicDataInserted || topicDataInserted.length === 0)
        throw new Error("Topic insertion failed");
      
    } catch (error) {
      toast(error);
    }
  };

  return (
    <div className="space-y-4">
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
            <p className="text-sm">{blogData.topic}</p>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium">Primary Keyword:</p>
            <p className="text-sm">{blogData.primaryKeywords}</p>
          </div>


          <Separator />

          <div>
            <p className="text-sm font-medium">Secondary Keywords:</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {blogData.secondaryKeywords.map((keyword, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium">Tone:</p>
            <p className="text-sm">{blogData.tone}</p>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium">Outline:</p>
            {/* <ul className="list-disc list-inside mt-1 text-sm">
              {blogData.outline.map((section, index) => (
                <li key={index}>{section}</li>
              ))}
            </ul> */}
          </div>
        </CardContent>
      </Card>

      {/* // word form */}

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
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              type="submit"
              disabled={isGenerating}
              className="flex items-center gap-1"
            >
              {isGenerating ? (
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
    </div>
  );
};

export default StepGenerate;