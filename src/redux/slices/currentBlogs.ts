import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CurrentBlogState{
    currentSelectedId:Number 
    generatedBlog: []
}

const initialState: CurrentBlogState = {
    currentSelectedId:0,
    generatedBlog:[]
  };
const currentBlogSlice = createSlice({
    name: 'currentBlog',
    initialState,
    reducers:{
        setCurrentSelectedId :(state:CurrentBlogState, action:PayloadAction<Partial<CurrentBlogState>>)=>{
            state.currentSelectedId = action.payload.currentSelectedId
        },
        setCurrentTopicBlogs :(state:CurrentBlogState, action:PayloadAction<Partial<CurrentBlogState>>) =>{
            state.generatedBlog = action.payload.generatedBlog
        }
    }
})

export const {setCurrentSelectedId,setCurrentTopicBlogs} = currentBlogSlice.actions;
export default currentBlogSlice.reducer;