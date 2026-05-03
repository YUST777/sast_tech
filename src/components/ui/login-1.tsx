"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Github, Chrome } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function LoginScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleOAuth = async (provider: 'github' | 'google') => {
    setFormError(null);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setPending(true);
    const supabase = createClient();

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      setPending(false);
      if (error) {
        setFormError(error.message);
        return;
      }
      await router.refresh();
      router.replace('/download');
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setPending(false);
    if (error) {
      setFormError(error.message);
      return;
    }
    setFormError(null);
    setFormData({ email: '', password: '' });
    alert('Check your email to confirm your account, then sign in.');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: '', password: '' });
    setShowPassword(false);
    setFormError(null);
  };

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row bg-zinc-950 text-zinc-50">
      {/* Left side - Hero section (Top on mobile) */}
      <div className="flex w-full lg:flex-1 bg-zinc-900 relative items-center justify-center p-8 sm:p-12 lg:p-12 overflow-hidden border-b lg:border-b-0 lg:border-r border-zinc-800 min-h-[30vh] lg:min-h-screen">
        {/* Subtle gradient background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-zinc-900 to-emerald-600/10 mix-blend-screen pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-50" />
        
        <div className="text-white max-w-lg relative z-10 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 lg:mb-6 leading-tight tracking-tight text-white">
            Coded fast secured faster
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg max-w-md mx-auto lg:mx-0">
            Code is generated instantly. Security is stuck in manual.
          </p>
        </div>
      </div>

      {/* Right side - Login/Signup form (Bottom on mobile) */}
      <div className="flex-1 flex w-full items-center justify-center p-6 sm:p-8 lg:p-12 relative">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
              {isLogin ? 'Welcome Back' : 'Join Us Today'}
            </h2>
            <p className="text-zinc-400 text-sm">
              {isLogin 
                ? 'Welcome back to sast.tech — Continue your journey' 
                : 'Welcome to sast.tech — Start your journey'
              }
            </p>
          </div>

          {formError ? (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-center text-sm text-red-400" role="alert">
              {formError}
            </p>
          ) : null}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">
                Your email
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-700 h-11"
                placeholder="Enter your email"
                required
                disabled={pending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300">
                {isLogin ? 'Password' : 'Create new password'}
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-700 h-11 pr-11"
                  placeholder={isLogin ? "Enter your password" : "Create a secure password"}
                  required
                  disabled={pending}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-zinc-300 focus:outline-none transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" className="border-zinc-700 data-[state=checked]:bg-zinc-100 data-[state=checked]:text-zinc-900" />
                  <Label htmlFor="remember" className="text-sm font-medium leading-none text-zinc-400 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <button type="button" className="text-sm text-zinc-400 hover:text-white font-medium transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              disabled={pending}
              className="w-full h-11 bg-white text-zinc-950 hover:bg-zinc-200 shadow-none font-medium text-[15px] mt-2"
            >
              {pending ? 'Please wait…' : isLogin ? 'Sign In' : 'Create a new account'}
            </Button>

            <div className="text-center pt-2">
              <span className="text-zinc-500 text-sm">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </span>{' '}
              <button
                type="button"
                onClick={toggleMode}
                className="text-white hover:text-zinc-300 font-medium text-sm transition-colors"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-8 mb-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="px-2 bg-zinc-950 text-zinc-500">Or continue with</span>
            </div>
          </div>

          {/* Social login buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              type="button"
              disabled={pending}
              onClick={() => handleOAuth('google')}
              className="h-11 bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <Chrome className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button
              variant="outline"
              type="button"
              disabled={pending}
              onClick={() => handleOAuth('github')}
              className="h-11 bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
