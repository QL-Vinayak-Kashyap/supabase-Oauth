

export interface BlogData {
    topic: string;
    primaryKeywords: string;
    secondaryKeywords: string[];
    tone: string;
    outline: string;
    generatedBlog: any;
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
    onBack:()=> void;
    onNext: () => void;
  }
  export interface generatedBlogTypes {
    id: Number
    content: string
    meta_description:string
    banner_description:string
    feedback:string
    created_at:string
    topic_id: string
}