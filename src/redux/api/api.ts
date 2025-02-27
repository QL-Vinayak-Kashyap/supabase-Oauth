import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type User = {
    id: number;
    name: string;
    email: string;
};

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://realtors-mounted-to-boss.trycloudflare.com/v1/' }), // Change this to your actual API base URL
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
        })
    }),
});

export const { useCreateUserMutation, useLoginUserMutation, useResetPasswordMutation } = userApi;
