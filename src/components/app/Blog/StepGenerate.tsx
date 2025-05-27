import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookCheck, ArrowLeft, RefreshCw, FileText, Zap, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BlogData } from "@/components/app/BlogWizardSidebar";
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

interface StepGenerateProps {
  blogData: BlogData;
  onGenerateBlog: () => void;
  onBack: () => void;
}

const blogFormSchema = z.object({
  word_count: z.coerce
    .number()
    .min(100, { message: "Minimum 100 words required" })
    .max(1200, { message: "Maximum 1200 words allowed" }),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

const StepGenerate = ({
  blogData,
  onGenerateBlog,
  onBack
}: StepGenerateProps) => {
  const [] = useState("")
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

  const [
    triggerGenerateBlog,
    { data: generatedBlog, isLoading: loadingFirstBlog },
  ] = useLazyGenerateBlogQuery();

  const handleGenerate = async () => {
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
        // setReqOutlineData(value);
        router.push(`${AppRoutes.DASHBOARD}/${topicDataInserted[0]?.id}?content=new`);
      }

      if (topicInsertError) throw new Error(topicInsertError.message);
      if (!topicDataInserted || topicDataInserted.length === 0)
        throw new Error("Topic insertion failed");
      
    } catch (error) {
      toast(error);
    }

    // if (userState.limitLeft === 0) {
    //   toast("Limit reached!!!");
    //   return;
    // }
    // try {

    //   const requestData: any = {
    //     topic: blogData.topic,
    //     tone: blogData.tone,
    //     outline: blogData.outline,
    //     main_keyword: blogData.primaryKeywords,
    //     secondary_keywords: blogData.secondaryKeywords,
    //     token: state?.blogToken
    //   };

    //   const { data: generatedBlogData, isSuccess } = await triggerGenerateBlog(
    //     requestData
    //   );
    //   const { data: limit, error } = await supabase
    //     .from("users")
    //     .update({ daily_limit: userState.limitLeft - 1 })
    //     .eq("uuid", userState.id)
    //     .select();

    //   if (!error) {
    //     dispatch(setUserLimit({ limitLeft: limit[0]?.daily_limit }));
    //   }

    //   if (!generatedBlogData || !isSuccess) throw new Error("Blog generation failed");

    //   const { error: blogInsertError } = await supabase
    //     .from(TablesName.BLOGS)
    //     .insert([
    //       {
    //         topic_id: "",
    //         content: generatedBlogData?.data?.blog,
    //         feedback: generatedBlogData?.data?.feedback ?? "",
    //       },
    //     ])
    //     .select();

    //   const { error: descriptionInsertError, data: updatedTopicData } = await supabase
    //     .from(TablesName.TOPICS)
    //     .update([
    //       {
    //         banner_description: generatedBlogData?.data?.banner_description,
    //         meta_description: generatedBlogData?.data?.meta_description
    //       },
    //     ])
    //     .eq('id', "")
    //     .select()
    //   // setTopicData(updatedTopicData[0]);
    //   if (generatedBlogData) {
    //     // setBlogGeneratedState(true);  
    //     toast("Blog Generated");
    //   }
    // } catch (error) {
    //   toast(error);
    // }

    // setIsGenerating(true);
    // In a real app, you would call an API to generate the blog
    // setTimeout(() => {
    //   onGenerateBlog();
    //   setIsGenerating(false);
    // }, 2000);
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
          onSubmit={blogForm.handleSubmit(handleGenerate)}
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
              onClick={handleGenerate}
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

          {/* <Button
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
          </Button> */}

        </form>
      </Form>
    </div>
  );
};

export default StepGenerate;