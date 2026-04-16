"use client";

import { createClient } from "@/lib/supabase/client";
import { Button, Google } from "@dub/ui";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const SignUpOAuth = ({
  methods,
}: {
  methods: ("email" | "google" | "github")[];
}) => {
  const searchParams = useSearchParams();
  const next = searchParams?.get("next");
  const [clickedGoogle, setClickedGoogle] = useState(false);

  useEffect(() => {
    return () => {
      setClickedGoogle(false);
    };
  }, []);

  const supabase = createClient();

  return (
    <>
      {methods.includes("google") && (
        <Button
          variant="secondary"
          text="Continue with Google"
          onClick={async () => {
            setClickedGoogle(true);
            await supabase.auth.signInWithOAuth({
              provider: "google",
              options: {
                redirectTo: `${window.location.origin}/api/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ""}`,
              },
            });
          }}
          loading={clickedGoogle}
          icon={<Google className="h-4 w-4" />}
        />
      )}
    </>
  );
};
