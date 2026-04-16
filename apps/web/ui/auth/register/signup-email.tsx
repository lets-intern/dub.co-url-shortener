"use client";

import { createClient } from "@/lib/supabase/client";
import { PasswordRequirements } from "@/ui/shared/password-requirements";
import { Button, Input, useMediaQuery } from "@dub/ui";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

type SignUpProps = {
  email: string;
  password: string;
};

export const SignUpEmail = () => {
  const { isMobile } = useMediaQuery();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<SignUpProps>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = form;

  const onSubmit = useCallback(
    (e: FormEvent) => {
      const { email, password } = getValues();

      if (email && !password && !showPassword) {
        e.preventDefault();
        e.stopPropagation();
        setShowPassword(true);
        return;
      }

      handleSubmit(async (data) => {
        setLoading(true);
        try {
          const supabase = createClient();
          const { error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
              emailRedirectTo: `${window.location.origin}/api/auth/callback`,
            },
          });

          if (error) {
            toast.error(error.message);
            return;
          }

          toast.success(
            "Account created! Check your email to verify your account.",
          );
          router.push("/login");
        } catch {
          toast.error("An unexpected error occurred.");
        } finally {
          setLoading(false);
        }
      })(e);
    },
    [getValues, showPassword, handleSubmit, router],
  );

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-y-6">
        <label>
          <span className="text-content-emphasis mb-2 block text-sm font-medium leading-none">
            Email
          </span>
          <Input
            type="email"
            placeholder="panic@thedis.co"
            autoComplete="email"
            required
            autoFocus={!isMobile && !showPassword}
            {...register("email")}
            error={errors.email?.message}
          />
        </label>
        {showPassword && (
          <label>
            <span className="text-content-emphasis mb-2 block text-sm font-medium leading-none">
              Password
            </span>
            <Input
              type="password"
              required
              autoFocus={!isMobile}
              {...register("password")}
              error={errors.password?.message}
              minLength={8}
            />
            <FormProvider {...form}>
              <PasswordRequirements />
            </FormProvider>
          </label>
        )}
        <Button
          type="submit"
          text={loading ? "Submitting..." : "Sign Up"}
          disabled={loading}
          loading={loading}
        />
      </div>
    </form>
  );
};
