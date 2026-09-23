import './globals.css'
import { Inter, Sora } from 'next/font/google'
import { Providers } from './providers'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const sora = Sora({ subsets: ['latin'], variable: '--font-sora', display: 'swap', weight: ['500', '600', '700', '800'] })

export const metadata = {
  title: 'Seyon IT Solutions — Digital Platforms for Tamil Nadu',
  description:
    'Seyon IT Solutions Pvt Ltd (Coimbatore) builds government platforms, municipal systems, e-commerce and mobile apps that serve real people.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${sora.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body suppressHydrationWarning className="bg-background text-foreground antialiased font-sans">
        <Providers>{children}</Providers>
        <Toaster position="top-center" theme="dark" />
      </body>
    </html>
  )
}
