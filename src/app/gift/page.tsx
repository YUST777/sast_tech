"use client";

import React from "react";
import RuixenMoonChat from "@/components/ui/ruixen-moon-chat";

export default function GiftPage() {
  return (
    <main className="min-h-screen w-full bg-black text-white">
      <section className="flex justify-center items-start w-full">
        <RuixenMoonChat />
      </section>
      <footer className="text-center text-neutral-500 py-2 mt-10 border-t border-neutral-800 text-sm">
        © {new Date().getFullYear()} sast. All rights reserved.
      </footer>
    </main>
  );
}
