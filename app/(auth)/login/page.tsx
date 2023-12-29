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
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const { data: response, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) {
        form.setError("password", {
          message: error.message, // You can customize this message
        });
      } else {
        router.push("/");
      }
    } catch (error) {}
    setLoading(false);
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col justify-center items-center h-full"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="sm:w-2/4 w-full space-y-2 flex flex-col justify-center items-stretch">
          <span className="font-bold text-xl text-center">
            Log in to your account
          </span>
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="password" type="password" />
                </FormControl>
                <FormMessage>{errorMessage}</FormMessage>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            Log In
          </Button>
          <div className="text-sm mt-2">
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-blue-500">
              Sign up here
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default Login;
