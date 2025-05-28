"use client";

import { ReactNode, useEffect, useState } from "react";
import { AppSidebar } from "../../../components/app/Blog/AppSidebar";
import { useLazyGenerateBlogQuery, useLazyGenerateBlogWithFeedbackQuery } from "@/redux/api/api";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { TablesName } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { setUserLimit } from "@/redux/slices/currentUserSlice";
import TopicCard from "@/components/app/TopicCard";
import { setCurrentSelectedId, setCurrentTopicBlogs } from "@/redux/slices/currentBlogs";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type FeedbackTypes = {
  feedback: string;
};

const schema = z.object({
  feedback: z.string().min(2),
});

export default function TopicLayout({
  children,
}: {
  children: ReactNode;
}) {

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { topic_id } = useParams();
  const [topicData, setTopicData] = useState<any>();
  const [isTopicDataLoading, setIsTopicDataLoading] = useState<boolean>();
  const [blogCount, setBlogCount] = useState<Number>();
  const [blogGeneratedState, setBlogGeneratedState] = useState<boolean>(false);
  const userState = useAppSelector((state) => state.currentUser);
  const state = useAppSelector((state) => state.currentBlogTopic);
  const { generatedBlog, currentSelectedId } = useAppSelector((state: any) => state.currentBlog)
  const dispatch = useAppDispatch();
  const [blogInserted, setBlogInserted] =useState<boolean>(false);
  const [feedbackRequestData,setFeedbackRequestData] =useState<FeedbackTypes>();

  const feedbackForm = useForm({
    resolver: zodResolver(schema),
    defaultValues: { feedback: "" },
  });

  const [
    triggerGenerateBlog,
    { data: generatedBlogData, isLoading: loadingFirstBlog },
  ] = useLazyGenerateBlogQuery();

  const [
    triggerGenerateBlogWithFeedback,
    { data: feedbackData, isLoading: loadingGeneratingBlogAgain },
  ] = useLazyGenerateBlogWithFeedbackQuery();

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
      }
    } catch (error) {
    } finally {
      setIsTopicDataLoading(false);
    }
  };

  async function handleGenerateBlog() {
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

      const { error: blogInsertError } = await supabase
        .from(TablesName.BLOGS)
        .insert([
          {
            topic_id: topic_id,
            content: generatedBlogData?.data?.blog,
            feedback: generatedBlogData?.data?.feedback ?? "",
          },
        ])
        .select();

      const { error: descriptionInsertError, data: updatedTopicData } = await supabase
        .from(TablesName.TOPICS)
        .update([
          {
            banner_description: generatedBlogData?.data?.banner_description,
            meta_description: generatedBlogData?.data?.meta_description
          },
        ])
        .eq('id', topic_id)
        .select()
      // setTopicData(updatedTopicData[0]);
      if (generatedBlogData) {
        // setBlogGeneratedState(true);  
        toast("Blog Generated");
      }
      if (searchParams.get("content") === 'new') {
        const params = new URLSearchParams(searchParams);
        params.set('content', '');
        router.push(`${pathname}?${params.toString()}`);
      }
    } catch (error) {
      toast(error);
    }
  }

  async function handleGenerateAgain(value: any) {
    if (userState.limitLeft === 0) {
      toast("Your Limit reached. Please upgrade or contact org.");
      return;
    }
    try {
      value["token"] = state?.blogToken || "";
      value["blog_content"] = generatedBlog.filter((item: any) => item.id === currentSelectedId)[0].content;
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

  const getContentFromSupabase = async () => {
    const { data: blogs } = await supabase
      .from(TablesName.BLOGS)
      .select("*")
      .eq("topic_id", topic_id);
    if (blogs) {
      dispatch(setCurrentTopicBlogs({ generatedBlog: blogs }))
      dispatch((setCurrentSelectedId({ currentSelectedId: blogs[blogs.length-1]?.id })))
    }
  };

   const insertDataInSupabase = async (data: any) => {
      const dataToBeSent = {
        topic_id: topic_id,
        content: data.content.blog,
        feedback: data.content.feedback,
      };
      const { error: descriptionInsertError, data: updatedTopicData } =
        await supabase
          .from(TablesName.TOPICS)
          .update([
            {
              // topic_id: topic_id,
              // content: blogData?.data?.blog,
              // feedback: blogData?.data?.feedback ?? "",
              banner_description: data?.content?.bannerDescription,
              meta_description: data?.content?.metaDescription,
            },
          ])
          .eq("id", topic_id)
          .select();
      const { data: insertedBlog } = await supabase
        .from(TablesName.BLOGS)
        .insert([dataToBeSent])
        .select();
      if (insertedBlog) {
        setBlogInserted((state)=> !state);
      }
    };
    useEffect(()=>{
      getContentFromSupabase();
    },[blogInserted])


  useEffect(() => {
    fetchTopicData();
    if (searchParams.get("content") === 'new') {
      handleGenerateBlog();
    }
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
        insertDataInSupabase(dispatchData);
      }
    }, [feedbackData]);
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 relative">{
        <div>
          <TopicCard topicData={topicData} isLoading={isTopicDataLoading} feedbackUpdated={blogCount} />
          {children}
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
        </div>}</main>
      
    </div>
  );
}