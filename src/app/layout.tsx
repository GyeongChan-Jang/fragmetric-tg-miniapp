import './globals.css'
import { Inter } from 'next/font/google'
import { Root } from '@/components/Root/Root'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Fragmetric - Solana Restaking Games',
  description: 'Play clicker and SOL betting games on the Fragmetric platform',
  icons: {
    icon: '/favicon-light.png'
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Root>{children}</Root>
      </body>
    </html>
  )
}
