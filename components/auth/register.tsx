"use client";
import React, {EventHandler, useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
// import {zodResolver} from "@hookform/resolvers/zod";
// import {createUserSchema} from "@/lib/validations/auth";
// import {useForm} from "react-hook-form";
// import {toast} from "@/components/ui/use-toast";
import * as z from "zod";
import {useAuth} from "@/context/user-auth";
// import {PasswordInput} from "@/components/ui/password-input";
import {Icons} from "@/components/icons";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {PasswordInput} from "@/components/ui/password-input";
import {Logo} from "@/components/icons";
import Background from "../background";

const RegisterForm = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false);
  const {logInWithGoogle, setShowLoginModal} = useAuth()!;
  // type FormData = z.infer<typeof createUserSchema>;
  const router = useRouter();

  // const {
  //   register,
  //   handleSubmit,
  //   formState: {errors},
  //   setError,
  // } = useForm<FormData>({
  //   resolver: zodResolver(createUserSchema),
  // });

  async function googleSingIn(): Promise<void> {
    try {
      setIsGoogleLoading(true);
      const createAccountResult = await logInWithGoogle();
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
    } finally {
      setIsGoogleLoading(false);
      setShowLoginModal(false);
    }
  }

  return (
    <div className="h-fit w-full  md:w-fit p-6 overflow-hidden md:border md:border-border md:rounded-2xl shadow-xl z-20 blurBack items-center flex flex-col ">
      <div className="flex items-center">
        <Logo className="fill-primary h-6 md:h-6 mb-1" />
        <h1 className="text-3xl text-primary font-bold whitespace-nowrap  font1 ml-2">
          Whitespace Media
        </h1>
      </div>
      {/* <h1 className="text-2xl md:text-4xl font-semibold text-background dark font1 text-center mt-4">
        Login to access
      </h1> */}
      <Button
        onClick={googleSingIn}
        type="button"
        className="w-full bg-card hover:bg-opacity-60 text-primary  dark:border-none border mt-4"
        variant="outline"
      >
        {isGoogleLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className=" h-6 w-6 mr-2" />
        )}
        Log in with Google
      </Button>
      <Background />
    </div>
  );
};

export default RegisterForm;
