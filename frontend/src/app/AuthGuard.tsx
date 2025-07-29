"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const checkAuth = async () => {
    const res = await fetch(`${apiBaseUrl}/api/user`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
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
