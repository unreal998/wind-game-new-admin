import { LocationType } from "@/types/location"
import axios from "axios"

export type TgMsgPayload = {
  msg: string
  lang: "ru" | "uk" | "en" | "all"
  country: LocationType | "all"
  delay: number
}

export async function sendTgMsg(tgMsgPayload: TgMsgPayload) {
  await axios.post(
    "https://6d6ed6665a16.ngrok-free.app/tgbot/send-msg",
    tgMsgPayload,
    {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    },
  )
  return
}
