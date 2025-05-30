// import  {BlogWizardStep}  from "@/lib/utils";
import { BlogData } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface BlogState {
  currentStep: string;
  blogData: BlogData;
  blogToken: string;
  topic_id: string;
}
// export interface CurrentBlog {
//   blogToken: string;
//   topic: string;
//   topic_id: string;
//   wordsNumber: string;
//   outline:string;
//   currentStep: string;
//   main_keyword: string;
//   secondary_keywords: string[];
//   tone:string;
// }

const initialState: BlogState = {
  currentStep: 'topic',
  blogData: {
    topic: '',
    primaryKeywords: "",
    secondaryKeywords: [],
    tone: "",
    outline: "",
    generatedBlog: ""
  },
  blogToken: "",
  topic_id: "",
};

const currentBlogSlice = createSlice({
  name: "currentBlogTopic",
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<string>) => {
      state.currentStep = action.payload;
    },
    updateBlogData: (state, action: PayloadAction<Partial<BlogData>>) => {
      state.blogData = { ...state.blogData, ...action.payload };
    },
    setBlogData: (state, action: PayloadAction<BlogData>) => {
      state.blogData = action.payload;
    },
    resetBlogState: (state) => {
      state.currentStep = 'topic';
      state.blogData = initialState.blogData;
    },
    setCurrentBlog: (
      state: BlogState,
      action: PayloadAction<BlogState>
    ) => {
      state.blogToken = action.payload.blogToken;
      state.blogData = {...state.blogData};
      state.currentStep;
      state.topic_id; 
    },
    setBlogToken: (state, action: PayloadAction<{ blogToken: string }>) => {
      state.blogToken = action.payload.blogToken;
      state.blogData = {...state.blogData};
      state.currentStep;
      state.topic_id;
    },
    resetCurrentBlogTopic: () => initialState,
  },
});

export const { setCurrentBlog, setBlogToken, resetCurrentBlogTopic ,setCurrentStep,updateBlogData,setBlogData, resetBlogState} =
  currentBlogSlice.actions;
export default currentBlogSlice.reducer;
