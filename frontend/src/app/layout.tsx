import type { Metadata } from 'next'
import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}
