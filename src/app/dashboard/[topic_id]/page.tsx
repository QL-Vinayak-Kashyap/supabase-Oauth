"use client";

import { ContentGenerator } from "@/components/app/content-generator";
import TopicCard from "@/components/app/TopicCard";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { supabase } from "@/lib/supabaseClient";
import { TablesName } from "@/lib/utils";
import { useLazyGenerateBlogQuery } from "@/redux/api/api";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import "md-editor-rt/lib/style.css";
import { setUserLimit } from "@/redux/slices/currentUserSlice";
import Loading from "@/components/app/Loading";
import TopicLayout from "./layout";

const page = () => {
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
  // const dispatch = useAppDispatch();

  const [
    triggerGenerateBlog,
    { data: generatedBlog, isLoading: loadingFirstBlog },
  ] = useLazyGenerateBlogQuery();


  // const fetchTopicData = async () => {
  //   try {
  //     setIsTopicDataLoading(true);
  //     const { data: Topics, error, status } = await supabase
  //       .from(TablesName.TOPICS)
  //       .select("*")
  //       .eq("id", topic_id);
  //     if (error) throw new Error("Error in fetching the Topic Data.");

  //     if (status === 200) {
  //       setTopicData(Topics[0]);
  //     }
  //   } catch (error) {
  //   } finally {
  //     setIsTopicDataLoading(false);
  //   }
  // };

  // async function handleGenerateBlog() {
  //   if (userState.limitLeft === 0) {
  //     toast("Limit reached!!!");
  //     return;
  //   }
  //   try {

  //     const requestData: any = {
  //       topic: state.blogData.topic,
  //       tone: state.blogData.tone,
  //       outline: state.blogData.outline,
  //       main_keyword: state.blogData.primaryKeywords,
  //       secondary_keywords: state.blogData.secondaryKeywords.join(", ") ?? "",
  //       token: state?.blogToken
  //     };

  //     const { data: generatedBlogData, isSuccess } = await triggerGenerateBlog(
  //       requestData
  //     );
  //     const { data: limit, error } = await supabase
  //       .from("users")
  //       .update({ daily_limit: userState.limitLeft - 1 })
  //       .eq("uuid", userState.id)
  //       .select();

  //     if (!error) {
  //       dispatch(setUserLimit({ limitLeft: limit[0]?.daily_limit }));
  //     }

  //     if (!generatedBlogData || !isSuccess) throw new Error("Blog generation failed");

  //     const { error: blogInsertError } = await supabase
  //       .from(TablesName.BLOGS)
  //       .insert([
  //         {
  //           topic_id: topic_id,
  //           content: generatedBlogData?.data?.blog,
  //           feedback: generatedBlogData?.data?.feedback ?? "",
  //         },
  //       ])
  //       .select();

  //     const { error: descriptionInsertError, data: updatedTopicData } = await supabase
  //       .from(TablesName.TOPICS)
  //       .update([
  //         {
  //           banner_description: generatedBlogData?.data?.banner_description,
  //           meta_description: generatedBlogData?.data?.meta_description
  //         },
  //       ])
  //       .eq('id',topic_id)
  //       .select()
  //     // setTopicData(updatedTopicData[0]);
  //     if (generatedBlogData) {
  //       // setBlogGeneratedState(true);  
  //       toast("Blog Generated");
  //     }
  //     if(searchParams.get("content") === 'new'){
  //       const params = new URLSearchParams(searchParams);
  //       params.set('content', '');

  //       router.push(`${pathname}?${params.toString()}`);
  //     }
  //   } catch (error) {
  //     toast(error);
  //   }
  // }

  // useEffect(() => {
  //   fetchTopicData();
  //   if (searchParams.get("content") === 'new') {
  //     handleGenerateBlog();
  //   }
  // }, []);

  return (
    <div className="container mx-auto relative">
      <div className="mx-auto space-y-8">
        {/* data for the topic */}
        {/* <TopicCard topicData={topicData} isLoading={isTopicDataLoading} feedbackUpdated={blogCount} /> */}
        {loadingFirstBlog ?
          <Loading /> :
          <ContentGenerator
            topicId={topic_id}
            blogGeneratedState={blogGeneratedState}
            setBlogCount={setBlogCount}
          />
        }
      </div>
    </div>
  );
};

export default page;
