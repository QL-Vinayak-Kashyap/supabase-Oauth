"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { FileText, Info } from "lucide-react";
import TopicDescriptionDialog from "./TopicDescriptionDialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { TablesName } from "../../lib/utils";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { generatedBlogTypes } from "@/types";
import { createClient } from "../../lib/supabase/client";

interface StickySupportButtonProps {
  generatedBlogData: generatedBlogTypes[];
  id: string;
  feedbackUpdated: Number;
  topicName: string;
} 

const StickySupportButton = ({
  generatedBlogData,
  id, feedbackUpdated,
  topicName
}: StickySupportButtonProps) => {
  const supabase = createClient()
  const { topic_id } = useParams();
  const [description, setDescription] =useState<any>({})
  const [loading, setLoading] =useState(false);
  // const getUpdatedTopicData = async () => {
  //   try {
  //     setLoading(true);
  //     const { data: Topics, error } = await supabase
  //     .from(TablesName.TOPICS)
  //     .select('topic_name,banner_description,meta_description').eq("id",topic_id);

  //     if(error){
  //       throw new Error("Error in fetching the updated description", error);
  //     }

  //     setDescription({
  //       name: Topics[0].topic_name,
  //       bannerDescription: Topics[0].banner_description,
  //       metaDescription: Topics[0].meta_description
  //     })

  //   } catch (error) {
  //     toast(error);
      
  //   }finally{
  //     setLoading(false);
  //   }
  // }

  // useEffect(() => { 
  //   if(topic_id){
  //     getUpdatedTopicData()
  //   }
  // }, [feedbackUpdated])
  return (
    <div className="z-50">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  // size="icon"
                  className="glossy-button rounded-lg shadow-lg border-2 border-grey-300 bg-gradient-to-r from-grey-50 to-grey-100 hover:from-grey-100 hover:to-grey-200 hover:text-white transition-all duration-300 animate-fade-in"
                  aria-label="View topic information"
                >
                  {/* <div className="absolute inset-0 rounded-full bg-grey-500 opacity-10 animate-pulse"></div> */}
                  {/* <FileText className="h-6 w-6 text-grey-700" /> */}
                  {loading ? "Upading..." : "Description"}
                </Button>
              </DialogTrigger>
              <TopicDescriptionDialog
                name={topicName}
                bannerDescription={generatedBlogData[0]?.banner_description}
                metaDescription={generatedBlogData[0]?.meta_description}
              />
            </Dialog>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-grey-800 text-white border-grey-900">
            <p>Topic descriptions</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default StickySupportButton;
