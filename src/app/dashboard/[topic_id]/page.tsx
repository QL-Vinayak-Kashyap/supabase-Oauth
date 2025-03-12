"use client";

import { ContentGenerator } from "@/components/app/content-generator";
import { useParams } from "next/navigation";
import React from "react";

const page = () => {
  const { topic_id } = useParams();

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
          <ContentGenerator topicId={topic_id} />
        </div>
      </div>
    </div>
  );
};

export default page;
