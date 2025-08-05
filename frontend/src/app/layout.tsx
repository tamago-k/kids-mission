import type { Metadata } from 'next'
import './globals.css'
import AuthGuard from './AuthGuard'

// meta情報
export const metadata: Metadata = {
  title: 'Kids Mission',
  description: '家族みんなで楽しく宿題管理 ',
}

// children を受け取る、読み取り専用な RootLayoutコンポーネント関数
export default function RootLayout({children,}: Readonly<{children: React.ReactNode}>) {

  return (
    // AuthGuard がログイン状態を確認し、トークンがなければ / にリダイレクトあればページの内容（children）を表示
    <html lang="ja">
      <body>
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  )
}
