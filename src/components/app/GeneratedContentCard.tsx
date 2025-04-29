import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Copy, FileEdit, FileIcon, Loader2 } from "lucide-react";
import { MarkdownRenderer } from "./markdown-renderer";
import { exportToWord } from "@/lib/export-to-word";
import React, { useRef } from "react";
import { toast } from "sonner";
import html2pdf from "html2pdf.js";
import { marked } from "marked";
import { handleExportPDF } from "@/lib/exportToPDF";

type FeedbackTypes = {
  feedback: string;
};

export default function GeneratedContentCard({
  generatedContent,
  feedbackForm,
  handleGenerateAgain,
  index = NaN,
  totalItems,
  loadingGeneratingBlogAgain,
  forWord,
  topicName,
  isEditOutline,
  handleOpenUpdateOutlineDailog,
}: any) {
  const [isExporting, setIsExporting] = React.useState(false);

  const helperHandleGenerateAgain = async (value: FeedbackTypes) => {
    handleGenerateAgain(value, forWord);
  };

  const handleExportToWord = async () => {
    if (!generatedContent) return;
    setIsExporting(true);

    try {
      await exportToWord(forWord, topicName ?? "");
    } catch (error) {
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportToPdf = async () => {
    if (!forWord) return;
    try{
      await handleExportPDF(forWord, topicName ?? "");
    }catch(err){toast("Error in exporting in PDF.")}
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {Number.isNaN(index) ? "Outline" : `${index + 1}.  Content`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="mb-4 w-full justify-start">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="rounded-md bg-muted p-4">
            <MarkdownRenderer content={generatedContent} />
          </TabsContent>
          <TabsContent value="markdown" className="rounded-md bg-muted p-4">
            <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm">
              {generatedContent}
            </pre>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <div className=" flex flex-row w-[100%] gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              navigator.clipboard.writeText(forWord);
              toast("Copied!!!");
            }}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy to Clipboard
          </Button>
          <Button
            variant="outline"
            onClick={handleExportToWord}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileEdit className="mr-2 h-4 w-4" />
            )}
            {isExporting ? "Exporting..." : "Export to Word"}
          </Button>
         {!Number.isNaN(index) && <Button
          variant="outline"
          className="text-sm"
          onClick={handleExportToPdf}
        >
          <FileIcon className="mr-2 h-4 w-4" />
          Export as PDF
        </Button>}
          {isEditOutline && (
            <Button
              variant="outline"
              onClick={handleOpenUpdateOutlineDailog}
              disabled={isExporting}
            >
              <FileEdit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
        {index === totalItems - 1 && (
          <div className="w-full mx-auto p-4 border rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">
              Provide Ideas for Regeneration
            </h2>
            <Form {...feedbackForm}>
              <form
                onSubmit={feedbackForm.handleSubmit(helperHandleGenerateAgain)}
              >
                <FormField
                  control={feedbackForm.control}
                  name="feedback"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          className="w-full p-2 border rounded-lg"
                          placeholder="Enter your feedback..."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  className="mt-4 w-full"
                  type="submit"
                  disabled={loadingGeneratingBlogAgain}
                >
                  {loadingGeneratingBlogAgain && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {loadingGeneratingBlogAgain
                    ? "Regenerating..."
                    : "Regenerate Content"}
                </Button>
              </form>
            </Form>
          </div>
        )}
      </CardFooter>
      {/* <div
              ref={contentRef}
              className="prose prose-lg max-w-none mt-4 p-4 bg-white hidden"
              dangerouslySetInnerHTML={{ __html: marked(forWord ?? "") }}
            /> */}
    </Card>
  );
}
