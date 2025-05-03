'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter, useParams } from 'next/navigation';
import { resetSchema } from '@/schemas/resetSchema';
import { z } from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

type ResetFormData = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {

  const router = useRouter();
  const params = useParams();
  const token = params.token;
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });
 
  useEffect(() => {
    console.log("Token:", token);
    if (!token) {
      toast.error("Invalid or missing reset token.");
      router.push('/signin');
    }
  }, [token, router]);

  const onSubmit = async (data: ResetFormData) => {
    setLoading(true);
    try {
      // Sending reset request with token
      const res = await axios.post('/api/resetPassword', { ...data, token });
      console.log("Response from backend:", res.data); 

      toast.success(res.data.message);
      router.push('/signin');
    } catch (error: any) {
      // Error handling
      console.error("Error resetting password:", error);
      toast.error(error.response?.data?.message || 'Something went wrong');
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
        <h2 className="text-2xl font-bold text-center">Reset Password</h2>

        {/* Password Input */}
        <div className="relative">
          <Input
            {...register('newPassword')}
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter new password"
            disabled={loading}
          />
          <div
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 cursor-pointer"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
          {errors.newPassword && (
            <p className="text-sm text-red-500 mt-1">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm Password Input */}
        <div className="relative">
          <Input
            {...register('confirmPassword')}
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm new password"
            disabled={loading}
          />
          <div
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 cursor-pointer"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={loading || isSubmitting} className="w-full">
          {loading ? <Loader2 className="animate-spin" size={20} /> : 'Reset Password'}
        </Button>
      </form>
    </div>
  );
}
