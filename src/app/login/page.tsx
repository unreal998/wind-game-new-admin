"use client"

import { Button } from "@/components/Button"
// import { Divider } from "@/components/Divider"
import ErrorBlock from "@/components/ui/error-block"
// import { useAuthStore } from "@/store/use-auth-store"
// import { RiGoogleFill } from "@remixicon/react"
import { FormField } from "@/components/FormField"
import { useLogin } from "./_hooks/use-login"

export default function LoginPage() {
  const { errors, form, isLoadingSubmit, submitHandler } = useLogin()
  // const { signInWithOauth, checkUserExistence } = useAuthStore()
  const {
    handleSubmit,
    formState: { isValid, isDirty },
  } = form
  // const [oauthError, setOauthError] = useState<string | null>(null)
  // const router = useRouter()

  // const handleOauthLogin = async (provider: "google") => {
  //   setOauthError(null)
  //   const result = await signInWithOauth({ provider })
  //   if (result.error) {
  //     setOauthError(t(result.error))
  //   } else if (result.url) {
  //     // Перевіряємо, чи існує користувач перед перенаправленням
  //     const { exists, error } = await checkUserExistence(form.getValues().email)
  //     if (error) {
  //       setOauthError(t(error))
  //     } else if (!exists) {
  //       setOauthError(t("user-not-found"))
  //     } else {
  //       window.location.href = result.url
  //     }
  //   }
  // }

  return (
    <div className="flex min-h-dvh items-center justify-center p-4 sm:p-6">
      <div className="flex w-full flex-col items-center sm:max-w-sm">
        {/* <div className="mb-8 flex w-full items-center justify-center">
          <LanguageSwitcher />
        </div> */}

        {/* <div className="mt-6 flex flex-col items-center">
          <h1 className="text-center text-lg font-semibold text-gray-900 dark:text-gray-50">
            {t("login.title")}
          </h1>
        </div> */}

        <div className="mt-10 w-full">
          {/* <div className="gap-2 sm:flex sm:flex-row sm:items-center">
            <Button
              variant="secondary"
              className="mt-2 w-full cursor-pointer sm:mt-0"
              onClick={() => handleOauthLogin("github")}
            >
              <div className="inline-flex items-center gap-2">
                <RiGithubFill className="size-5 shrink-0" aria-hidden="true" />
                GitHub
              </div>
            </Button>
            <Button
              variant="secondary"
              className="mt-2 w-full cursor-pointer sm:mt-0"
              onClick={() => handleOauthLogin("google")}
            >
              <div className="inline-flex items-center gap-2">
                <RiGoogleFill className="size-4" aria-hidden="true" />
                Google
              </div>
            </Button>
          </div>
          {oauthError && <ErrorBlock message={oauthError} />}
          <Divider className="my-6">{t("or")}</Divider> */}
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="flex w-full flex-col gap-y-6"
            autoComplete="off"
          >
            <div className="flex flex-col gap-y-4">
              <FormField
                name="email"
                label="email"
                type="email"
                placeholder="email"
                form={form}
                error={errors.email?.message}
              />
              <FormField
                name="password"
                label="password"
                type="password"
                placeholder="password"
                form={form}
                error={errors.password?.message}
              />
            </div>
            <Button
              type="submit"
              isLoading={isLoadingSubmit}
              disabled={isLoadingSubmit || !isValid || !isDirty}
              className="h-10 w-full"
            >
              {isLoadingSubmit ? "" : "Увійти"}
            </Button>

            <ErrorBlock
              message={
                errors.root?.apiError.message && errors.root.apiError.message
              }
            />
          </form>
        </div>
      </div>
    </div>
  )
}
