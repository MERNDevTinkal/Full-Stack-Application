"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { verifySchema } from "@/schemas/verifySchema";
import axios, { AxiosError } from "axios";

const VerifyPage = ({ params }: { params: { username: string } }) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("verifyEmail");

    if (storedEmail) {
      setEmail(storedEmail);
      setIsLoading(false);
    } else {
      toast.error("No verification email found. Please sign up again.");
      router.replace("/signup");
    }
  }, [router]);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post("/api/verifyCode", {
        username: params.username,
        email,
        code: data.code,
      });

      toast.success(response.data.message);
      sessionStorage.removeItem("verifyEmail");
      router.replace("/signin");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data.message || "Verification failed.";
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-2xl font-bold text-center">Verify Your Account</h1>
        <p className="text-center text-sm text-muted-foreground">
          We've sent a 6 digit verification code to <strong>{email}</strong>
        </p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Input
            placeholder="Enter verification code"
            {...form.register("code")}
            className="border-2"
          />
          {form.formState.errors.code && (
            <p className="text-red-500 text-xs font-semibold mt-1">{form.formState.errors.code.message}</p>
          )}

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            Verify
          </Button>
        </form>
      </div>
    </div>
  );
};

export default VerifyPage;
