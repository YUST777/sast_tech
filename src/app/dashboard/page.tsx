import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Download, Sparkles } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/register');
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-50 relative overflow-hidden">
      {/* Subtle gradient background effect from login screen */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-zinc-900 to-[#814eb6]/20 mix-blend-screen pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-50" />
      
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/5 border border-white/10 mb-8 shadow-2xl shadow-blue-500/20">
          <Sparkles className="h-10 w-10 text-[#814eb6]" />
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight text-white drop-shadow-sm">
          Congratulations! 🎉
        </h1>
        
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md mb-8 shadow-2xl">
          <p className="text-zinc-300 text-lg sm:text-xl leading-relaxed mb-4">
            Because you signed up before <span className="text-[#814eb6] font-semibold">March 29th</span>, you have been awarded 
            <span className="text-white font-bold px-2">50,000 Free Tokens!</span>
          </p>
          <p className="text-zinc-400 text-base">
            Your account is locked and loaded. Download Sast now to instantly integrate the power of autonomous security into your workflow.
          </p>
        </div>

        <Button
          asChild
          size="lg"
          className="h-14 px-8 bg-white text-zinc-950 hover:bg-zinc-200 rounded-full font-bold text-lg shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all duration-300 hover:-translate-y-1"
        >
          <Link href="/download">
            <Download className="mr-2 h-5 w-5" />
            Download the App
          </Link>
        </Button>
      </div>
    </div>
  );
}
