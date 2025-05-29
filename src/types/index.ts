export interface BlogData {
    topic: string;
    primaryKeywords: string;
    secondaryKeywords: string[];
    tone: string;
    outline: string;
    generatedBlog: string;
  }
  
 export type BlogWizardStep = 'topic' | 'primary' | 'secondary'|'tone'| 'outline' | 'generate';

  export interface StepGenerateProps {
    blogData?: BlogData;
    onGenerateBlog?: () => void;
    onBack: () => void;
  }

  export interface StepOutlineProps {
    blogData?: BlogData;
    outline: string;
    onOutlineChange: (outline: string) => void;
    onNext: () => void;
    onBack: () => void;
  }

  export interface StepPrimaryKeywordsProps {
    topic: string;
    primaryKeywords: string;
    onKeywordsChange: (keywords: string) => void;
    onNext: () => void;
    onBack: () => void;
  }

  export interface StepSecondaryKeywordsProps {
    topic: string;
    primaryKeywords: string;
    secondaryKeywords: string[];
    onKeywordsChange: (keywords: string[]) => void;
    onNext: () => void;
    onBack: () => void;
  }

  export interface StepToneProps {
    topic:string;
    primaryKeywords:string;
    secondaryKeywords:string[];
    tone: string;
    onToneChange: (tone: string) => void;
    onNext: () => void;
    onBack: () => void;
  }

  export interface StepTopicInputProps {
    topic: string;
    onTopicChange: (topic: string) => void;
    onNext: () => void;
  }