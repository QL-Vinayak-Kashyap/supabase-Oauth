import { createSlice, PayloadAction } from "@reduxjs/toolkit"; 

interface content {
    blog:string,
    feedback:string
}

interface currentBlog {
blogToken:string,
topic:string,
topic_id:string,
wordsNumber:string,
content:content[],
}

const initialState:currentBlog = {
blogToken:'',
topic:'',
topic_id:"",
wordsNumber:'',
content:[],
}


const currentBlogSlice = createSlice({
    name:'currentBlogTopic',
    initialState,
    reducers:{
        setCurrentBlog:(state:any, action:PayloadAction<currentBlog>)=>{
        state.blogToken= action.payload.blogToken
        state.topic = action.payload.topic
        // state.topic_id = action.payload.topic_id
        state.wordsNumber= action.payload.wordsNumber
        state.content = [...state.content, action.payload.content]
        },
        setBlogToken:(state,action:PayloadAction<{ blogToken: string }>)=>{
            state.blogToken = action.payload.blogToken
        },
        resetCurrentBlogTopic :()=> initialState
    }

})  

export const {setCurrentBlog, setBlogToken, resetCurrentBlogTopic} =currentBlogSlice.actions;
export default currentBlogSlice.reducer;