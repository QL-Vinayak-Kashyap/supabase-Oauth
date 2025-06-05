"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import {
    GenerateOutlineRequest,
} from "@/redux/api/api";
import {
    setCurrentBlog,
    setCurrentStep,
    updateBlogData,
    updateGenerationTypeState,
} from "@/redux/slices/currentBlogTopic";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { setUserLimit } from "@/redux/slices/currentUserSlice";
import ReCAPTCHA from "react-google-recaptcha";
import StepOutline from "@/components/app/Blog/StepOutline";
import StepTopicInput from "@/components/app/Blog/StepTopicInput";
import StepPrimaryKeywords from "@/components/app/Blog/StepPrimaryKeyword";
import StepSecondaryKeywords from "@/components/app/Blog/StepSecondaryKeyword";
import StepGenerate from "@/components/app/Blog/StepGenerate";
import StepTone from "@/components/app/Blog/StepTone";
import { Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { setGenerationType } from "@/redux/slices/currentBlogTopic";



const BlogWriter = () => {
    const dispatch = useAppDispatch();
    const [reqOutlineData, setReqOutlineData] = useState<GenerateOutlineRequest>();
    const userState = useAppSelector((state) => state.currentUser);
    const state = useAppSelector((state) => state.currentBlogTopic);
    const [limitLeftState, setLimitLeftState] = useState<number>();

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
                        secondaryKeywords={state.blogData.secondaryKeywords ?? []}
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
                        blogData={state.blogData}
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

    const checkLimit = async () => {
        const { data: limit, error } = await supabase
            .from("users")
            .select("daily_limit")
            .eq("uuid", userState.id);
        if (limit) {
            setLimitLeftState(limit[0]?.daily_limit);
            dispatch(setUserLimit({ limitLeft: limit[0]?.daily_limit }));
        }
    };

    const handleSetGenerationType = () => {
        dispatch(setGenerationType());
        dispatch(updateGenerationTypeState(false));
    }

    useEffect(() => {
        checkLimit();
        if (reqOutlineData) {
            const dispatchData: any = {
                blogToken: state?.blogToken || "",
                topic: reqOutlineData?.topic,
                wordsNumber: "",
            };
            dispatch(setCurrentBlog(dispatchData));
        }
    }, [reqOutlineData]);
    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">  
            {
                state.generationTypeComp ? <div className="mx-auto">
                    <div className="mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold">Start Your Article Journey</h1>
                        <p className="text-gray-600 text-sm md:text-base">
                            Select the writing mode that best fits your needs and time constraints
                        </p>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-4">Choose your writing mode:</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 10-Steps Article */}
                        <Card className="relative overflow-hidden border-2 hover:shadow-lg transition-shadow">
                            <div className="absolute top-4 left-4">
                                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                    Recommended
                                </Badge>
                            </div>

                            <CardContent className="p-6">
                                {/* Illustration Area */}
                                <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg p-6 mb-4 min-h-[120px] flex items-center justify-center">
                                    <div className="relative">
                                        <div className="w-16 h-12 bg-gradient-to-r from-pink-300 to-purple-300 rounded-md"></div>
                                        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-pink-400 rounded-full"></div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold">10-Steps Article</h3>
                                    <div className="flex items-center gap-1 text-teal-600">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-sm font-medium">5 mins</span>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <p className="font-medium text-gray-900 mb-3">Full control over:</p>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li>• Article Type (Listicles, How-to Guides, news articles, etc.)</li>
                                        <li>• Reference/Competitor Selection</li>
                                        <li>• Keywords</li>
                                        <li>• Word Length (500-5000 words)</li>
                                        <li>• Outline</li>
                                        <li>• Writing Style, CTA</li>
                                        <li>• Image, FAQs and other settings</li>
                                    </ul>
                                </div>

                                <Button className="w-full" variant="outline" onClick={() => handleSetGenerationType()}>
                                    Click to start
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Instant Article */}
                        <Card className="border-2 hover:shadow-lg transition-shadow">
                            <CardContent className="p-6 h-full flex flex-col justify-between">
                                <div className="absolute top-4 right-4">
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                                        Beta
                                    </Badge>
                                </div>

                                {/* Illustration Area */}
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 mb-4 min-h-[120px] flex items-center justify-center">
                                    <div className="relative">
                                        <div className="w-12 h-16 bg-white border-2 border-gray-200 rounded-md flex items-center justify-center">
                                            <Zap className="w-6 h-6 text-blue-500" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold">Instant Article</h3>
                                    <div className="flex items-center gap-1 text-teal-600">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-sm font-medium">1 min</span>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <p className="font-medium text-gray-900 mb-3">You Provide:</p>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li>• Topic/Title</li>
                                        <li>• Article Type (Listicles, How-to Guides, news articles, etc.)</li>
                                        <li>• Keywords (Optional)</li>
                                        <li>• Reference/Competitor Selection</li>
                                        <li>• We Handle the Rest!</li>
                                    </ul>
                                </div>

                                <Button className="w-full" variant="outline" disabled>
                                    Coming soon
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div> : <div className="min-h-screen flex w-full">
                    <main className="flex-1 bg-gray-50">
                        <div className="">
                            <div className="mx-auto">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold mb-2">
                                        AI-Powered Blog Creator
                                    </h2>
                                    <p className="text-gray-600">
                                        Complete the steps below to generate high-quality blog content
                                        using artificial intelligence.
                                    </p>
                                </div>
                                {/* Steps Indicator */}
                                <div className="mb-8">
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
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${isActive
                                                            ? "bg-primary text-white"
                                                            : isCompleted
                                                                ? "bg-green-600 text-white"
                                                                : "bg-gray-200"
                                                            }`}
                                                    >
                                                        {index + 1}
                                                    </div>
                                                    <span
                                                        className={`hidden sm:block  text-xs text-center ${isActive
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
                                                width: `${state.currentStep === "topic"
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
                                </div>
                                {/* Current Step Form */}
                                <div className="bg-white p-6 rounded-lg border shadow-sm">
                                    {renderStepContent()}
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            }

        </div>
    );
};

export default BlogWriter;