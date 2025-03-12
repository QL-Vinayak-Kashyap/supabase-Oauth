import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface Content {
  blog: string;
  feedback: string;
}
interface CurrentBlog {
  blogToken: string;
  topic: string;
  topic_id: string;
  wordsNumber: string;
  content: Content[] | Content;
}

const initialState: CurrentBlog = {
  blogToken: "",
  topic: "",
  topic_id: "",
  wordsNumber: "",
  content: [],
};

const currentBlogSlice = createSlice({
  name: "currentBlogTopic",
  initialState,
  reducers: {
    setCurrentBlog: (
      state: CurrentBlog,
      action: PayloadAction<CurrentBlog>
    ) => {
      state.blogToken = action.payload.blogToken;
      state.topic = action.payload.topic;
      state.wordsNumber = action.payload.wordsNumber;
      const existingContent = Array.isArray(state.content)
        ? state.content
        : [state.content];
      const newContent = Array.isArray(action.payload.content)
        ? action.payload.content
        : [action.payload.content];

      state.content = [...existingContent, ...newContent];
    },
    setBlogToken: (state, action: PayloadAction<{ blogToken: string }>) => {
      state.blogToken = action.payload.blogToken;
    },
    resetCurrentBlogTopic: () => initialState,
  },
});

export const { setCurrentBlog, setBlogToken, resetCurrentBlogTopic } =
  currentBlogSlice.actions;
export default currentBlogSlice.reducer;
