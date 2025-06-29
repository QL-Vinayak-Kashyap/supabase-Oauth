'use client'

import {  useState } from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { StepTopicInputProps } from "@/types";

const StepTopicInput = ({ topic, onTopicChange, onNext,onBack }: StepTopicInputProps) => {
  const [localTopic, setLocalTopic] = useState(topic);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localTopic?.trim()) {
      onTopicChange(localTopic.trim());
      onNext();
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-medium">Enter a Blog Topic</h3>
        </div>
        <p className="text-sm text-gray-500">
          Provide a topic for your blog post. Being specific will help generate better content.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          placeholder="e.g., 'The Benefits of Meditation for Mental Health'"
          value={localTopic}
          onChange={(e) => setLocalTopic(e.target.value)}
          className="w-full bg-gray-200 text-base p-4 h-12"
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!localTopic?.trim()}
          >
            Next
          </Button>
        </div>
      </form>
      <Button variant="ghost" onClick={()=> onBack()} className="flex items-center gap-1 absolute bottom-0">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
    </div>
  );
};

export default StepTopicInput;
