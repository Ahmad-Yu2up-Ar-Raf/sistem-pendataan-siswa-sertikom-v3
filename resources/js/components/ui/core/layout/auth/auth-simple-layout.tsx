"use client";

import { Link } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { useLottie } from "lottie-react";
import * as React from "react";
import { Package } from "lucide-react";
import MediaItem from "@/components/ui/fragments/custom-ui/media/MediaItem";
import AppLogo from "../app/fragments/app-logo";
 
 
type AuthLayoutProps = {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  quote?: string;
  loading?: boolean;
  className?: string;
  numberOfIterations?: number;
  formType?: "login" | "register";
};

const AuthLayoutTemplate = ({
  formType,
  numberOfIterations,
  className,
  loading = false,
  title = `Selamat Datang`,
  quote = `Gagasmu bukan cuma wacana — jadikan aksi.`,
  description = `Perjalanan akan segera dimulai `,
  ...props
}: AuthLayoutProps) => {
 
 
 
  return (
    <>
   
         <div className="grid min-h-svh    ">
            <div className="flex bg-background flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2  ">
          <div  className="flex   cursor-none items-center gap-2 font-medium">
          <AppLogo/>
             
          </div>
        </div>
         <div className="flex flex-1 items-center justify-center ">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-[21rem] lg:max-w-[22rem] ">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
            { formType == 'register' ? 'Signup' : 'Welcome' }   
            </h1>
            <p className="text-sm text-muted-foreground">
                   { formType == 'register' ? ' Enter your email below to create your account' : ' Enter your email below to signin your account' }   
            </p>
          </div>
         {props.children}
         {formType && ( 
          <div className="px-8 sr-only text-center text-sm text-muted-foreground">
          { formType !== 'register' && "Don't" } have an account?
      <Link   
  aria-disabled={loading} 
  tabIndex={loading ? -1 : undefined}  href={ formType == 'register' ? "/login" : "/register"} className={cn("   underline text-foreground underline-offset-4" , 
    loading ? 'pointer-events-none cursor-none text-foreground/50' : ''
  )}>
      { formType == 'register' ? ' Login' : ' Signup' }
      </Link>
          </div>
         )         }

        </div>
      </div>
                
            </div>
               
        </div>
    
    </>
  );
};




export default AuthLayoutTemplate;