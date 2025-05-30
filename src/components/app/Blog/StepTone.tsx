'use client'

import { Button } from "@/components/ui/button";
import { Volume2, ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { StepToneProps } from "@/types";
import { toneOptions } from "@/lib/utils";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useAppDispatch } from "@/hooks/hooks";
import { setCurrentStep } from "@/redux/slices/currentBlogTopic";


const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

const StepTone = ({ topic, primaryKeywords, secondaryKeywords, tone, onToneChange, onNext, onBack }: StepToneProps) => {

  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState(true);
  const dispatch = useAppDispatch()

  const handleRecaptchaOnChange = (value) => {
    setRecaptchaValue(value);
    setRecaptchaError(false);
  };

  const handleSubmit = () => {

    if (!recaptchaValue) {
      setRecaptchaError(true);
      return;
    }
    setRecaptchaError(false);
    dispatch(setCurrentStep("outline"));
    onNext()
  };
  return (
    <div className="space-y-6">
      <div className="rounded-md bg-gray-50 p-3 space-y-2">
        <p className="text-sm font-medium">Topic: <span className="text-primary">{topic}</span></p>
        <div>
          <p className="text-sm font-medium">Primary Keywords:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            <Badge variant="default" className="text-xs">{primaryKeywords}
            </Badge>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium">Secondary Keywords:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {secondaryKeywords?.map((item,index)=>
                <Badge key={index} variant="secondary" className="text-xs">{item}
              </Badge>
            )
            }
          </div>
        </div>
      </div>

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

      <div className="flex flex-col gap-4">
        <ReCAPTCHA
          sitekey={RECAPTCHA_SITE_KEY}
          onChange={handleRecaptchaOnChange}
          theme="light"
          className="transform scale-[0.95] -ml-3"
        />
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={recaptchaError || !tone }>
          Next
        </Button>
      </div>
    </div>
  );
};

export default StepTone;