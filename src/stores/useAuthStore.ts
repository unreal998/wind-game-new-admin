import { getErrorMessage } from "@/helper/error.helper"
import { createClient } from "@/utils/supabase/client"
import { type Provider } from "@supabase/supabase-js"
import { create } from "zustand"

const client = createClient()

export type SignUpDto = {
  email: string;
  password: string;
  options?: {
    data?: {
      first_name?: string;
      last_name?: string;
      phone?: string;
    };
    emailRedirectTo?: string;
  }
}

type AuthAction = {
  resetPasswordAsync(email: string): Promise<{ error: string } | void>
  resetPasswordVerifyAsync(
    token: string,
    email: string,
  ): Promise<{ error: string } | void>
  loginAsync(opt: {
    email: string
    password: string
  }): Promise<{ error: string; isNeedConfirmEmail: boolean } | void>
  signUpAsync(opt: { 
    email: string; 
    password: string; 
    options?: {
      data?: {
        first_name?: string;
        last_name?: string;
        phone?: string;
      };
      emailRedirectTo?: string;
    }
  }): Promise<{ error: string } | void>
  signInWithOauth(opt: { provider: Provider }): Promise<{ error?: string; url?: string }>
  signUpWithOauth(opt: { provider: Provider }): Promise<{ error?: string; url?: string }>
  signUpVerifyAsync(opt: {
    email: string
    token: string
  }): Promise<{ error: string } | void>
  resendOtpAsync(opt: { email: string }): Promise<{ error: string } | void>
  checkUserExistence(email: string): Promise<{ exists: boolean; error?: string }>
  signOutAsync(scope?: 'local' | 'global' | 'others'): Promise<{ error: string } | void>
}

export const useAuthStore = create<AuthAction>()(() => ({
  async resetPasswordAsync(email) {
    try {
      const { error } = await client.auth.resetPasswordForEmail(email)

      if (error) throw new Error(error.message)
    } catch (error) {
      return { error: getErrorMessage(error as Error) }
    }
  },
  async resetPasswordVerifyAsync(token, email) {
    try {
      const { error } = await client.auth.verifyOtp({
        email,
        token,
        type: "recovery",
      })

      if (error) {
        // rate limit error
        if (error.status === 429) throw new Error("")
        throw new Error(error.message)
      }
    } catch (error) {
      return { error: getErrorMessage(error as Error) }
    }
  },
  async loginAsync(opt) {
    try {
      const { error } = await client.auth.signInWithPassword(opt)
      if (!error) return

      const isNeedConfirmEmail = error.message.toLowerCase() === "email not confirmed"

      throw new Error(
        isNeedConfirmEmail
          ? "NEED_CONFIRM_EMAIL"
          : error.status === 400
          ? "Не вірні дані авторизації: пароль або логін"
          : error.message,
      )
    } catch (error) {
      const message = getErrorMessage(error as Error)

      return {
        error: message,
        isNeedConfirmEmail: message === "NEED_CONFIRM_EMAIL",
      }
    }
  },
  async signUpAsync(opt) {
    try {
      const { data, error } = await client.auth.signUp({
        email: opt.email,
        password: opt.password,
        options: opt.options
      })
      if (!error) {
        // Currently the response of signUp returns a fake user object instead of an error.
        // For now we check the identities object which would be empty if a user already exits.
        const isEmailTaken = data.user?.identities?.length === 0
        if (isEmailTaken) throw new Error("Email already in use")
      } else {
        // rate limit error
        if (error.status === 429) throw new Error("")
        throw new Error(error.message)
      }
    } catch (error) {
      return { error: getErrorMessage(error as Error) }
    }
  },
  async signInWithOauth(opt: { provider: Provider }) {
    try {
      const { data, error } = await client.auth.signInWithOAuth({
        provider: opt.provider,
        options: { 
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?action=signin`,
        }
      })

      if (error) throw new Error(error.message)
      if (!data.url) throw new Error("No URL returned from OAuth provider")

      return { url: data.url }
    } catch (error) {
      return { error: getErrorMessage(error as Error) }
    }
  },
  async signUpWithOauth(opt) {
    try {
      const { data, error } = await client.auth.signInWithOAuth({
        provider: opt.provider,
        options: { 
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?action=signup`
        }
      })

      if (error) throw new Error(error.message)
      if (!data.url) throw new Error("No URL returned from OAuth provider")

      return { url: data.url }
    } catch (error) {
      return { error: getErrorMessage(error as Error) }
    }
  },
  async signUpVerifyAsync(opt) {
    try {
      const { error } = await client.auth.verifyOtp({ ...opt, type: "email" })
      if (!error) return

      // rate limit error
      if (error.status === 429) throw new Error("429rate limit error for sign up")
      throw new Error(error.message)
    } catch (error) {
      return { error: getErrorMessage(error as Error) }
    }
  },
  async resendOtpAsync(opt) {
    try {
      const { error } = await client.auth.resend({ type: "signup", ...opt })

      if (error) {
        // rate limit error
        if (error.status === 429) throw new Error("")
        throw new Error(error.message)
      }
    } catch (error) {
      return { error: getErrorMessage(error as Error) }
    }
  },
  async checkUserExistence(email: string) {
    try {
      const { data, error } = await client.from('profiles').select('id').eq('email', email).single()
      if (error) throw error
      return { exists: !!data }
    } catch (error) {
      return { exists: false, error: getErrorMessage(error as Error) }
    }
  },
  async signOutAsync(scope: 'local' | 'global' | 'others' = 'local') {
    try {
      const { error } = await client.auth.signOut({ scope })
      if (error) throw error
    } catch (error) {
      return { error: getErrorMessage(error as Error) }
    }
  },
}))
