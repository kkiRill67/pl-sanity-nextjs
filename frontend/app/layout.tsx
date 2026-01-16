import './globals.css'

import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from "next/font/google";
import { draftMode } from 'next/headers'
import { VisualEditing, toPlainText } from 'next-sanity'
import { Toaster } from 'sonner'

import * as demo from '@/sanity/lib/demo'
import { generateDefaultSeo } from 'next-seo/pages';
import { defaultSeoConfig } from './next-seo.config';
import { sanityFetch, SanityLive } from '@/sanity/lib/live'
import { settingsQuery } from '@/sanity/lib/queries'
import { resolveOpenGraphImage } from '@/sanity/lib/utils'
import { handleError } from './client-utils'
import { Providers } from './providers'
import { Sidebar } from '@/widgets/sidebar/ui'
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import DraftModeToast from '@/shared/components/DraftModeToast';

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await sanityFetch({
    query: settingsQuery,
    // Metadata should never contain stega
    stega: false,
  })
  const title = settings?.title || demo.title
  const description = settings?.description || demo.description

  const ogImage = resolveOpenGraphImage(settings?.ogImage)
  let metadataBase: URL | undefined = undefined
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : undefined
  } catch {
    // ignore
  }
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: toPlainText(description),
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: metadataBase?.toString(),
    },
    other: {
      'yandex-verification': 'da9aca6a8acc81b3',
    },
  }
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Add default SEO tags
  const { isEnabled: isDraftMode } = await draftMode()

  return (
    <html lang="ru">

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <section className="min-h-screen">
          {/* The <Toaster> component is responsible for rendering toast notifications used in /app/client-utils.ts and /app/components/DraftModeToast.tsx */}
          <Toaster />
          {generateDefaultSeo(defaultSeoConfig)}
          {isDraftMode && (
            <>
              <DraftModeToast />
              {/*  Enable Visual Editing, only to be rendered when Draft Mode is enabled */}
              <VisualEditing />
            </>
          )}
          {/* The <SanityLive> component is responsible for making all sanityFetch calls in your application live, so should always be rendered. */}
          <SanityLive onError={handleError} />
          <Providers>
            <div className="max-w-screen-xl m-auto relative">
              {/* Mobile Header with Navbar */}
              <div className="md:hidden m-auto px-4 py-4">
                <Header />
              </div>

              {/* Main layout with Sidebar on desktop */}
              <div className="m-auto flex items-start gap-2 px-2 pb-4">
                <Sidebar />
                <main className="pb-2 w-full min-h-[60vh] bg-gradient-to-b from-white/5 to-transparent rounded-xl p-4 border border-white/5 shadow-inner">
                  {children}
                </main>
              </div>
              {/* <Footer /> */}
            </div>
          </Providers>
        </section>
        <SpeedInsights />
      </body>
    </html>
  )
}
