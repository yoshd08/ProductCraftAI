
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BrainCircuit, Loader2 } from 'lucide-react';

export default function LandingPage() {
    const router = useRouter();

    useEffect(() => {
        router.push('/dashboard');
    }, [router]);

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-background text-foreground overflow-hidden">
            <div className="absolute inset-0 z-0 aurora-bg"></div>
            <div className="relative z-10 text-center space-y-6 max-w-3xl mx-auto px-4">
                <div className="flex justify-center items-center gap-4 text-primary">
                    <BrainCircuit className="h-16 w-16 text-glow" />
                    <h1 className="text-5xl md:text-6xl font-black font-headline tracking-tighter text-glow">ProductCraft</h1>
                </div>
                <div className='flex items-center justify-center gap-2 text-lg'>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <p>Redirecting to dashboard...</p>
                </div>
            </div>
             <footer className="relative z-10 py-6 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} ProductCraft. All rights reserved.
            </footer>
        </div>
    );
}
