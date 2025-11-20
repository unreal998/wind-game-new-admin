import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

// Разрешённые IP-адреса
const ALLOWED_IPS = [
  "::1", // localhost
  "5.45.79.91",
  "46.227.136.53",
  "185.213.234.87",
  "94.153.46.215"//my ip
];

export async function middleware(request: NextRequest) {
  // Извлекаем IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.ip ||
    "unknown";
  console.log("IP:", ip);
  // Проверяем доступ
  if (!ALLOWED_IPS.includes(ip)) {
    console.warn("⛔️ Access denied for IP:", ip);
    return new NextResponse("Access denied", { status: 403 });
  }

  // ✅ Если IP разрешён — продолжаем стандартную авторизацию Supabase
  return await updateSession(request);
}

// Фильтруем только нужные маршруты
export const config = {
  matcher: [
    "/((?!api|auth|callback|error|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
