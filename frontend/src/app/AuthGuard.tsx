"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  useEffect(() => {
    const checkAuth = async () => {
    const res = await fetch(`${apiBaseUrl}/api/user`, {
      credentials: 'include',
      headers: { 'Accept': 'application/json' },
    });
      if (!res.ok && pathname !== '/') {
        router.push('/')
      } else {
        setLoading(false)
      }
    }
    checkAuth()
  }, [pathname, router])

  if (loading) return null

  return <>{children}</>
}
