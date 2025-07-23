import type { Metadata } from 'next'
import './globals.css'
import AuthGuard from './AuthGuard'

export const metadata: Metadata = {
  title: 'Kids Mission',
  description: '家族みんなで楽しく宿題管理 ',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  )
}
