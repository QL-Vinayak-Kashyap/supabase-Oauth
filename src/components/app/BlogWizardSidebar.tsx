
import { useState } from "react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar";
import { 
  FilePen, 
  FileText, 
  Search, 
  PenSquare, 
  Send, 
  BookCheck,
  Volume2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import StepTopicInput from "@/components/app/Blog/StepTopicInput";
import StepPrimaryKeywords from "@/components/app/Blog//StepPrimaryKeyword";
import StepSecondaryKeywords from "@/components/app/Blog/StepSecondaryKeyword";
import StepOutline from "@/components/app/Blog/StepOutline";
import StepGenerate from "@/components/app/Blog/StepGenerate";
import StepTone from "./Blog/StepTone";

export type BlogWizardStep = 'topic' | 'primary' | 'secondary'|'tone'| 'outline' | 'generate';

interface BlogWizardSidebarProps {
  currentStep: BlogWizardStep;
  setCurrentStep: (step: BlogWizardStep) => void;
  blogData: BlogData;
  setBlogData: (data: BlogData) => void;
  onGenerateBlog: () => void;
}

export interface BlogData {
  topic: string;
  primaryKeywords: string;
  secondaryKeywords: string[];
  tone: string;
  outline: string;
  generatedBlog: string;
}

const steps: { id: BlogWizardStep; label: string; icon: React.ReactNode }[] = [
  { id: 'topic', label: 'Enter a Topic', icon: <FileText className="h-5 w-5" /> },
  { id: 'primary', label: 'Select Primary Keywords', icon: <Search className="h-5 w-5" /> },
  { id: 'secondary', label: 'Select Secondary Keywords', icon: <PenSquare className="h-5 w-5" /> },
  { id: 'tone', label: 'Select Tone', icon: <Volume2 className="h-5 w-5" /> },
  { id: 'outline', label: 'Finalize Outline', icon: <FilePen className="h-5 w-5" /> },
  { id: 'generate', label: 'Generate Blog', icon: <BookCheck className="h-5 w-5" /> },
];

export const BlogWizardSidebar = ({ 
  currentStep, 
  setCurrentStep, 
  blogData, 
  setBlogData,
  onGenerateBlog
}: BlogWizardSidebarProps) => {
  const isStepComplete = (step: BlogWizardStep): boolean => {
    switch (step) {
      case 'topic': return !!blogData.topic;
      case 'primary': return blogData.primaryKeywords.length > 0;
      case 'secondary': return blogData.secondaryKeywords.length > 0;
      case 'tone': return !!blogData.tone;
      case 'outline': return blogData.outline.length > 0;
      case 'generate': return !!blogData.generatedBlog;
      default: return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'topic':
        return (
          <StepTopicInput 
            topic={blogData.topic} 
            onTopicChange={(topic) => setBlogData({ ...blogData, topic })}
            onNext={() => setCurrentStep('primary')}
          />
        );
      case 'primary':
        return (
          <StepPrimaryKeywords 
            topic={blogData.topic}
            primaryKeywords={blogData.primaryKeywords}
            onKeywordsChange={(keywords) => setBlogData({ ...blogData, primaryKeywords: keywords })}
            onNext={() => setCurrentStep('secondary')}
            onBack={() => setCurrentStep('topic')}
          />
        );
      case 'secondary':
        return (
          <StepSecondaryKeywords 
            topic={blogData.topic}
            primaryKeywords={blogData.primaryKeywords}
            secondaryKeywords={blogData.secondaryKeywords}
            onKeywordsChange={(keywords) => setBlogData({ ...blogData, secondaryKeywords: keywords })}
            onNext={() => setCurrentStep('tone')}
            onBack={() => setCurrentStep('primary')}
          />
        );
    case 'tone':
            return (
              <StepTone
                tone={blogData.tone}
                onToneChange={(tone) => setBlogData({ ...blogData, tone })} 
                onNext={() => setCurrentStep('outline')}
                onBack={() => setCurrentStep('secondary')} />);
      case 'outline':
        return (
          <StepOutline 
            outline={blogData.outline}
            onOutlineChange={(outline) => setBlogData({ ...blogData, outline })}
            onNext={() => setCurrentStep('generate')}
            onBack={() => setCurrentStep('tone')}
          />
        );
      case 'generate':
        return (
          <StepGenerate 
            blogData={blogData}
            onGenerateBlog={onGenerateBlog}
            onBack={() => setCurrentStep('outline')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Sidebar variant="sidebar" className="border-r">
      <SidebarHeader className="p-4 border-b">
        <h2 className="text-lg font-semibold">Blog Wizard</h2>
        <p className="text-sm text-gray-500">Generate amazing blog posts with AI</p>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Blog Generation Steps</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="flex flex-col space-y-1 mt-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col">
                  <Button
                    variant={currentStep === step.id ? "default" : "ghost"}
                    className={cn(
                      "justify-start gap-2 px-3 py-2 h-auto text-sm",
                      currentStep === step.id ? "bg-primary text-primary-foreground" : "",
                      isStepComplete(step.id) && currentStep !== step.id ? "text-green-600" : ""
                    )}
                    onClick={() => {
                      // Only allow navigation to completed steps or the current step + 1
                      const currentIndex = steps.findIndex(s => s.id === currentStep);
                      const targetIndex = steps.findIndex(s => s.id === step.id);
                      
                      if (isStepComplete(step.id) || targetIndex <= currentIndex + 1) {
                        setCurrentStep(step.id);
                      }
                    }}
                    disabled={!isStepComplete(step.id) && steps.findIndex(s => s.id === step.id) > steps.findIndex(s => s.id === currentStep) + 1}
                  >
                    {step.icon}
                    <span>{step.label}</span>
                    {isStepComplete(step.id) && (
                      <div className="ml-auto text-green-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                      </div>
                    )}
                  </Button>
                  
                  {index < steps.length - 1 && (
                    <div className="ml-6 h-5 w-px bg-gray-200" />
                  )}
                </div>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel>Current Step</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="p-4">
              {renderStepContent()}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t p-4">
        <div className="text-xs text-gray-500">
          Blog Wizard AI - Create content faster
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default BlogWizardSidebar;