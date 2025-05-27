import { Button } from "@/components/ui/button";
import { Volume2, ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StepToneProps {
  tone: string;
  onToneChange: (tone: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const toneOptions = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "friendly", label: "Friendly" },
  { value: "formal", label: "Formal" },
  { value: "conversational", label: "Conversational" },
  { value: "authoritative", label: "Authoritative" },
  { value: "humorous", label: "Humorous" },
  { value: "inspirational", label: "Inspirational" },
  { value: "educational", label: "Educational" },
  { value: "persuasive", label: "Persuasive" }
];

const StepTone = ({ tone, onToneChange, onNext, onBack }: StepToneProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Volume2 className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-medium">Select Content Tone</h3>
        </div>
        <p className="text-sm text-gray-500">
          Choose the tone that best fits your target audience and content style.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Tone</label>
          <Select value={tone} onValueChange={onToneChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a tone for your content" />
            </SelectTrigger>
            <SelectContent>
              {toneOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {tone && (
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm">
              <span className="font-medium">Selected tone:</span> {toneOptions.find(t => t.value === tone)?.label}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button onClick={onNext} disabled={!tone}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default StepTone;