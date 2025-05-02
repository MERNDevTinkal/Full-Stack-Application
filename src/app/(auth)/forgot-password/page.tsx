'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import axios from 'axios';
import { emailValidation } from '@/schemas/signUpSchema';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const forgotPasswordSchema = z.object({
    email: emailValidation,
  });

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const { register, handleSubmit, formState: { errors } } = form;

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    try {
      setLoading(true);
      const res = await axios.post('/api/forgotPassword', data);
      toast.success(res.data.message || 'Reset link sent to your email.');
      router.push("/resetPassword");
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-sm w-full space-y-4 bg-white p-6 shadow-md rounded"
      >
        <h2 className="text-2xl font-bold text-center">Forgot Password</h2>

        <div>
          <Input
            {...register('email')}
            placeholder="Enter your email"
            type="email"
            disabled={loading}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Button>

        <div className="text-center mt-4">
          <Button
            onClick={() => router.push('/signin')}
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            Back to Sign In
          </Button>
        </div>
      </form>
    </div>
  );
}
