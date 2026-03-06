import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = `https://${process.env.SUPABASE_PROJECT_ID}.supabase.co`;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Allow access to login page and auth callback
  if (
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/auth/callback"
  ) {
    return supabaseResponse;
  }

  // No user -> redirect to login
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Check superadmin status using the authenticated user's session
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_superadmin")
    .eq("email", user.email)
    .single();

  if (!profile?.is_superadmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("error", "unauthorized");
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
