'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft, X, ArrowRightFromLine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { StepPrimaryKeywordsProps } from "@/types";



const StepPrimaryKeywords = ({ 
  topic, 
  primaryKeywords, 
  onKeywordsChange, 
  onNext, 
  onBack 
}: StepPrimaryKeywordsProps) => {
  const [newKeyword, setNewKeyword] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newKeyword.trim()) {
      onKeywordsChange(newKeyword.trim());
      onNext();
    }
  };

  useEffect(()=>{
    setNewKeyword(primaryKeywords);
  },[])

  return (
    <div className="space-y-4 relative">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Search className="w-5 h-5 text-primary" />
          <h3 className="text-md font-medium">Enter Primary Keywords</h3>
        </div>
        <p className="text-sm text-gray-500">
          Enter a primary keyword that will be the main focus of your blog.
        </p>
      </div>

      <div className="rounded-md bg-gray-50 p-3">
        <p className="text-sm font-medium">Topic: <span className="text-primary">{topic}</span></p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          placeholder="Enter a keyword"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          className="w-full bg-gray-200 text-base p-4 h-12"
        />
      <div className="flex justify-end">
        <Button type="submit" disabled={newKeyword.length === 0}>
          Next
        </Button>
      </div>
      </form>
      <Button variant="ghost" onClick={onBack} className="flex items-center gap-1 absolute bottom-0">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
    </div>
  );
};

export default StepPrimaryKeywords;
