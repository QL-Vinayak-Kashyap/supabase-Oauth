'use server'

import  createClient  from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const signInWith = provider => async () => {
  const supabase = await createClient()

  const auth_callback_url = `${process.env.NEXT_PUBLIC_ORIGIN}/auth/callback`

  console.log("auth_callback_url",auth_callback_url);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: auth_callback_url,
      queryParams: {
        prompt: "consent",
      },
    },
  })

  console.log("data",data)

  if (error) {
    console.log("error",error)
  }

  redirect(data.url)
}

const signinWithGoogle = signInWith('google')

const signOut = async () => {
  const supabase = await createClient()
  await supabase.auth.signOut()
}

export { signinWithGoogle, signOut }