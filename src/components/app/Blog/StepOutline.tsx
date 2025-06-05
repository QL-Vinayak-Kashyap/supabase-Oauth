'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FilePen, ArrowLeft } from "lucide-react";
import GeneratedContentCard from "../GeneratedContentCard";
import { MdEditor } from "md-editor-rt";
import { useAppSelector } from "@/hooks/hooks";
import { toast } from "sonner";
import { GenerateOutlineRequest, useLazyGenerateOutlineQuery } from "@/redux/api/api";
import Loading from "../Loading";
import { StepOutlineProps } from "@/types";



const StepOutline = ({
  blogData,
  outline,
  onOutlineChange,
  onNext,
  onBack
}: StepOutlineProps) => {
  const userState = useAppSelector((state) => state.currentUser);
  const state = useAppSelector((state) => state.currentBlogTopic);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [outLineGenerated, setOutLineGenerated] = useState<string>("");
  const [outlineMarkdown, setOutlineMarkdown] = useState<string>("");

  const handleOpenUpdateOutlineDailog = () => {
    setDialogOpen(true);
  };

  const [
    triggerGenerateOutline,
    { data: generatedOutline, isLoading: loadingFirstOutline },
  ] = useLazyGenerateOutlineQuery();


  async function handleGenerateOutline() {
    // if (!limitLeftState) {
    //   toast("Your Limit reached. Please upgrade or contact org.");
    //   return;
    // }
    try {
      const value: GenerateOutlineRequest = { token: state?.blogToken || "", topic: blogData.topic, main_keyword: blogData.primaryKeywords, secondary_keywords: blogData.secondaryKeywords?.join(", "), tone: blogData.tone };

      const { data: outlineData, isSuccess } = await triggerGenerateOutline(
        value
      );

      if (isSuccess && outlineData) {
        setOutlineMarkdown(outlineData?.data?.outline);
        setOutLineGenerated(outlineData?.data?.outline);
      } else {
        throw new Error("Outline generation failed");
      }
    } catch (error) {
      console.error("Error in onSubmit:", error);
    }
  }

  const handleSaveOutline = async () => {
    onOutlineChange(outLineGenerated);

    const datatoInsert = {
      user_id: userState?.id,
      topic_name: blogData?.topic,
      word_count: "100",
      main_keyword: blogData?.primaryKeywords,
      secondary_keywords: blogData?.secondaryKeywords,
      outline: outLineGenerated,
      tone: blogData?.tone,
    };

    onNext();

    // const { data: topicDataInserted, error: topicInsertError } =
    // await supabase.from("Topics").insert([datatoInsert]).select();

  }

  useEffect(() => {
    if (blogData) {
      handleGenerateOutline();
    }
  }, [])

  console.log("setOutlineMarkdown",outlineMarkdown)

  return (
    <div className=" relative">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <FilePen className="w-5 h-5 text-primary" />
          <h3 className="text-md font-medium">Finalize Outline</h3>
        </div>
        <p className="text-sm text-gray-500">
          Organize and edit your blog outline.
        </p>
      </div>
      {loadingFirstOutline ? <Loading /> :
        <GeneratedContentCard
          generatedContent={outLineGenerated ?? ""}
          isEditOutline={true}
          handleOpenUpdateOutlineDailog={handleOpenUpdateOutlineDailog}
        />
      }
      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button onClick={() => handleSaveOutline()}>
          Next
        </Button>
      </div>
      {dialogOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full h-full max-w-7xl relative flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Markdown Editor</h2>
              <button
                className="text-gray-600 hover:text-black"
                onClick={() => setDialogOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="flex-1 h-[100vh] overflow">
              <MdEditor
                value={outlineMarkdown}
                onChange={setOutlineMarkdown}
                style={{ height: "100vh" }}
                language="en-US"
              />
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setDialogOpen(false)}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setDialogOpen(false);
                }}
                className="mr-2"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepOutline;
