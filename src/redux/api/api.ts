import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type User = {
    id: number;
    name: string;
    email: string;
};

type Token = {
    token:string
}
interface GenerateBlogRequest {
    topic: string;
    word_count: number;
    token: string;
  }
  
  interface GenerateBlogResponse {
    id: string;
    content: string;
    topic: string;
  }

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://api-qlwritter.qkkalabs.com/' }), // Change this to your actual API base URL
    endpoints: (builder) => ({
        loginUser: builder.mutation<User,any>({
            query: (data) => ({
                url: 'users/login',
                method: 'POST',
                body: data,
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        }),
        createUser: builder.mutation<User, any>({
            query: (data) => ({
                url: 'users/signup',
                method: 'POST',
                body: data,
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        }),
        resetPassword: builder.mutation<User,any>({
            query:(data)=>({
                url:'/reset-password',
                method:'POST',
                body:data,
                headers:{
                    'Content-Type':'application/json',
                }
            })
        }),
        getToken :builder.query<Token,any>({
            query:(data)=>({
                url:'/token',
                method:'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Token': data.uuid
                },
            })
        }),
        generateBlog: builder.query<GenerateBlogResponse, GenerateBlogRequest>({
            query: (data) => ({
              url: "/blogs",
              method: "POST",
              body: { topic: data.topic, word_count: data.word_count },
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${data.token}`,
              },
            }),
        }),
        generateBlogWithFeedback: builder.query<>({
            query:(data)=>({
                url:'/feedbacks',
                method:'POST',
                body:{"blog_content":data.blog_content,"feedback": data.feedback},
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.token}`
                },
            })
        })
    }),
});

export const { useCreateUserMutation, useLoginUserMutation, useResetPasswordMutation, useGenerateBlogQuery, useGetTokenQuery, useGenerateBlogWithFeedbackQuery } = userApi;
