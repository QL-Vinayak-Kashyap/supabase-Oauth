"use client";

import { ContentGenerator } from "@/components/app/content-generator";
import TopicCard from "@/components/app/TopicCard";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { supabase } from "@/lib/supabaseClient";
import { TablesName } from "@/lib/utils";
import { useLazyGenerateBlogQuery } from "@/redux/api/api";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import "md-editor-rt/lib/style.css";
import { setUserLimit } from "@/redux/slices/currentUserSlice";
import Loading from "@/components/app/Loading";

const page = () => {
  const searchParams = useSearchParams();
  const { topic_id } = useParams();
  const [topicData, setTopicData] = useState<any>();
  const [isTopicDataLoading, setIsTopicDataLoading] = useState<boolean>();
  const [blogCount, setBlogCount] = useState<Number>();
  const [blogGeneratedState, setBlogGeneratedState] = useState<boolean>(false);
  const userState = useAppSelector((state) => state.currentUser);
  const state = useAppSelector((state) => state.currentBlogTopic);
  const dispatch = useAppDispatch();

  const [
    triggerGenerateBlog,
    { data: generatedBlog, isLoading: loadingFirstBlog },
  ] = useLazyGenerateBlogQuery();


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

  async function handleGenerateBlog(value: any) {
    if (userState.limitLeft === 0) {
      toast("Limit reached!!!");
      return;
    }
    try {
      value["token"] = state?.blogToken || "";
      const requestData = {
        topic: topicData.topic_name,
        tone: topicData.tone,
        outline: topicData.outline,
        main_keyword: topicData.main_keyword,
        secondary_keywords: topicData.secondary_keywords,
        ...value,
      };

      const { data: blogData, isSuccess } = await triggerGenerateBlog(
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

      if (!blogData || !isSuccess) throw new Error("Blog generation failed");

      const { error: blogInsertError } = await supabase
        .from(TablesName.BLOGS)
        .insert([
          {
            topic_id: topic_id,
            content: blogData?.data?.blog,
            feedback: blogData?.data?.feedback ?? "",
          },
        ])
        .select();

      const { error: descriptionInsertError, data: updatedTopicData } = await supabase
        .from(TablesName.TOPICS)
        .update([
          {
            banner_description: blogData?.data?.banner_description,
            meta_description: blogData?.data?.meta_description
          },
        ])
        .eq('id', topic_id)
        .select()
      setTopicData(updatedTopicData[0]);
      if (blogData) {
        setBlogGeneratedState(true);
        toast("Blog Generated");
      }
    } catch (error) {
      toast(error);
    }
  }

  useEffect(() => {
    fetchTopicData();
    if (searchParams.get("content") === 'new') {
      // handleGenerateBlog();
    }
  }, []);
  console.log("searchParams", searchParams);

  return (
    <div className="container mx-auto relative">
      <div className="mx-auto space-y-8">
        {/* data for the topic */}
        <TopicCard topicData={topicData} isLoading={isTopicDataLoading} feedbackUpdated={blogCount} />
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
