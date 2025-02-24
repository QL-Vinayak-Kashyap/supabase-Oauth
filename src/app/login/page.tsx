"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
 
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux"
import { setUser } from "@/redux/slices/currentUserSlice"
import Link from "next/link"
import { ArrowRight, Loader2 } from "lucide-react"
 
const formSchema = z.object({
    email: z.string().min(2).max(50),
    password:z.string().min(8).max(12)
})

export default function Login(){

  const dispatch =useDispatch();

  const router =useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: "",
          password:""
        },
      })
     
      // 2. Define a submit handler.
      function onSubmit(values: z.infer<typeof formSchema>) {
        if(values.email ==="vinayak@gmail.com" && values.password ==="12345678"){
          dispatch(setUser(values));
        }
        
        console.log(values);
        router.push("/dashboard");
      }

    const [isLoading, setLoading] = useState(false);

    useEffect(()=>{
        setLoading(false);
    },[])

    return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto w-full max-w-[400px] space-y-6 p-4">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
        </div>
        <Form {...form}>
       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
         <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between">
              <FormLabel>Password</FormLabel>
              <Link
                href="/forgot-password"
                className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                >
                Forgot password?
              </Link>
                </div>
              <FormControl>
                <Input placeholder="Password" {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Logging account..." : "Submit"}
          </Button>
      </form>
    </Form>
        <div className="text-center">
          <Link href="/signup" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
            Create new Account <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>  
      </div>
    </div>
    )
}