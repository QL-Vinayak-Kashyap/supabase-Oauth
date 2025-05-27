import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PenSquare, ArrowLeft, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface StepSecondaryKeywordsProps {
  topic: string;
  primaryKeywords: string;
  secondaryKeywords: string[];
  onKeywordsChange: (keywords: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepSecondaryKeywords = ({ 
  topic, 
  primaryKeywords,
  secondaryKeywords, 
  onKeywordsChange, 
  onNext, 
  onBack 
}: StepSecondaryKeywordsProps) => {
  const [newKeyword, setNewKeyword] = useState("");
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([]);
  
  // In a real application, you would fetch suggested secondary keywords
  // This is a mock implementation
  useEffect(() => {
    // if (primaryKeywords.length > 0) {
    //   // Mock function to generate secondary keywords based on primary keywords
    //   const generateSuggestedKeywords = (primaryKeywords: string[]): string[] => {
    //     // Map of related terms for common keywords
    //     const relatedTermsMap: Record<string, string[]> = {
    //       mindfulness: ["present moment", "awareness", "meditation practice", "breathing", "mindful living"],
    //       relaxation: ["stress reduction", "calm", "peace", "tranquility", "rest"],
    //       wellness: ["holistic health", "well-being", "healthy lifestyle", "balance", "vitality"],
    //       nutrition: ["healthy eating", "diet", "superfoods", "meal planning", "vitamins"],
    //       "stress relief": ["anxiety management", "coping strategies", "relaxation techniques", "mental health", "burnout prevention"],
    //       fitness: ["exercise routine", "strength training", "cardio", "workout plan", "active lifestyle"],
    //       entrepreneurship: ["startups", "business ownership", "innovation", "risk-taking", "business growth"]
    //     };
        
    //     // Create a set to avoid duplicates
    //     const suggestedSet = new Set<string>();
        
    //     // For each primary keyword, add related terms
    //     primaryKeywords.forEach(keyword => {
    //       const keywordLower = keyword.toLowerCase();
          
    //       // Check exact matches
    //       if (relatedTermsMap[keywordLower]) {
    //         relatedTermsMap[keywordLower].forEach(term => suggestedSet.add(term));
    //       } else {
    //         // Check partial matches
    //         Object.keys(relatedTermsMap).forEach(key => {
    //           if (keywordLower.includes(key) || key.includes(keywordLower)) {
    //             relatedTermsMap[key].forEach(term => suggestedSet.add(term));
    //           }
    //         });
    //       }
    //     });
        
    //     // If no suggestions found, add generic secondary keywords
    //     if (suggestedSet.size === 0) {
    //       ["benefits", "strategies", "examples", "case studies", "research", "statistics", 
    //        "best practices", "tools", "techniques", "methods", "resources", "applications"].forEach(term => {
    //         suggestedSet.add(term);
    //       });
    //     }
        
    //     return Array.from(suggestedSet);
    //   };
      
    //   setSuggestedKeywords(generateSuggestedKeywords(primaryKeywords));
    // }
  }, [primaryKeywords]);

  const addKeyword = (keyword: string) => {
    keyword = keyword.trim();
    if (keyword && !secondaryKeywords.includes(keyword) && !primaryKeywords.includes(keyword)) {
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
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <PenSquare className="w-5 h-5 text-primary" />
          <h3 className="text-md font-medium">Select Secondary Keywords</h3>
        </div>
        <p className="text-sm text-gray-500">
          Choose 5-10 secondary keywords to support your primary keywords.
        </p>
      </div>

      {/* <div className="rounded-md bg-gray-50 p-3 space-y-2">
        <p className="text-sm font-medium">Topic: <span className="text-primary">{topic}</span></p>
        <div>
          <p className="text-sm font-medium">Primary Keywords:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {primaryKeywords.map((keyword, index) => (
              <Badge key={index} variant="default" className="text-xs">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      </div> */}

      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          placeholder="Enter a secondary keyword"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" variant="outline" size="sm" disabled={!newKeyword.trim()}>
          Add
        </Button>
      </form>

      <div>
        <p className="text-sm font-medium mb-2">Your secondary keywords:</p>
        {secondaryKeywords.length > 0 ? (
          <div className="flex flex-wrap gap-2">
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
          <p className="text-sm text-gray-500 italic">No secondary keywords selected yet</p>
        )}
      </div>

      {/* {suggestedKeywords.length > 0 && (
        <>
          <Separator />
          <div>
            <p className="text-sm font-medium mb-2">Suggested secondary keywords:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedKeywords.map((keyword, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-secondary"
                  onClick={() => addKeyword(keyword)}
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )} */}

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button onClick={onNext} disabled={secondaryKeywords.length === 0}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default StepSecondaryKeywords;
