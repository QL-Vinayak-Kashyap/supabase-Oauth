import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft, X } from "lucide-react";
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
  
  // In a real application, you would fetch suggested keywords from an API
  // This is a mock implementation
  // useEffect(() => {
  //   if (topic) {
  //     // Mock function to generate keywords based on topic
  //     const generateSuggestedKeywords = (topic: string): string[] => {
  //       const topicWords = topic.toLowerCase().split(/\s+/);
        
  //       const mockKeywordSets: Record<string, string[]> = {
  //         meditation: ["mindfulness", "relaxation", "stress relief", "mental clarity", "focus"],
  //         health: ["wellness", "nutrition", "exercise", "fitness", "self-care"],
  //         technology: ["innovation", "digital", "software", "gadgets", "AI"],
  //         business: ["entrepreneurship", "marketing", "strategy", "leadership", "startups"],
  //         travel: ["adventure", "destinations", "culture", "tourism", "exploration"]
  //       };
        
  //       let suggested: string[] = [];
        
  //       // Check if any topic word matches our mock data
  //       topicWords.forEach(word => {
  //         Object.keys(mockKeywordSets).forEach(key => {
  //           if (word.includes(key) || key.includes(word)) {
  //             suggested = [...suggested, ...mockKeywordSets[key]];
  //           }
  //         });
  //       });
        
  //       // If no specific matches, return general keywords
  //       if (suggested.length === 0) {
  //         suggested = ["essential", "important", "top", "key", "fundamental", "best practices"];
  //       }
        
  //       // Remove duplicates and return
  //       return Array.from(new Set(suggested));
  //     };
      
  //     setSuggestedKeywords(generateSuggestedKeywords(topic));
  //   }
  // }, [topic]);

  // const addKeyword = (keyword: string) => {
  //   keyword = keyword.trim();
  //   if (keyword && !primaryKeywords.includes(keyword)) {
  //     onKeywordsChange([...primaryKeywords, keyword]);
  //     setNewKeyword("");
  //   }
  // };

  // const removeKeyword = (keyword: string) => {
  //   onKeywordsChange(primaryKeywords.filter(k => k !== keyword));
  // };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newKeyword.trim()) {
      console.log("primary", newKeyword);
      onKeywordsChange(newKeyword.trim());
      onNext();
    }
  };

  useEffect(()=>{
    setNewKeyword(primaryKeywords);
  },[])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Search className="w-5 h-5 text-primary" />
          <h3 className="text-md font-medium">Select Primary Keywords</h3>
        </div>
        <p className="text-sm text-gray-500">
          Choose 3-5 primary keywords that will be the main focus of your blog.
        </p>
      </div>

      <div className="rounded-md bg-gray-50 p-3">
        <p className="text-sm font-medium">Topic: <span className="text-primary">{topic}</span></p>
      </div>

      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          placeholder="Enter a keyword"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          className="flex-1"
        />
        {/* <Button type="submit" variant="outline" size="sm" disabled={!newKeyword.trim()}>
          Add
        </Button> */}
      

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button type="submit" disabled={newKeyword.length === 0}>
          Next
        </Button>
      </div>
      </form>
    </div>
  );
};

export default StepPrimaryKeywords;
