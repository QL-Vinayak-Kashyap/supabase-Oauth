import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CurrentUser {
    isLoggedIn:boolean,
    email:string,
    token:string,
    full_name:string,
    id:string
}

const initialState : CurrentUser ={
    isLoggedIn :false,
    email:'',
    token:'',
    full_name:'',
    id:''
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
            state.token = action.payload.token
            state.full_name=action.payload.full_name
            state.id=action.payload.id
        }
    }   
});

export const {getUser,setUser} = currentUserSlice.actions
export default currentUserSlice.reducer;
