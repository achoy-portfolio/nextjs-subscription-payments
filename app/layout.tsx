// Import necessary dependencies and components
import { Metadata } from 'next';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import { Toaster } from '@/components/ui/Toasts/toaster';
import { PropsWithChildren, Suspense } from 'react';
import { getURL } from '@/utils/helpers';
import 'styles/main.css';

// Define website metadata
const title = 'Next.js Subscription Starter';
const description = 'Brought to you by Vercel, Stripe, and Supabase.';

// Configure metadata for SEO and social sharing
export const metadata: Metadata = {
  metadataBase: new URL(getURL()), // Set base URL for metadata
  title: title,
  description: description,
  openGraph: {
    // Social media preview metadata
    title: title,
    description: description
  }
};

// Root layout component that wraps all pages
export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className="bg-black">
        <Navbar />
        <main
          id="skip" // For accessibility skip-to-content link
          className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)]" // Responsive height calculations
        >
          {children} // Render page-specific content
        </main>
        <Footer />
        <Suspense>
          {' '}
          // Wrap Toaster in Suspense for loading states
          <Toaster />
        </Suspense>
      </body>
    </html>
  );
}
