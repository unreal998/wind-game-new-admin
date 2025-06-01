import { Callout } from "../Callout"


export default function ErrorBlock({
  message
}: {
  message?: string
  className?: string
}) {
  if (!message || typeof message !== "string") return null
  return (
    <Callout title={message} variant="error" />
  )
}
