"use client";
import React, { useState } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { signInSchema } from "@/schemas/signInSchema";
import { Eye, EyeOff } from "lucide-react";

const SignInPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Logging in...");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (result?.error) {
        toast.error(result.error, { id: toastId });
      } else if (result?.url) {
        toast.success("Logged in successfully!", { id: toastId });
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...form}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">Sign In</h2>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email or Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter your email or username"
                      {...field}
                      className="focus:ring-blue-500"
                    />
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
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                        className="pr-10 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-right">
              <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                Forgot Password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm">
              Don't have an account?{" "}
              <a href="/signup" className="underline text-blue-600 hover:text-blue-800">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default SignInPage;
