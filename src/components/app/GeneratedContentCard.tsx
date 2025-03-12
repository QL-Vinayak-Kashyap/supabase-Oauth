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
import { Copy, FileEdit, Loader2 } from "lucide-react";
import { MarkdownRenderer } from "./markdown-renderer";
import { exportToWord } from "@/lib/export-to-word";
import React from "react";

export default function GeneratedContentCard({
  generatedContent,
  feedbackForm,
  handleGenerateAgain,
  index,
  totalItems,
  loadingGeneratingBlogAgain,
  forWord,
  topicName,
}: any) {
  const [isExporting, setIsExporting] = React.useState(false);

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>{index + 1}. Generated Content</CardTitle>
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
        <div className=" flex flex-row w-[100%]">
          <Button
            variant="secondary"
            onClick={() => {
              const activeTab = document.querySelector(
                '[role="tabpanel"]:not([hidden])'
              );
              const content = activeTab?.textContent || generatedContent;
              navigator.clipboard.writeText(content);
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
        </div>
        {index === totalItems - 1 && (
          <div className="w-full mx-auto p-4 border rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Add Feedback</h2>
            <Form {...feedbackForm}>
              <form onSubmit={feedbackForm.handleSubmit(handleGenerateAgain)}>
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
                    ? "Generating..."
                    : "Generate Content"}
                </Button>
              </form>
            </Form>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
