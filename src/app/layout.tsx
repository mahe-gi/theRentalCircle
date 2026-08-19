import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'The Rental Circle | Human-Reviewed Residential Rentals in Hyderabad',
  description: 'A clearer way to find your next home in Hyderabad. Browse human-reviewed rental listings, send structured requests, and connect directly upon acceptance without telemarketing calls.',
  metadataBase: new URL('https://therentalcircle.in'),
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans bg-app-canvas text-midnight selection:bg-cobalt selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}