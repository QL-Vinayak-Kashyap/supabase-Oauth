"use client";

import * as React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLazyGenerateBlogWithFeedbackQuery } from "@/redux/api/api";
import { useForm } from "react-hook-form";

import GeneratedContentCard from "./GeneratedContentCard";
import { highlightDifferencesMarkdown } from "@/lib/getDifferenceText";
import { supabase } from "@/lib/supabaseClient";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { TablesName } from "@/lib/utils";
import { toast } from "sonner";
import { setUserLimit } from "@/redux/slices/currentUserSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface GeneratedContent {
  content: string;
  markdown: string;
  wordCount: number;
}

const schema = z.object({
  feedback: z.string().min(2),
});

export function ContentGenerator({
  topicId,
  blogGeneratedState,
  setBlogCount,
}: any) {


  const {generatedBlog,currentSelectedId} =useAppSelector((state: any)=>state.currentBlog )

  return (
    <div className="space-y-8">
          {generatedBlog?.filter((item)=> item.id === currentSelectedId)
            .map((item: any, index: number) => {
              let diffContent = item.content;
                diffContent = highlightDifferencesMarkdown(
                  blogs[index - 1].content,
                  item.content
                );

              return (
                <div key={item.id} className="mb-4">
                  {/* {item.feedback !== "" ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>Earlier Recommendation:</CardTitle>
                        <CardDescription>"{item.feedback}"</CardDescription>
                      </CardHeader>
                    </Card>
                  ) : null} */}
                  <GeneratedContentCard
                    index={index}
                    generatedContent={diffContent}
                    forWord={item.content}
                    topicName={topic[0]?.topic_name}
                  />
                </div>
              );
            })}
    </div>
  );
}
