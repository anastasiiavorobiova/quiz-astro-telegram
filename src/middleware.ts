import { sequence } from "astro:middleware";
import { lucia } from "./features/auth";
import type { APIContext, MiddlewareNext } from "astro";

const publicOnly = ["/signup", "/login"];
const adminOnly = ["/dashboard"];
const userOnly = ["/quiz"];
const loginPage = "/login";

export async function getUser(
  context: APIContext,
  next: MiddlewareNext,
): Promise<Response> {
  try {
    const sessionId =
      context.cookies.get(lucia.sessionCookieName)?.value ?? null;

    if (!sessionId) {
      throw new Error("No session");
    }

    if (sessionId) {
      const { session, user } = await lucia.validateSession(sessionId);

      if (session && session.fresh) {
        const sessionCookie = lucia.createSessionCookie(session.id);

        context.cookies.set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }

      context.locals.session = session;
      context.locals.user = user;

      return next();
    }

    throw new Error("Session expired");
  } catch (_err) {
    const sessionCookie = lucia.createBlankSessionCookie();

    context.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    context.locals.user = null;
    context.locals.session = null;

    return next();
  }
}

async function authAdminRequired(
  context: APIContext,
  next: MiddlewareNext,
): Promise<Response> {
  const { pathname } = context.url;
  const isProtectedAdminRoute = adminOnly.includes(pathname);

  if (isProtectedAdminRoute) {
    const isAdmin = context.locals.user && context.locals.user.role === "admin";

    if (isAdmin) {
      return next();
    }

    return context.rewrite(loginPage);
  }

  return next();
}

async function authUserRequired(
  context: APIContext,
  next: MiddlewareNext,
): Promise<Response> {
  const { pathname } = context.url;
  const isProtectedUserRoute = userOnly.includes(pathname);

  if (isProtectedUserRoute) {
    const isUser = context.locals.user && context.locals.user.role === "user";

    if (isUser) {
      return next();
    }

    return context.rewrite(loginPage);
  }

  return next();
}

async function noAuthRequired(
  context: APIContext,
  next: MiddlewareNext,
): Promise<Response> {
  const { pathname } = context.url;
  const isPublicOnly = publicOnly.includes(pathname);
  const homePage = "/";

  if (isPublicOnly) {
    const isUser = context.locals.user;

    if (isUser) {
      return context.rewrite(homePage);
    }
  }

  return next();
}

export const onRequest = sequence(
  getUser,
  authAdminRequired,
  authUserRequired,
  noAuthRequired,
);
