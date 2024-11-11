"use client";

//We will use the new @clerk/elements, to create a custom login page, there's a few examples, we choose 1 & edit it
//https://clerk.com/docs/customization/elements/overview
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginPage = () => {
  
  const { isLoaded, isSignedIn, user } = useUser();        //clerk useUser hook, returns all clerk_user's info
  const router = useRouter();                              //get router function, to redirect manually

  useEffect(() => {
    const role = user?.publicMetadata.role;    //get user role, at the beginning we added the role manually inside (clerk_user profile page => metadata => Public => { "role": "admin" })
    if (role) { router.push(`/${role}`) }      //check the user role, then redirect to his role route homepage
  }, [user, router]);

  return (    
    <div className="h-screen flex items-center justify-center bg-schoolSkyLight">
      {user ? <div> Loading ... </div> :
      <SignIn.Root>
        <SignIn.Step name="start" className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2" >

          <h1 className="text-xl font-bold flex items-center gap-2">
            <Image src="/logo.png" alt="" width={24} height={24} /> Omar School </h1>
          <h2 className="text-gray-400">Sign in to your account</h2>
          <Clerk.GlobalError className="text-sm text-red-400" />

          <Clerk.Field name="identifier" className="flex flex-col gap-2">
            <Clerk.Label className="text-xs text-gray-500"> Username </Clerk.Label>
            <Clerk.Input type="text" required className="p-2 rounded-md ring-1 ring-gray-300" />
            <Clerk.FieldError className="text-xs text-red-400" />
          </Clerk.Field>

          <Clerk.Field name="password" className="flex flex-col gap-2">
            <Clerk.Label className="text-xs text-gray-500"> Password </Clerk.Label>
            <Clerk.Input type="password" required className="p-2 rounded-md ring-1 ring-gray-300" />
            <Clerk.FieldError className="text-xs text-red-400" />
          </Clerk.Field>

          <SignIn.Action submit className="bg-blue-500 text-white my-1 rounded-md text-sm p-[10px]" >
            Sign In
          </SignIn.Action>
        </SignIn.Step>
      </SignIn.Root>   }
    </div> 
  );
};

export default LoginPage;