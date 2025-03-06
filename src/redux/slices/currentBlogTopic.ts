import { createSlice, PayloadAction } from "@reduxjs/toolkit"; 

interface content {
    blog:string,
    feedback:string
}

interface currentBlog {
blogToken:string,
topic:string,
wordsNumber:string,
content:content[],
}

const initialState:currentBlog = {
blogToken:'',
topic:'',
wordsNumber:'',
content:[],
}

// {blog:"",feedback:""}

const currentBlogSlice = createSlice({
    name:'currentBlogTopic',
    initialState,
    reducers:{
        setCurrentBlog:(state:any, action:PayloadAction<currentBlog>)=>{
        state.blogToken= action.payload.blogToken
        state.topic = action.payload.topic
        state.wordsNumber= action.payload.wordsNumber
        state.content = [...state.content, action.payload.content]
        },
        setBlogToken:(state,action:PayloadAction<{ blogToken: string }>)=>{
            state.blogToken = action.payload.blogToken
        },
        resetCurrentBlogTopic :()=>{
            return initialState;
        }
    }

})  

export const {setCurrentBlog, setBlogToken, resetCurrentBlogTopic} =currentBlogSlice.actions;
export default currentBlogSlice.reducer;