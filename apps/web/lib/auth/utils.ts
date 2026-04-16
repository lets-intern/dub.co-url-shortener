import { prisma } from "@dub/prisma";
import { NextRequest } from "next/server";
import { DubApiError } from "../api/errors";
import { createClient } from "../supabase/server";

export interface Session {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
    isMachine: boolean;
    defaultWorkspace?: string;
    defaultPartnerId?: string;
  };
}

export const getSession = async (): Promise<Session | null> => {
  const supabase = await createClient();
  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser();

  if (!supabaseUser?.email) {
    return null;
  }

  let user = await prisma.user.findUnique({
    where: { email: supabaseUser.email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      isMachine: true,
      defaultWorkspace: true,
      defaultPartnerId: true,
    },
  });

  // Auto-create Prisma user if they signed up via Supabase Auth
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: supabaseUser.email,
        name:
          supabaseUser.user_metadata?.full_name ||
          supabaseUser.user_metadata?.name ||
          null,
        image: supabaseUser.user_metadata?.avatar_url || null,
        emailVerified: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        isMachine: true,
        defaultWorkspace: true,
        defaultPartnerId: true,
      },
    });
  }

  return {
    user: {
      id: user.id,
      name: user.name || "",
      email: user.email || "",
      image: user.image || undefined,
      isMachine: user.isMachine,
      defaultWorkspace: user.defaultWorkspace || undefined,
      defaultPartnerId: user.defaultPartnerId || undefined,
    },
  };
};

export const getAuthTokenOrThrow = (
  req: Request | NextRequest,
  type: "Bearer" | "Basic" = "Bearer",
) => {
  const authorizationHeader = req.headers.get("Authorization");

  if (!authorizationHeader) {
    throw new DubApiError({
      code: "bad_request",
      message:
        "Misconfigured authorization header. Did you forget to add 'Bearer '? Learn more: https://d.to/auth",
    });
  }

  return authorizationHeader.replace(`${type} `, "");
};
