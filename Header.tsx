
'use client';

import { BrainCircuit } from 'lucide-react';
import Link from 'next/link';

export default function Header() {

  return (
    <header className="bg-background/70 backdrop-blur-md border-b border-border/50 shadow-lg shadow-primary/10 sticky top-0 z-50 print:hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/dashboard" className="flex items-center gap-2 text-primary transition-all duration-300 hover:text-primary/80 hover:drop-shadow-[0_0_8px_hsl(var(--primary))]">
            <BrainCircuit className="h-8 w-8" />
            <h1 className="text-2xl font-bold font-headline">ProductCraft</h1>
          </Link>
          <div className="flex items-center gap-4">
            {/* Auth-related buttons removed */}
          </div>
        </div>
      </div>
    </header>
  );
}
