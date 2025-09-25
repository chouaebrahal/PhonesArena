'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@/lib/auth';
import { z } from 'zod';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

// Infer type from Zod schema
type TLoginSchema = z.infer<typeof LoginSchema>;

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TLoginSchema>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: TLoginSchema) => {
    // TODO: Handle actual API submission
    console.log('Login data submitted:', data);
    return new Promise((resolve) => setTimeout(resolve, 1500));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="email"
            id="email"
            {...register('email')}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter your email"
          />
        </div>
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            {...register('password')}
            className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter your password"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input type="checkbox" {...register('rememberMe')} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
          <span className="ml-2 text-sm text-gray-600">Remember me</span>
        </label>
        <button type="button" className="text-sm text-blue-600 hover:text-blue-500 font-medium">Forgot password?</button>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
            Signing in...
          </span>
        ) : (
          'Sign In'
        )}
      </button>
    </form>
  );
};
