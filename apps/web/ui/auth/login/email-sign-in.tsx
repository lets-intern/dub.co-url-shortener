"use client";

import { createClient } from "@/lib/supabase/client";
import { Button, Input, useMediaQuery } from "@dub/ui";
import { cn } from "@dub/utils";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { LoginFormContext } from "./login-form";

export const EmailSignIn = ({ next }: { next?: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const finalNext = next ?? searchParams?.get("next");
  const { isMobile } = useMediaQuery();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    showPasswordField,
    setShowPasswordField,
    setClickedMethod,
    authMethod,
    setAuthMethod,
    clickedMethod,
    setLastUsedAuthMethod,
    setShowSSOOption,
  } = useContext(LoginFormContext);

  const supabase = createClient();

  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);

          try {
            // If password field is not shown yet, show it
            if (!showPasswordField && authMethod === "email") {
              setShowPasswordField(true);
              setLoading(false);
              return;
            }

            setClickedMethod("email");

            if (password) {
              // Sign in with email + password
              const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
              });

              if (error) {
                toast.error(error.message);
                setClickedMethod(undefined);
                setLoading(false);
                return;
              }

              setLastUsedAuthMethod("email");
              router.push(finalNext || "/workspaces");
              router.refresh();
            } else {
              // Sign in with magic link (OTP)
              const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                  emailRedirectTo: `${window.location.origin}/api/auth/callback${finalNext ? `?next=${encodeURIComponent(finalNext)}` : ""}`,
                },
              });

              if (error) {
                toast.error(error.message);
                setClickedMethod(undefined);
                setLoading(false);
                return;
              }

              setLastUsedAuthMethod("email");
              toast.success("Magic link sent — check your inbox!");
              setEmail("");
              setClickedMethod(undefined);
            }
          } catch {
            toast.error("An unexpected error occurred. Please try again.");
            setClickedMethod(undefined);
          } finally {
            setLoading(false);
          }
        }}
        className="flex flex-col gap-y-6"
      >
        {authMethod === "email" && (
          <label>
            <span className="text-content-emphasis mb-2 block text-sm font-medium leading-none">
              Email
            </span>
            <input
              id="email"
              name="email"
              autoFocus={!isMobile && !showPasswordField}
              type="email"
              placeholder="panic@thedis.co"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size={1}
              className={cn(
                "block w-full min-w-0 appearance-none rounded-md border border-neutral-300 px-3 py-2 placeholder-neutral-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm",
              )}
            />
          </label>
        )}

        {showPasswordField && (
          <label>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-content-emphasis block text-sm font-medium leading-none">
                Password
              </span>
              <Link
                href={`/forgot-password?email=${encodeURIComponent(email)}`}
                className="text-content-subtle hover:text-content-emphasis text-xs leading-none underline underline-offset-2 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              type="password"
              autoFocus={!isMobile}
              value={password}
              placeholder="Password (optional)"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        )}

        <Button
          text={`Log in with ${password ? "password" : "email"}`}
          {...(authMethod !== "email" && {
            type: "button",
            onClick: (e) => {
              e.preventDefault();
              setShowSSOOption(false);
              setAuthMethod("email");
            },
          })}
          loading={clickedMethod === "email" || loading}
          disabled={clickedMethod && clickedMethod !== "email"}
        />
      </form>
    </>
  );
};
