"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import { setCurrentBlog, setCurrentStep, updateBlogData } from "@/redux/slices/currentBlogTopic";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/utils/customHooks/hooks";
import { setUserLimit } from "@/redux/slices/currentUserSlice";
import ReCAPTCHA from "react-google-recaptcha";
import StepOutline from "@/components/app/Blog/StepOutline";
import StepTopicInput from "@/components/app/Blog/StepTopicInput";
import StepPrimaryKeywords from "@/components/app/Blog/StepPrimaryKeyword";
import StepSecondaryKeywords from "@/components/app/Blog/StepSecondaryKeyword";
import StepGenerate from "@/components/app/Blog/StepGenerate";
import StepTone from "@/components/app/Blog/StepTone";
import { TablesName } from "@/lib/utils";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.currentUser);
  const state = useAppSelector((state) => state.currentBlogTopic);
  const [limitLeftState, setLimitLeftState] = useState<number>();
  


  const checkLimit = async () => {
    const { data: limit, error } = await supabase
      .from(TablesName.PROFILE)
      .select("daily_limit")
      .eq("id", userState.id);
        
      if(limit){
        setLimitLeftState(limit[0]?.daily_limit);
        dispatch(setUserLimit({ limitLeft: limit[0]?.daily_limit }));
      }
  };

  useEffect(() => {
    checkLimit();
  }, []);

  const renderStepContent = () => {
    switch (state.currentStep) {
      case "topic":
        return (
          <StepTopicInput
            topic={state.blogData.topic}
            onTopicChange={(topic) => dispatch(updateBlogData({ topic }))}
            onNext={() => dispatch(setCurrentStep("primary"))}
          />
        );
      case "primary":
        return (
          <StepPrimaryKeywords
            topic={state.blogData.topic}
            primaryKeywords={state.blogData.primaryKeywords}
            onKeywordsChange={(keywords) => dispatch(updateBlogData({ primaryKeywords: keywords }))}
            onNext={() => dispatch(setCurrentStep('secondary'))}
            onBack={() => dispatch(setCurrentStep('topic'))}
          />
        );
      case "secondary":
        return (
          <StepSecondaryKeywords
            // blogData={state.blogData}
            topic={state.blogData.topic}
            primaryKeywords={state.blogData.primaryKeywords}
            secondaryKeywords={state.blogData.secondaryKeywords?? [] }
            onKeywordsChange={(keywords) => dispatch(updateBlogData({ secondaryKeywords: keywords }))}
            // onNext={() => dispatch(setCurrentStep('outline')}
            onNext={() => dispatch(setCurrentStep("tone"))}
            onBack={() => dispatch(setCurrentStep("primary"))}
          />
        );
      case "tone":
        return (
          <StepTone
            topic={state.blogData.topic}
            primaryKeywords={state.blogData.primaryKeywords}
            secondaryKeywords={state.blogData.secondaryKeywords}
            tone={state.blogData.tone}
            onToneChange={(tone) => dispatch(updateBlogData({ tone }))}
            onNext={() => dispatch(setCurrentStep("outline"))}
            onBack={() => dispatch(setCurrentStep("secondary"))}
          />
        );
      case "outline":
        return (
          <StepOutline 
            blogData ={state.blogData}
            outline={state.blogData.outline}
            onOutlineChange={(outline) => dispatch(updateBlogData({ outline }))}
            onNext={() => dispatch(setCurrentStep("generate"))}
            onBack={() => dispatch(setCurrentStep("tone"))}
          />
        );
      case "generate":
        return (
          <StepGenerate 
            blogData={state.blogData}
            onBack={() => dispatch(setCurrentStep('outline'))}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex w-full">
       <main className="flex-1 bg-gray-50">
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            {/* <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">
                AI-Powered Blog Creator
              </h2>
              <p className="text-gray-600">
                Complete the steps below to generate high-quality blog content
                using artificial intelligence.
              </p>
            </div> */}
            {/* <div className="mb-8">
              <div className="flex justify-between">
                {[
                  "topic",
                  "primary",
                  "secondary",
                  "tone",
                  "outline",
                  "generate",
                ].map((step, index) => {
                  const isActive = state.currentStep === step;
                  const isCompleted =
                    [
                      "topic",
                      "primary",
                      "secondary",
                      "tone",
                      "outline",
                      "generate",
                    ].indexOf(state.currentStep) >= index;

                  return (
                    <div key={step} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                          isActive
                            ? "bg-primary text-white"
                            : isCompleted
                            ? "bg-green-600 text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span
                        className={`hidden sm:block  text-xs text-center ${
                          isActive
                            ? "font-medium text-primary"
                            : "text-gray-600"
                        }`}
                      >
                        {step === "topic"
                          ? "Topic"
                          : step === "primary"
                          ? "Primary Keywords"
                          : step === "secondary"
                          ? "Secondary Keywords"
                          : step === "tone"
                          ? "Tone"
                          : step === "outline"
                          ? "Outline"
                          : "Generate"}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="relative mt-2">
                <div className="absolute top-0 h-1 bg-gray-200 w-full"></div>
                <div
                  className="absolute top-0 h-1 bg-primary transition-all"
                  style={{
                    width: `${
                      state.currentStep === "topic"
                        ? "0%"
                        : state.currentStep === "primary"
                        ? "20%"
                        : state.currentStep === "secondary"
                        ? "40%"
                        : state.currentStep === "tone"
                        ? "60%"
                        : state.currentStep === "outline"
                        ? "80%"
                        : "100%"
                    }`,
                  }}
                ></div>
              </div>
            </div> */}
            {/* Current Step Form */}
            {/* <div className="bg-white p-6 rounded-lg border shadow-sm">
              {renderStepContent()}
            </div> */}
          </div>
        </div>
      </main>
    </div>
  );
}
