import { createServerClient } from "@supabase/ssr";
import { NextRequest } from "next/server";

export async function getUserViaToken(req: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll() {
          // Middleware doesn't need to set cookies here — handled by updateSession
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return undefined;
  }

  // Return a shape compatible with UserProps used by middleware
  return {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.full_name || user.user_metadata?.name || null,
    image: user.user_metadata?.avatar_url || null,
    createdAt: new Date(user.created_at),
  };
}
