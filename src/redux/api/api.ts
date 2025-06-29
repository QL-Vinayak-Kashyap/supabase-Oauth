import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface User {
  id: number;
  name: string;
  email: string;
}

interface TokenResponse {
  data: any;
  // token:string
}
interface TokenRequest {
  uuid: string;
}

export interface GenerateOutlineRequest {
  topic: string;
  token: string;
  main_keyword: string;
  secondary_keywords: string;
  tone: string;
}

export interface GenerateOutlineResponse {
  data: any;
  id: string;
  content: any;
  topic: string;
}

export interface GenerateBlogRequest {
  topic: string;
  word_count: string;
  token: string;
  main_keyword: string;
  secondary_keywords: string;
  tone: string;
  outline: string;
}

export interface GenerateBlogResponse {
  data: any;
  id: string;
  content: any;
  topic: string;
}

interface GenerateBlogWithFeedbackRequest {
  token: string;
  blog_content: string;
  feedback: string;
}

interface GenerateBlogWithFeedbackResponse {
  data: any;
  id: string;
  content: string;
  topic: string;
}
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }), // Change this to your actual API base URL
  endpoints: (builder) => ({
    loginUser: builder.mutation<User, User>({
      query: (data) => ({
        url: "users/login",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    createUser: builder.mutation<User, User>({
      query: (data) => ({
        url: "users/signup",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    resetPassword: builder.mutation<User, User>({
      query: (data) => ({
        url: "/reset-password",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    getToken: builder.query<TokenResponse, TokenRequest>({
      query: (data) => ({
        url: "/token",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Token: data?.uuid,
        },
      }),
    }),
    generateOutline: builder.query<
      GenerateOutlineResponse,
      GenerateOutlineRequest
    >({
      query: (data) => ({
        url: "/outline",
        method: "POST",
        body: {
          topic: data?.topic,
          tone: data?.tone,
          main_keyword: data?.main_keyword,
          secondary_keywords: data?.secondary_keywords,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data?.token}`,
        },
      }),
    }),
    generateBlog: builder.query<GenerateBlogResponse, GenerateBlogRequest>({
      query: (data) => ({
        url: "/blogs",
        method: "POST",
        body: {
          topic: data?.topic,
          tone: data?.tone,
          blog_outline: data?.outline,
          word_count: "" + data?.word_count,
          main_keyword: data?.main_keyword,
          secondary_keywords: data?.secondary_keywords,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data?.token}`,
        },
      }),
    }),
    generateBlogWithFeedback: builder.query<
      GenerateBlogWithFeedbackResponse,
      GenerateBlogWithFeedbackRequest
    >({
      query: (data) => ({
        url: "/feedbacks",
        method: "POST",
        body: { blog_content: data?.blog_content, feedback: data?.feedback },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data?.token}`,
        },
      }),
    }),
  }),
});

export const {
  useCreateUserMutation,
  useLoginUserMutation,
  useResetPasswordMutation,
  useGenerateOutlineQuery,
  useGenerateBlogQuery,
  useLazyGenerateOutlineQuery,
  useLazyGenerateBlogQuery,
  useGetTokenQuery,
  useGenerateBlogWithFeedbackQuery,
  useLazyGenerateBlogWithFeedbackQuery,
} = userApi;
