import { useAuthStore } from "@/stores/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { type LoginSchema, loginSchema } from "../_schema";

export const useLogin = () => {
  const { loginAsync } = useAuthStore();
  const router = useRouter();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const submitHandler: SubmitHandler<LoginSchema> = async (data) => {
    const res = await loginAsync(data);

    if (res?.isNeedConfirmEmail) {
      router.push(`/signup-verify?mailto=${data.email}`);
    } else if (res?.error) {
      form.setError("root.apiError", { message: res.error });
    } else router.replace("/");
  };

  return {
    form,
    errors: form.formState.errors,
    isLoadingSubmit: form.formState.isSubmitting,
    submitHandler,
  };
};
