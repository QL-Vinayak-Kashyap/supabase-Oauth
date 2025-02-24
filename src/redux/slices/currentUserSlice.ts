import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CurrentUser {
    isLoggedIn:boolean,
    email:string,
    password:string
}

const initialState : CurrentUser ={
    isLoggedIn :false,
    email:'',
    password:''
}

const currentUserSlice =createSlice({
    name:"currentUserSlice",
    initialState,
    reducers:{
        getUser :(state)=>{
            return state;
        },
        setUser:(state,action:PayloadAction<CurrentUser>)=>{
            state.isLoggedIn = true
            state.email = action.payload.email
            state.password = action.payload.password
        }
    }   
}); 

export const {getUser,setUser} = currentUserSlice.actions
export default currentUserSlice.reducer;