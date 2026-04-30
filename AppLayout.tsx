
'use client';

export default function AppLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground print:hidden">
        © {new Date().getFullYear()} ProductCraft. All rights reserved.
      </footer>
    </div>
  );
}

import Header from './Header';
