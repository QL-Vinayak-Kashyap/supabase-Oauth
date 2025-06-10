"use client"

import { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { PenSquare, ArrowLeft, X } from "lucide-react";
import { Badge } from "../../ui/badge";
import { Input } from "../../ui/input";
import { StepSecondaryKeywordsProps } from "@/types";

const StepSecondaryKeywords = ({
  topic, 
  primaryKeywords,
  secondaryKeywords,
  onKeywordsChange, 
  onNext, 
  onBack
}: StepSecondaryKeywordsProps) => {
  const [newKeyword, setNewKeyword] = useState("");

  const addKeyword = (keyword: string) => {
    keyword = keyword.trim();
    if (keyword && !secondaryKeywords?.includes(keyword) && !primaryKeywords.includes(keyword)) {
      onKeywordsChange([...secondaryKeywords, keyword]);
      setNewKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    onKeywordsChange(secondaryKeywords.filter(k => k !== keyword));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newKeyword.trim()) {
      addKeyword(newKeyword.trim());
    }
  };

  return (
    <div className="max-w-full mx-auto p-4">
      <div className="flex flex-col space-y-4">
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <PenSquare className="w-5 h-5 text-primary" />
            <h3 className="text-md font-medium">Enter Secondary Keywords</h3>
          </div>
          <p className="text-sm text-gray-500">
            Enter 5-10 secondary keywords to support your primary keywords.
          </p>
        </div>

      
        <div className="rounded-md bg-gray-50 p-3 space-y-2">
          <p className="text-sm font-medium">
            Topic: <span className="text-primary">{topic}</span>
          </p>
          <div>
            <p className="text-sm font-medium">Primary Keywords:</p>
            <div className="flex flex-wrap gap-1 mt-1">
              <Badge variant="default" className="text-xs">{primaryKeywords}</Badge>
            </div>
          </div>
        </div>

       
        <form onSubmit={handleSubmit} className="flex flex-row items-center sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Input
            placeholder="Enter a secondary keyword"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            className="w-full bg-gray-200 text-base p-4 h-12"
          />
          <Button type="submit" variant="secondary" size="sm" disabled={!newKeyword.trim()} className="cursor-pointer text-black border-black border-2 rounded">
            Add
          </Button>
        </form>
        <div>
          <p className="text-sm font-medium mb-2">Your secondary keywords:</p>
          {secondaryKeywords?.length > 0 ? (
            <div className="flex flex-wrap  gap-4">
              {secondaryKeywords.map((keyword, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1 pl-3">
                  {keyword}
                  <button
                    onClick={() => removeKeyword(keyword)}
                    className="ml-1 rounded-full hover:bg-gray-200 p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No secondary keywords added yet</p>
          )}
        </div>

        
        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button onClick={onNext} disabled={secondaryKeywords?.length == 0} >
            Next
          </Button>
        </div>
      </div>  
    </div>  
  );
};

export default StepSecondaryKeywords;
