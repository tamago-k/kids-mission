"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Medal, ArrowLeft } from "lucide-react"
import { ParentNavigation } from "@/components/navigation/ParentNavigation"

export default function ParentBadgeHistoryPage() {
  const [selectedChild, setSelectedChild] = useState("all")
  const [timeFilter, setTimeFilter] = useState("week")

  const children = [
    { id: "taro", name: "太郎", avatar: "👦" },
    { id: "hanako", name: "花子", avatar: "👧" },
  ]

  const badgeHistory = [
    {
      id: 1,
      childId: "taro",
      childName: "太郎",
      badgeName: "がんばり屋さん",
      badgeEmoji: "🏅",
      description: "タスク5件完了達成",
      date: "2025年1月15日 19:00",
    },
    {
      id: 2,
      childId: "hanako",
      childName: "花子",
      badgeName: "読書マスター",
      badgeEmoji: "📚",
      description: "読書感想文完了",
      date: "2025年1月14日 16:30",
    },
    {
      id: 3,
      childId: "taro",
      childName: "太郎",
      badgeName: "お手伝い名人",
      badgeEmoji: "🧹",
      description: "お手伝い10回達成",
      date: "2025年1月14日 21:00",
    },
    {
      id: 4,
      childId: "hanako",
      childName: "花子",
      badgeName: "漢字の達人",
      badgeEmoji: "📝",
      description: "漢字練習完了",
      date: "2025年1月13日 17:00",
    },
  ]

  const filteredHistory = badgeHistory.filter((entry) => {
    const matchesChild = selectedChild === "all" || entry.childId === selectedChild
    return matchesChild
  })

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
                <Medal className="w-6 h-6 text-yellow-500" />
                バッジ履歴
              </h1>
              <p className="text-sm text-gray-600">獲得したバッジの一覧</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={timeFilter === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeFilter("week")}
                className="rounded-2xl"
              >
                今週
              </Button>
              <Button
                variant={timeFilter === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeFilter("month")}
                className="rounded-2xl"
              >
                今月
              </Button>
            </div>
          </div>

          {/* 子ども選択 */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedChild === "all" ? "default" : "outline"}
              className={`rounded-full px-4 py-2 h-auto whitespace-nowrap ${
                selectedChild === "all"
                  ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white"
                  : "border-2 border-gray-200"
              }`}
              onClick={() => setSelectedChild("all")}
            >
              全員
            </Button>
            {children.map((child) => (
              <Button
                key={child.id}
                variant={selectedChild === child.id ? "default" : "outline"}
                className={`rounded-full px-4 py-2 h-auto whitespace-nowrap ${
                  selectedChild === child.id
                    ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white"
                    : "border-2 border-gray-200"
                }`}
                onClick={() => setSelectedChild(child.id)}
              >
                <span className="mr-2">{child.avatar}</span>
                {child.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4 pb-24">
        {/* バッジ履歴一覧 */}
        <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              🏅 バッジ獲得履歴
              <Badge className="bg-yellow-100 text-yellow-700">{filteredHistory.length}件</Badge>
              {selectedChild !== "all" && (
                <Badge className="bg-purple-100 text-purple-600">
                  {children.find((c) => c.id === selectedChild)?.name}のみ
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🎖️</div>
                <p className="text-gray-600">
                  {selectedChild === "all"
                    ? "バッジ履歴がありません"
                    : `${children.find((c) => c.id === selectedChild)?.name}のバッジ履歴がありません`}
                </p>
              </div>
            ) : (
              filteredHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 bg-yellow-50 rounded-2xl shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-200 flex items-center justify-center text-2xl">
                      {entry.badgeEmoji}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{entry.badgeName}</h3>
                      <p className="text-sm text-gray-600">{entry.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {entry.childName} • {entry.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <ParentNavigation />
    </div>
  )
}
