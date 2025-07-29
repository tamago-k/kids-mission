"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Medal, CheckCircle } from "lucide-react"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { ChildNavigation } from "@/components/navigation/ChildNavigation"
import { badgeIconOptions } from "@/components/OptionThemes"

interface BadgeAssignment {
  id: number
  badge: {
    id: number
    name: string
    description: string
    icon?: string
    point?: number
  }
  received_at: string | null
  assigned_at: string
}

export default function ChildBadgesPage() {
  const user = useCurrentUser()
  const [badgeAssignments, setBadgeAssignments] = useState<BadgeAssignment[]>([])
  const [filter, setFilter] = useState("pending")
  const receivedBadgeCount = badgeAssignments.filter(b => b.received_at !== null).length;
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  function getCookie(name: string) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return decodeURIComponent(parts.pop()!.split(";").shift()!)
    return null
  }

  // バッジ一覧取得
  const fetchBadgeAssignments = async () => {
    if (!user) return
    const csrfToken = getCookie("XSRF-TOKEN")
    const res = await fetch(`${apiBaseUrl}/api/badge-assignments`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": csrfToken ?? "",
      },
    })
    if (!res.ok) {
      alert("バッジ一覧取得に失敗しました")
      return
    }
    const data = await res.json()
    setBadgeAssignments(data)
  }

  useEffect(() => {
    fetchBadgeAssignments()
  }, [user?.id])

  // 受け取りボタン押下時
  const handleReceive = async (badgeAssignmentId: number) => {
    const csrfToken = getCookie("XSRF-TOKEN")
    const res = await fetch(`${apiBaseUrl}/api/badge-assignments/${badgeAssignmentId}/receive`, {
      method: "POST", // もしくはPATCH
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": csrfToken ?? "",
      },
    })
    if (!res.ok) {
      alert("バッジ受け取りに失敗しました")
      return
    }
    // 受け取り後リロード
    await fetchBadgeAssignments()
  }

  // タブで絞り込み
  const filteredBadges = badgeAssignments.filter(b =>
    filter === "pending" ? !b.received_at : !!b.received_at
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 max-w-xl mx-auto">
      {/* ヘッダー */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => window.history.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Medal className="w-6 h-6" /> 
                バッジ一覧
              </h1>
              <p className="text-sm text-gray-600">がんばったあかしだよ！</p>
            </div>
          </div>
        </div>
      </div>

      {/* 取得済みバッジカード */}
      <Card className="border-0 shadow-lg rounded-3xl bg-gradient-to-r from-purple-400 to-pink-400 text-white m-4">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
              <Medal className="w-12 h-12" />
              取得済みバッジ
            </h2>
            <div className="text-4xl font-bold">{receivedBadgeCount} 個</div>
          </div>
          <div className="text-6xl opacity-20">
            <Medal className="w-12 h-12" />
          </div>
        </CardContent>
      </Card>

      {/* タブ切替 */}
      <div className="p-4 space-y-4 grid grid-cols-2 rounded-xl bg-gray-100">
        <Button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 whitespace-nowrap rounded-xl ${
            filter === "pending" ? "bg-white shadow" : ""
          }`}
        >
          受け取れるバッジ
        </Button>
        <Button
          onClick={() => setFilter("received")}
          className={`px-4 py-2 whitespace-nowrap rounded-xl ${
            filter === "received" ? "bg-white shadow" : ""
          }`}
        >
          受取済み
        </Button>
      </div>
      

      {/* バッジ一覧 */} 
      <div className="p-4 space-y-4">
        {filteredBadges.length === 0 ? (
          <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center text-gray-600">
              {filter === "pending" ? "受け取れるバッジはありません。" : "受け取ったバッジはありません。"}
            </CardContent>
          </Card>
        ) : (
          filteredBadges.map(({ id, badge, received_at }) => {
            const Icon = badgeIconOptions.find(opt => opt.id === badge.icon)?.Icon
            console.log("badge.icon:", badge.icon)
            return (
              <Card
                key={id}
                className={`border-2 rounded-3xl transition-all flex justify-between items-center ${
                  received_at ? "border-green-300 bg-green-50" : "border-gray-300 bg-white/90"
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-bold">
                    {Icon ? (
                      <Icon className={`w-6 h-6 ${received_at ? "text-green-600" : "text-gray-600"}`} />
                    ) : (
                      <Medal className={`w-6 h-6 ${received_at ? "text-green-600" : "text-gray-600"}`} />
                    )}
                    {badge.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-700">{badge.description}</p>
                  {badge.point && (
                    <Badge className="bg-purple-100 text-purple-700 mb-2">
                      {badge.point}P
                    </Badge>
                  )}
                  <div>
                    {received_at ? (
                      <Button
                        size="sm"
                        disabled
                        className="bg-green-500 text-white rounded-2xl flex items-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        受取済み
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-2xl"
                        onClick={() => handleReceive(id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        受け取る
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>


      <ChildNavigation />
    </div>
  )
}
