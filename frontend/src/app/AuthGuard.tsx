"use client"

import { useEffect, useState } from "react"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useRouter, usePathname } from "next/navigation"

// children は <AuthGuard>〇〇</AuthGuard> の中に書かれた要素（保護対象）を指す
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  // トップページに遷移可能
  const router = useRouter()
  // 現在ブラウザで表示されているURLのパス部分を取得
  const pathname = usePathname()
  // 認証チェックなど処理が終わるまでの読み込み状態（初期は true）
  const [loading, setLoading] = useState(true)
  // 環境変数からAPI URL取得
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  useEffect(() => {
    const token = localStorage.getItem("token");
    const checkAuth = async () => {
    // GET /api/user を叩いてユーザー一覧を取得
    // カスタムフックだとうまくいかない
    const res = await fetch(`${apiBaseUrl}/api/user`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    // user が null かつ 現在のパスがトップページじゃなければリダイレクト
      if (!res.ok && pathname !== '/') {
        router.push('/')
      } else {
        setLoading(false)
      }
    }
    checkAuth()
  }, [pathname, router, apiBaseUrl])

  if (loading) return null

  return <>{children}</>
}
