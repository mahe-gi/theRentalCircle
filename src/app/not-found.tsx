import React from 'react';
import Link from 'next/link';
import { ArrowRight, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-app-canvas flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 text-midnight font-sans antialiased">
      <div className="max-w-md w-full text-center space-y-6 bg-white border border-border p-10 sm:p-12 rounded-[2px] shadow-sm">
        <span className="text-5xl font-black text-cobalt font-mono block">404</span>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-midnight tracking-tight">Page Not Found</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            The page or property listing you are looking for may have been moved, expired, or does not exist.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/homes"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[3px] bg-midnight px-5 py-3 text-xs font-bold tracking-wider uppercase text-white hover:bg-cobalt active:scale-[0.98] transition-all shadow-sm"
          >
            Browse Homes <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[3px] border border-border-strong bg-white px-5 py-3 text-xs font-bold tracking-wide text-midnight hover:border-midnight hover:bg-slate-50 transition-all"
          >
            <Home className="h-3.5 w-3.5" /> Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
