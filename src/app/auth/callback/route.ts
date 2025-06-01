import { createClient } from "@/utils/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const action = requestUrl.searchParams.get("action")

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      if (action === "signin") {
        // Перевірка існування користувача
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          // Користувач існує, перенаправляємо на головну сторінку
          return NextResponse.redirect(`${requestUrl.origin}/`)
        } else {
          // Користувач не існує, перенаправляємо на сторінку реєстрації
          return NextResponse.redirect(`${requestUrl.origin}/signup?error=user_not_found`)
        }
      } else if (action === "signup") {
        // Для реєстрації просто перенаправляємо на головну сторінку
        return NextResponse.redirect(`${requestUrl.origin}/`)
      }
    }
  }

  // Якщо щось пішло не так, перенаправляємо на сторінку входу з помилкою
  return NextResponse.redirect(`${requestUrl.origin}/login?error=oauth_error`)
}