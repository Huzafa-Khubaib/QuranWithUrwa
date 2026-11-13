import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  DEMO_COOKIE,
  isDemoAuthEnabled,
  parseDemoCookie,
} from "@/lib/auth/demo";
import {
  ROLE_HOME,
  ROLE_LOGIN,
  isUserRole,
  loginRoleFromPathname,
  roleFromPathname,
  type UserRole,
} from "@/lib/auth/roles";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const pathname = request.nextUrl.pathname;
  const portalRole = roleFromPathname(pathname);
  const loginRole = loginRoleFromPathname(pathname);

  let profileRole: UserRole | null = null;

  if (isDemoAuthEnabled()) {
    const demo = parseDemoCookie(request.cookies.get(DEMO_COOKIE)?.value);
    if (demo) profileRole = demo.role;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && anonKey && !profileRole) {
    const supabase = createServerClient(url, anonKey, {
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

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (isUserRole(profile?.role)) {
        profileRole = profile.role;
      }
    }
  }

  if (portalRole) {
    if (!profileRole) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = ROLE_LOGIN[portalRole];
      redirectUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (profileRole !== portalRole) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = ROLE_HOME[profileRole];
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }

    return supabaseResponse;
  }

  if (loginRole && profileRole) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = ROLE_HOME[profileRole];
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
