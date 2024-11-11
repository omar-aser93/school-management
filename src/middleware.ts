//using clerk auth, we go to the clerk dashboard => create app, We choose auth methods we want, then follow the steps  
//for middleware docs: https://clerk.com/docs/references/nextjs/clerk-middleware
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


//manually created object to store { route: [allowed roles] }, we will pass it to a function to protect routes
const routeAccessMap: { [key: string]: string[] } = {
  "/admin(.*)": ["admin"],
  "/student(.*)": ["student"],
  "/teacher(.*)": ["teacher"],
  "/parent(.*)": ["parent"],
  "/list/teachers": ["admin", "teacher"],
  "/list/students": ["admin", "teacher"],
  "/list/parents": ["admin", "teacher"],
  "/list/subjects": ["admin"],
  "/list/classes": ["admin", "teacher"],
  "/list/exams": ["admin", "teacher", "student", "parent"],
  "/list/assignments": ["admin", "teacher", "student", "parent"],
  "/list/results": ["admin", "teacher", "student", "parent"],
  "/list/attendance": ["admin", "teacher", "student", "parent"],
  "/list/events": ["admin", "teacher", "student", "parent"],
  "/list/announcements": ["admin", "teacher", "student", "parent"],
};


//create the matchers by mapping through the created object & pass values to createRouteMatcher(), but we wil use Object.keys().map() because it's an object not array
const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));


//clerkMiddleware is the function that protect the routes, by default it's empty (all routes are public) 
export default clerkMiddleware((auth, req) => {
  /* getting the session/token data to get the user role, but role is not in the token by default, we added it manually inside metadata (details in sign-in page)
   we go to : app clerk page => config => Sessions => Customize session token => then add ({"metadata":"{{user.public_metadata}}"}) */
  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  
  //loop through the matcher & if current user role is not inside allowedRoles[] then re-direct to user role_hompage
  for (const { matcher, allowedRoles } of matchers) {
    if (matcher(req) && !allowedRoles.includes(role!)) {
      return NextResponse.redirect(new URL(`/${role}`, req.url));
    }
  }
});


//Default config function, check the docs .
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};