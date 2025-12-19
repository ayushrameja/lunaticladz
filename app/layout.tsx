import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { LoadingProvider } from './components/LoadingProvider';
import { ConvexClientProvider } from './components/ConvexClientProvider';

const googleSans = localFont({
  src: '../assets/GoogleSansFlex-VariableFont_GRAD,ROND,opsz,slnt,wdth,wght.ttf',
  variable: '--font-google-sans',
  display: 'swap',
});

const monas = localFont({
  src: '../assets/MonasDemoRegular-eZl86.ttf',
  variable: '--font-monas',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LunaticLadz',
  description: 'LunaticLadz - Official Gaming Community',
  icons: {
    icon: [
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    title: 'Lunaticladz',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="Lunaticladz" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${googleSans.variable} ${monas.variable} antialiased`}
        suppressHydrationWarning
      >
        <ConvexClientProvider>
          <LoadingProvider>{children}</LoadingProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
