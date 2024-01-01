"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import supabase from "@/lib/db";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  username: z.string().min(4, {
    message: "Username must be at least 4 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  inGameName: z.string().refine((value) => !!value, {
    message: "required.",
  }),
  password: z.string(),
  confirmPassword: z
    .string()
    .superRefine(({ confirmPassword, password }: any, ctx) => {
      if (confirmPassword !== password) {
        ctx.addIssue({
          code: "custom",
          message: "The passwords did not match",
        });
      }
    }),
});

const SignUp = () => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      inGameName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const { data: response, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.confirmPassword,
        options: {
          emailRedirectTo: "https://rlscout.vercel.app/",
          data: {
            username: data.username,
            inGameName: data.inGameName,
            email: data.email,
          },
        },
      });
      window.alert("Check your email for the confirmation link!");
      router.push("/");

      if (error) {
        form.setError("password", {
          message: error.message,
        });
        return;
      }
    } catch (e) {}
    setLoading(false);
  };

  return (
    <Form {...form}>
      <form
        className=" flex flex-col justify-center items-center h-full"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="sm:w-2/4 w-full space-y-2 flex flex-col justify-center items-stretch">
          <span className="font-bold text-xl text-center">
            Sign up to create your account
          </span>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@doe.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="inGameName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>In-Game Name</FormLabel>
                <FormControl>
                  <Input placeholder="gamer.john" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="password" type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="confirm" type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading}>
            Sign Up
          </Button>
          <div className="text-sm mt-2">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500">
              Log in here
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default SignUp;
