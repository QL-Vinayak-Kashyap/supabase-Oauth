import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';

type User = {
    id: number
    name: string
    email: number
  }

export const userApi =createApi({
    reducerPath:'userApi',
    baseQuery:fetchBaseQuery({baseUrl:"https://pokeapi.co/api/v2/"}),
    endpoints:(builder)=>({
        loginUser :builder.mutation<User[],string>({
            query: (data)=>({
                url:'/login',
                body:data,
                method:'POST'
            })
        })
    })
})

export const {} = userApi;