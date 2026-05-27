/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { auth } from "./lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  // Protect client routes
  const protectedRoutes = ["/dashboard", "/projects", "/inbox"];
  const isProtectedRoute = protectedRoutes.some((path) => 
    nextUrl.pathname.startsWith(path)
  );

  if (isProtectedRoute && !isLoggedIn) {
    // Redirect unauthenticated gateway requests back to portal login
    return Response.redirect(new URL("/login", nextUrl));
  }
});

// Configure matcher boundaries to allow asset resources to pass transparently
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico).*)"],
};
