"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import {
  GenerateOutlineRequest,
  useLazyGenerateOutlineQuery,
} from "@/redux/api/api";
import { AlertTriangle, Loader2, PlusCircle, X, Zap } from "lucide-react";
import { setCurrentBlog } from "@/redux/slices/currentBlogTopic";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppRoutes, TablesName } from "@/lib/utils";
import { toast } from "sonner";
import { setUserLimit } from "@/redux/slices/currentUserSlice";
import ReCAPTCHA from "react-google-recaptcha";

const outLinrFormSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters" }),
  main_keyword: z
    .string()
    .min(2, { message: "Main Keyword must be at least 2 characters" })
    .max(30, { message: "Main Keyword must not greater than 30 characters" })
    .optional(),
  secondary_keywords: z.array(z.string()).optional(),
  tone: z.string().min(1, { message: "Please select a tone" }),
});

type OutLineFormValues = z.infer<typeof outLinrFormSchema>;

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [reqOutlineData, setReqOutlineData] =
    useState<GenerateOutlineRequest>();
  const userState = useAppSelector((state) => state.currentUser);
  const state = useAppSelector((state) => state.currentBlogTopic);
  const [currentKeyword, setCurrentKeyword] = useState<string>("");
  const [limitLeftState, setLimitLeftState] = useState<number>();
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState(true);

  const outLineForm = useForm<OutLineFormValues>({
    resolver: zodResolver(outLinrFormSchema),
    defaultValues: {
      topic: "",
      main_keyword: "",
      secondary_keywords: [],
      tone: "professional",
    },
  });

  const tones = [
    { value: "professional", label: "Professional" },
    { value: "casual", label: "Casual" },
    { value: "friendly", label: "Friendly" },
    { value: "formal", label: "Formal" },
    { value: "humorous", label: "Humorous" },
    { value: "authoritative", label: "Authoritative" },
    { value: "Conversational", label: "Conversational" },
    { value: "Enthusiastic", label: "Enthusiastic" },
    { value: "Informative", label: "Informative" },
    { value: "objective", label: "objective" },
  ];

  const [
    triggerGenerateOutline,
    { data: generatedOutline, isLoading: loadingFirstOutline },
  ] = useLazyGenerateOutlineQuery();

  const handleSubmit = (data: any) => {
    if (!recaptchaValue) {
      setRecaptchaError(true);
      return;
    }
    setRecaptchaError(false);
    handleGenerateOutline(data);
  };

  async function handleGenerateOutline(value: any) {
    if (!limitLeftState) {
      toast("Your Limit reached. Please upgrade or contact org.");
      return;
    }
    try {
      value["token"] = state?.blogToken || "";
      value["secondary_keywords"] =
        value["secondary_keywords"]?.join(", ") ?? "";

      const { data: outlineData, isSuccess } = await triggerGenerateOutline(
        value
      );

      if (isSuccess && outlineData) {
        const datatoInsert = {
          user_id: userState?.id,
          topic_name: value?.topic,
          word_count: value?.word_count,
          main_keyword: value?.main_keyword,
          secondary_keywords: value?.secondary_keywords,
          outline: outlineData?.data?.outline,
          tone: value?.tone,
        };

        // decresing the limit
        setLimitLeftState((val) => val - 1);

        const { data, error } = await supabase
          .from("users")
          .update({ limitLeft: limitLeftState - 1 })
          .eq("uuid", userState.id)
          .select();

        // Insert into "Topics" table
        const { data: topicDataInserted, error: topicInsertError } =
          await supabase.from("Topics").insert([datatoInsert]).select();

        if (topicDataInserted) {
          setReqOutlineData(value);
          router.push(`${AppRoutes.DASHBOARD}/${topicDataInserted[0]?.id}`);
        }

        if (topicInsertError) throw new Error(topicInsertError.message);
        if (!topicDataInserted || topicDataInserted.length === 0)
          throw new Error("Topic insertion failed");
      } else {
        throw new Error("Outline generation failed");
      }
    } catch (error) {
      console.error("Error in onSubmit:", error);
    }
  }

  const addKeyword = () => {
    const trimmedKeyword = currentKeyword?.trim();
    if (
      trimmedKeyword &&
      !outLineForm.getValues().secondary_keywords?.includes(trimmedKeyword)
    ) {
      const currentKeywords = outLineForm.getValues().secondary_keywords || [];
      outLineForm.setValue("secondary_keywords", [
        ...currentKeywords,
        trimmedKeyword,
      ]);
      setCurrentKeyword("");
    }
  };

  const removeKeyword = (indexToRemove: number) => {
    const tempCurrentKeywords =
      outLineForm.getValues().secondary_keywords || [];
    const updatedKeywords = tempCurrentKeywords.filter(
      (_, index) => index !== indexToRemove
    );
    outLineForm.setValue("secondary_keywords", updatedKeywords, {
      shouldValidate: true,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword();
    }
  };

  const handleRecaptchaOnChange = (value) => {
    setRecaptchaValue(value);
    setRecaptchaError(false);
  };

  const checkLimit = async () => {
    const { data: limit, error } = await supabase
      .from("users")
      .select("limitLeft")
      .eq("uuid", userState.id);

    setLimitLeftState(limit[0]?.limitLeft);
    dispatch(setUserLimit({ limitLeft: limit[0]?.limitLeft }));
  };

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
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="container mx-auto py-10">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl shimmer">
              Content Creator
            </h1>
            <p>Generate AI-powered content.</p>
          </div>
          <Form {...outLineForm}>
            <form
              onSubmit={outLineForm.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Outline Generation</CardTitle>
                  <CardDescription>
                    Enter the details for your outline generation.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={outLineForm.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                          Topic
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your topic"
                            {...field}
                            className="w-full rounded-md border border-border px-4 py-3 bg-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={outLineForm.control}
                    name="tone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                          Content Tone
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full rounded-md border border-border px-4 py-3 bg-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500">
                              <SelectValue placeholder="Select a tone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white">
                            {tones.map((tone) => (
                              <SelectItem
                                key={tone.value}
                                value={tone.value}
                                className="cursor-pointer"
                              >
                                {tone.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={outLineForm.control}
                    name="main_keyword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                          Main Keyword
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Main Keyword"
                            {...field}
                            className="w-full rounded-md border border-border px-4 py-3 bg-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-2">
                    <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                      Secondary Keywords
                    </FormLabel>
                    <div className="flex items-center">
                      <Input
                        value={currentKeyword}
                        onChange={(e) => setCurrentKeyword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Add keywords and press Enter"
                        className="flex-1 rounded-md border border-border px-4 py-3 bg-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <Button
                        type="button"
                        onClick={addKeyword}
                        variant="ghost"
                        className="ml-2"
                        disabled={!currentKeyword?.trim()}
                      >
                        <PlusCircle className="h-5 w-5" />
                      </Button>
                    </div>
                    {outLineForm.getValues().secondary_keywords &&
                      outLineForm.getValues().secondary_keywords.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {outLineForm
                            .getValues()
                            .secondary_keywords.map((keyword, index) => (
                              <div
                                key={index}
                                className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center text-sm"
                              >
                                {keyword}
                                <button
                                  type="button"
                                  onClick={() => removeKeyword(index)}
                                  className="ml-2 text-purple-600 hover:text-purple-800 focus:outline-none"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                        </div>
                      )}
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="w-full flex flex-col gap-2 mt-2">
                    <div className="flex flex-col gap-4">
                      <ReCAPTCHA
                        sitekey={RECAPTCHA_SITE_KEY}
                        onChange={handleRecaptchaOnChange}
                        theme="light"
                        className="transform scale-[0.95] -ml-3"
                      />
                      {recaptchaError && (
                        <div className="flex items-center gap-2 text-destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-sm">
                            Please complete the reCAPTCHA
                          </span>
                        </div>
                      )}
                    </div>
                    <Button
                      disabled={
                        recaptchaError ||
                        limitLeftState === 0 ||
                        loadingFirstOutline
                      }
                      type="submit"
                      className="w-full bg-purple-600 text-white rounded-md py-3 px-4 font-medium hover:bg-purple-700 transition-colors flex items-center justify-center"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      {loadingFirstOutline && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {loadingFirstOutline
                        ? "Generating..."
                        : "Generate Outline"}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
