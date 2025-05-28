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
import { setCurrentBlog, setCurrentStep, updateBlogData } from "@/redux/slices/currentBlogTopic";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppRoutes, BlogData, TablesName } from "@/lib/utils";
import { toast } from "sonner";
import { setUserLimit } from "@/redux/slices/currentUserSlice";
import ReCAPTCHA from "react-google-recaptcha";
import StepOutline from "@/components/app/Blog/StepOutline";
import StepTopicInput from "@/components/app/Blog/StepTopicInput";
import StepPrimaryKeywords from "@/components/app/Blog/StepPrimaryKeyword";
import StepSecondaryKeywords from "@/components/app/Blog/StepSecondaryKeyword";
import StepGenerate from "@/components/app/Blog/StepGenerate";
import StepTone from "@/components/app/Blog/StepTone";

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
  // const { currentStep, blogData, showBlog } = useAppSelector((state) => state.blog);
  // const [currentKeyword, setCurrentKeyword] = useState<string>("");
  const [limitLeftState, setLimitLeftState] = useState<number>();
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState(true);

  // const outLineForm = useForm<OutLineFormValues>({
  //   resolver: zodResolver(outLinrFormSchema),
  //   defaultValues: {
  //     topic: "",
  //     main_keyword: "",
  //     secondary_keywords: [],
  //     tone: "professional",
  //   },
  // });

  // const tones = [
  //   { value: "professional", label: "Professional" },
  //   { value: "casual", label: "Casual" },
  //   { value: "friendly", label: "Friendly" },
  //   { value: "formal", label: "Formal" },
  //   { value: "humorous", label: "Humorous" },
  //   { value: "authoritative", label: "Authoritative" },
  //   { value: "Conversational", label: "Conversational" },
  //   { value: "Enthusiastic", label: "Enthusiastic" },
  //   { value: "Informative", label: "Informative" },
  //   { value: "objective", label: "objective" },
  // ];

  // const [currentStep, setCurrentStep] = useState<BlogWizardStep>("topic");
  const [blogData, setBlogData] = useState<BlogData>({
    topic: "",
    primaryKeywords: "",
    secondaryKeywords: [],
    tone:"",
    outline: "",
    generatedBlog: ""
  });

  const [
    triggerGenerateOutline,
    { data: generatedOutline, isLoading: loadingFirstOutline },
  ] = useLazyGenerateOutlineQuery();

  const handleSubmit = () => {

    dispatch(setCurrentStep("outline"));

    // if (!recaptchaValue) {
    //   setRecaptchaError(true);
    //   return;
    // }
    // setRecaptchaError(false);
    // handleGenerateOutline();
  };

  // async function handleGenerateOutline() {
  //   if (!limitLeftState) {
  //     toast("Your Limit reached. Please upgrade or contact org.");
  //     return;
  //   }
  //   try {
  //     const value : GenerateOutlineRequest ={token: state?.blogToken || "", topic : blogData.topic , main_keyword : blogData.primaryKeywords, secondary_keywords : blogData.secondaryKeywords?.join(", ") , tone: blogData.tone };

  //     // value["token"] = state?.blogToken || "";
  //     // value["secondary_keywords"] =
  //     // value["secondary_keywords"]?.join(", ") ?? "";

  //     console.log("value",value);

  //     const { data: outlineData, isSuccess } = await triggerGenerateOutline(
  //       value
  //     );

  //     if (isSuccess && outlineData) {
  //       const datatoInsert = {
  //         user_id: userState?.id,
  //         topic_name: value?.topic,
  //         word_count: value?.word_count,
  //         main_keyword: value?.main_keyword,
  //         secondary_keywords: value?.secondary_keywords,
  //         outline: outlineData?.data?.outline,
  //         tone: value?.tone,
  //       };

  //       // decresing the limit
  //       setLimitLeftState((val) => val - 1);

  //       const { data, error } = await supabase
  //         .from("users")
  //         .update({ daily_limit: limitLeftState - 1 })
  //         .eq("uuid", userState.id)
  //         .select();

  //       // Insert into "Topics" table
  //       const { data: topicDataInserted, error: topicInsertError } =
  //         await supabase.from("Topics").insert([datatoInsert]).select();

  //       if (topicDataInserted) {
  //         setReqOutlineData(value);
  //         // router.push(`${AppRoutes.DASHBOARD}/${topicDataInserted[0]?.id}`);
  //       }

  //       if (topicInsertError) throw new Error(topicInsertError.message);
  //       if (!topicDataInserted || topicDataInserted.length === 0)
  //         throw new Error("Topic insertion failed");
  //     } else {
  //       throw new Error("Outline generation failed");
  //     }
  //   } catch (error) {
  //     console.error("Error in onSubmit:", error);
  //   }
  // }

  // const addKeyword = () => {
  //   const trimmedKeyword = currentKeyword?.trim();
  //   if (
  //     trimmedKeyword &&
  //     !outLineForm.getValues().secondary_keywords?.includes(trimmedKeyword)
  //   ) {
  //     const currentKeywords = outLineForm.getValues().secondary_keywords || [];
  //     outLineForm.setValue("secondary_keywords", [
  //       ...currentKeywords,
  //       trimmedKeyword,
  //     ]);
  //     setCurrentKeyword("");
  //   }
  // };

  // const removeKeyword = (indexToRemove: number) => {
  //   const tempCurrentKeywords =
  //     outLineForm.getValues().secondary_keywords || [];
  //   const updatedKeywords = tempCurrentKeywords.filter(
  //     (_, index) => index !== indexToRemove
  //   );
  //   outLineForm.setValue("secondary_keywords", updatedKeywords, {
  //     shouldValidate: true,
  //   });
  // };

  // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Enter") {
  //     e.preventDefault();
  //     addKeyword();
  //   }
  // };

  // const handleRecaptchaOnChange = (value) => {
  //   setRecaptchaValue(value);
  //   setRecaptchaError(false);
  // };

  const checkLimit = async () => {
    const { data: limit, error } = await supabase
      .from("users")
      .select("daily_limit")
      .eq("uuid", userState.id);

    setLimitLeftState(limit[0]?.daily_limit);
    dispatch(setUserLimit({ limitLeft: limit[0]?.daily_limit }));
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

  // useEffect(()=>{
  //   const dispatchData: CurrentBlog = {
  //     blogToken: "",
  //     topic: "",
  //     topic_id: "",
  //     wordsNumber: "",
  //     outline: "",  
  //     currentStep:'topic',
  //     main_keyword:"",
  //     secondary_keywords:[],
  //     tone: "",
  //   };
  //   dispatch(setCurrentBlog(dispatchData));
  // },[state.currentStep])

  // return (
  //   <div className="flex flex-1 flex-col gap-4 p-4">
  //     <div className="container mx-auto">
  //       <div className="mx-auto w-full space-y-8">
  //         <div className="space-y-2 text-center">
  //           <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl shimmer">
  //             Content Creator
  //           </h1>
  //           <p>Generate AI-powered content.</p>
  //         </div>
  //         <Form {...outLineForm}>
  //           <form
  //             onSubmit={outLineForm.handleSubmit(handleSubmit)}
  //             className="space-y-6"
  //           >
  //             <Card>
  //               <CardHeader>
  //                 <CardTitle>Outline Generation</CardTitle>
  //                 <CardDescription>
  //                   Enter the details for your outline generation.
  //                 </CardDescription>
  //               </CardHeader>
  //               <CardContent className="space-y-4">
  //                 <FormField
  //                   control={outLineForm.control}
  //                   name="topic"
  //                   render={({ field }) => (
  //                     <FormItem>
  //                       <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
  //                         Topic
  //                       </FormLabel>
  //                       <FormControl>
  //                         <Input
  //                           placeholder="Enter your topic"
  //                           {...field}
  //                           className="w-full rounded-md border border-border px-4 py-3 bg-white/70 focus:outline-none focus:ring-2 focus:ring-grey-500"
  //                         />
  //                       </FormControl>
  //                       <FormMessage />
  //                     </FormItem>
  //                   )}
  //                 />
  //                 <FormField
  //                   control={outLineForm.control}
  //                   name="tone"
  //                   render={({ field }) => (
  //                     <FormItem>
  //                       <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
  //                         Content Tone
  //                       </FormLabel>
  //                       <Select
  //                         onValueChange={field.onChange}
  //                         defaultValue={field.value}
  //                       >
  //                         <FormControl>
  //                           <SelectTrigger className="w-full rounded-md border border-border px-4 py-3 bg-white/70 focus:outline-none focus:ring-2 focus:ring-grey-500">
  //                             <SelectValue placeholder="Select a tone" />
  //                           </SelectTrigger>
  //                         </FormControl>
  //                         <SelectContent className="bg-white">
  //                           {tones.map((tone) => (
  //                             <SelectItem
  //                               key={tone.value}
  //                               value={tone.value}
  //                               className="cursor-pointer"
  //                             >
  //                               {tone.label}
  //                             </SelectItem>
  //                           ))}
  //                         </SelectContent>
  //                       </Select>
  //                       <FormMessage />
  //                     </FormItem>
  //                   )}
  //                 />
  //                 <FormField
  //                   control={outLineForm.control}
  //                   name="main_keyword"
  //                   render={({ field }) => (
  //                     <FormItem>
  //                       <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
  //                         Main Keyword
  //                       </FormLabel>
  //                       <FormControl>
  //                         <Input
  //                           placeholder="Enter Main Keyword"
  //                           {...field}
  //                           className="w-full rounded-md border border-border px-4 py-3 bg-white/70 focus:outline-none focus:ring-2 focus:ring-grey-500"
  //                         />
  //                       </FormControl>
  //                       <FormMessage />
  //                     </FormItem>
  //                   )}
  //                 />
  //                 <div className="space-y-2">
  //                   <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
  //                     Secondary Keywords
  //                   </FormLabel>
  //                   <div className="flex items-center">
  //                     <Input
  //                       value={currentKeyword}
  //                       onChange={(e) => setCurrentKeyword(e.target.value)}
  //                       onKeyDown={handleKeyDown}
  //                       placeholder="Add keywords and press Enter"
  //                       className="flex-1 rounded-md border border-border px-4 py-3 bg-white/70 focus:outline-none focus:ring-2 focus:ring-grey-500"
  //                     />
  //                     <Button
  //                       type="button"
  //                       onClick={addKeyword}
  //                       variant="ghost"
  //                       className="ml-2"
  //                       disabled={!currentKeyword?.trim()}
  //                     >
  //                       <PlusCircle className="h-5 w-5" />
  //                     </Button>
  //                   </div>
  //                   {outLineForm.getValues().secondary_keywords &&
  //                     outLineForm.getValues().secondary_keywords.length > 0 && (
  //                       <div className="flex flex-wrap gap-2 mt-3">
  //                         {outLineForm
  //                           .getValues()
  //                           .secondary_keywords.map((keyword, index) => (
  //                             <div
  //                               key={index}
  //                               className="bg-grey-100 text-grey-800 px-3 py-1 rounded-full flex items-center text-sm"
  //                             >
  //                               {keyword}
  //                               <button
  //                                 type="button"
  //                                 onClick={() => removeKeyword(index)}
  //                                 className="ml-2 text-grey-600 hover:text-grey-800 focus:outline-none"
  //                               >
  //                                 <X className="h-3 w-3" />
  //                               </button>
  //                             </div>
  //                           ))}
  //                       </div>
  //                     )}
  //                 </div>
  //               </CardContent>
  //               <CardFooter>
  //                 <div className="w-full flex flex-col gap-2 mt-2">
  //                   <div className="flex flex-col gap-4">
  //                     <ReCAPTCHA
  //                       sitekey={RECAPTCHA_SITE_KEY}
  //                       onChange={handleRecaptchaOnChange}
  //                       theme="light"
  //                       className="transform scale-[0.95] -ml-3"
  //                     />
  //                   </div>
  //                   <Button
  //                     disabled={
  //                       recaptchaError ||
  //                       limitLeftState === 0 ||
  //                       loadingFirstOutline
  //                     }
  //                     variant="default"
  //                     type="submit"
  //                     className="glossy-button w-full py-3 px-4 font-medium hover:bg-grey-700 transition-colors flex items-center justify-center"
  //                   >
  //                     <Zap className="h-4 w-4 mr-2" />
  //                     {loadingFirstOutline && (
  //                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  //                     )}
  //                     {loadingFirstOutline
  //                       ? "Generating..."
  //                       : "Generate Outline"}
  //                   </Button>
  //                 </div>
  //               </CardFooter>
  //             </Card>
  //           </form>
  //         </Form>
  //       </div>
  //     </div>
  //   </div>
  // );



  const [showBlog, setShowBlog] = useState(false);

  const handleGenerateBlog = () => {
    // In a real app, you would call an API to generate the blog
    // Here we'll just simulate the blog generation by setting a flag
    setShowBlog(true);
    // The real content would be set in setBlogData({ ...blogData, generatedBlog: response.blogContent })
  };

  const renderStepContent = () => {
    switch (state.currentStep) {
      case 'topic':
        return (
          <StepTopicInput 
            topic={state.blogData.topic} 
            onTopicChange={(topic) => dispatch(updateBlogData({ topic }))}
            onNext={() => dispatch(setCurrentStep('primary'))}
          />
        );
      case 'primary':
        return (
          <StepPrimaryKeywords 
            topic={state.blogData.topic}
            primaryKeywords={blogData.primaryKeywords}
            onKeywordsChange={(keywords) => dispatch(updateBlogData({ primaryKeywords: keywords }))}
            onNext={() => dispatch(setCurrentStep('secondary'))}
            onBack={() => dispatch(setCurrentStep('topic'))}
          />
        );
      case 'secondary':
        return (
          <StepSecondaryKeywords 
          // blogData={state.blogData}
            topic={state.blogData.topic}
            primaryKeywords={state.blogData.primaryKeywords}
            secondaryKeywords={state.blogData.secondaryKeywords}
            onKeywordsChange={(keywords) => dispatch(updateBlogData({ secondaryKeywords: keywords }))}
            // onNext={() => dispatch(setCurrentStep('outline')}
            onNext={()=> dispatch(setCurrentStep('tone'))}
            onBack={() => dispatch(setCurrentStep('primary'))}
          />  
        );
        case 'tone':
        return (
          <StepTone
            topic={state.blogData.topic}
            primaryKeywords={state.blogData.primaryKeywords}
            secondaryKeywords={state.blogData.secondaryKeywords}
            tone={state.blogData.tone}
            onToneChange={(tone) => dispatch(updateBlogData({ tone }))}
            onNext={() => handleSubmit()}
            onBack={() => dispatch(setCurrentStep('secondary'))}
            />);
      case 'outline':
        return (
          <StepOutline 
            // blogData ={state.blogData}
            outline={state.blogData.outline}
            onOutlineChange={(outline) => dispatch(updateBlogData({ outline }))}
            onNext={() => dispatch(setCurrentStep('generate'))}
            onBack={() => dispatch(setCurrentStep('tone'))}
          />
        );
      case 'generate':
        return (
          <StepGenerate 
            // blogData={state.blogData}
            onGenerateBlog={handleGenerateBlog}
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
          {/* <div className="p-4 border-b flex items-center">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-xl font-semibold">Blog Wizard AI</h1>
          </div> */}
          
          <div className="p-6">
            {/* {showBlog ? (
              <BlogDisplay blogData={blogData} />
            ) : ( */}
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-2">AI-Powered Blog Creator</h2>
                  <p className="text-gray-600">
                    Complete the steps below to generate high-quality blog content using artificial intelligence.
                  </p>
                </div>

                {/* Steps Indicator */} 
                <div className="mb-8">
                  <div className="flex justify-between">
                    {['topic', 'primary', 'secondary', 'tone', 'outline', 'generate'].map((step, index) => {
                      const isActive = state.currentStep === step;
                      const isCompleted = ['topic', 'primary', 'secondary', 'tone','outline', 'generate'].indexOf(state.currentStep) >= index;
                      
                      return (
                        <div key={step} className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                            isActive ? 'bg-primary text-white' : 
                            isCompleted ? 'bg-green-600 text-white' : 'bg-gray-200'
                          }`}>  
                            {index + 1}
                          </div>
                          <span className={`text-xs text-center ${isActive ? 'font-medium text-primary' : 'text-gray-600'}`}>
                            {step === 'topic' ? 'Topic' : 
                             step === 'primary' ? 'Primary Keywords' :
                             step === 'secondary' ? 'Secondary Keywords' :
                             step === 'tone' ? 'Tone' :
                             step === 'outline' ? 'Outline' : 'Generate'}
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
                          state.currentStep === 'topic' ? '0%' : 
                          state.currentStep === 'primary' ? '20%' : 
                          state.currentStep === 'secondary' ? '40%' : 
                          state.currentStep === 'tone' ? '60%' :
                          state.currentStep === 'outline' ? '80%' : '100%'
                        }` 
                      }} 
                    ></div>
                  </div>
                </div>

                {/* Current Step Form */}
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  {renderStepContent()}
                </div>
              </div>
            {/* )} */}
          </div>
        </main>
      </div>
  );
}
