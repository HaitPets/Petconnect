import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { Toaster } from 'react-hot-toast'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat'
})

export const metadata: Metadata = {
  title: 'MoPets - Pet Community for Owners, Lovers & Breeders',
  description: 'Connect with fellow pet enthusiasts, discover premium breeds like French Bulldogs and Cane Corsos, and access professional breeder tools.',
  keywords: 'pets, dogs, french bulldog, cane corso, breeders, pet community, puppy marketplace',
  authors: [{ name: 'MoPets Team' }],
  creator: 'MoPets',
  publisher: 'MoPets',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://mopets.app'),
  openGraph: {
    title: 'MoPets - Premium Pet Community',
    description: 'Join the exclusive community for pet owners, lovers, and professional breeders.',
    url: 'https://mopets.app',
    siteName: 'MoPets',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MoPets - Premium Pet Community',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MoPets - Premium Pet Community',
    description: 'Connect with fellow pet enthusiasts and professional breeders.',
    images: ['/images/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192x192.png',
    shortcut: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#8b4513' },
    { media: '(prefers-color-scheme: dark)', color: '#8b4513' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={montserrat.variable}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MoPets" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#8b4513" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${montserrat.className} antialiased bg-primary-50 min-h-screen`}>
        <AuthProvider>
          <main className="relative">
            {children}
          </main>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#8b4513',
                color: '#fff',
                borderRadius: '12px',
                padding: '16px',
                fontFamily: 'Montserrat, sans-serif',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}