"use client"

// 未実装

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Wallet, ArrowLeft, History } from "lucide-react"
import { ParentNavigation } from "@/components/navigation/ParentNavigation"

export default function ParentPointsPage() {
  const [selectedChild, setSelectedChild] = useState("all")
  const [timeFilter, setTimeFilter] = useState("week")

  const children = [
    { id: "taro", name: "太郎", avatar: "👦", currentBalance: 450 },
    { id: "hanako", name: "花子", avatar: "👧", currentBalance: 380 },
  ]

  const pointsHistory = [
    {
      id: 1,
      child: "太郎",
      childId: "taro",
      type: "earned",
      amount: 100,
      reason: "算数の宿題完了",
      date: "2025年1月15日 19:00",
      taskId: 1,
    },
    {
      id: 2,
      child: "太郎",
      childId: "taro",
      type: "spent",
      amount: -150,
      reason: "ゲーム時間30分",
      date: "2025年1月15日 20:00",
      rewardId: 1,
    },
    {
      id: 3,
      child: "花子",
      childId: "hanako",
      type: "earned",
      amount: 80,
      reason: "漢字練習完了",
      date: "2025年1月15日 17:30",
      taskId: 2,
    },
    {
      id: 4,
      child: "花子",
      childId: "hanako",
      type: "spent",
      amount: -100,
      reason: "お菓子",
      date: "2025年1月14日 16:00",
      rewardId: 2,
    },
    {
      id: 5,
      child: "太郎",
      childId: "taro",
      type: "earned",
      amount: 50,
      reason: "お手伝い完了",
      date: "2025年1月14日 21:00",
      taskId: 3,
    },
    {
      id: 6,
      child: "花子",
      childId: "hanako",
      type: "earned",
      amount: 150,
      reason: "読書感想文完了",
      date: "2025年1月13日 17:00",
      taskId: 4,
    },
  ]

  const filteredHistory = pointsHistory.filter((entry) => {
    const matchesChild = selectedChild === "all" || entry.childId === selectedChild
    return matchesChild
  })

  const getTotalEarned = () => {
    return filteredHistory.filter((entry) => entry.type === "earned").reduce((sum, entry) => sum + entry.amount, 0)
  }

  const getTotalSpent = () => {
    return Math.abs(
      filteredHistory.filter((entry) => entry.type === "spent").reduce((sum, entry) => sum + entry.amount, 0),
    )
  }

  const getCurrentBalance = () => {
    if (selectedChild === "all") {
      return children.reduce((sum, child) => sum + child.currentBalance, 0)
    }
    return children.find((child) => child.id === selectedChild)?.currentBalance || 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 max-w-xl mx-auto">
      {/* ヘッダー */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => window.history.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <History className="w-6 h-6" /> 
                ポイント履歴
              </h1>
              <p className="text-sm text-gray-600">ポイントの獲得・使用履歴</p>
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
        {/* ポイント統計 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="border-0 shadow-lg rounded-3xl bg-gradient-to-r from-purple-400 to-pink-400 text-white">
            <CardContent className="p-4 text-center">
              <Wallet className="w-6 h-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">{getCurrentBalance()}</div>
              <div className="text-sm text-purple-100">現在残高</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg rounded-3xl bg-gradient-to-r from-green-400 to-blue-400 text-white">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">{getTotalEarned()}</div>
              <div className="text-sm text-green-100">獲得ポイント</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg rounded-3xl bg-gradient-to-r from-orange-400 to-red-400 text-white">
            <CardContent className="p-4 text-center">
              <TrendingDown className="w-6 h-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">{getTotalSpent()}</div>
              <div className="text-sm text-orange-100">使用ポイント</div>
            </CardContent>
          </Card>
        </div>

        {/* 子ども別残高（全員表示時のみ） */}
        {selectedChild === "all" && (
          <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">👨‍👩‍👧‍👦 子ども別残高</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {children.map((child) => (
                  <div key={child.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-2xl">
                        {child.avatar}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{child.name}</h3>
                        <p className="text-sm text-gray-600">現在の残高</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">{child.currentBalance}</div>
                      <div className="text-xs text-gray-600">ポイント</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ポイント履歴一覧 */}
        <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              📊 ポイント履歴
              <Badge className="bg-blue-100 text-blue-600">{filteredHistory.length}件</Badge>
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
                <div className="text-4xl mb-2">💰</div>
                <p className="text-gray-600">
                  {selectedChild === "all"
                    ? "ポイント履歴がありません"
                    : `${children.find((c) => c.id === selectedChild)?.name}のポイント履歴がありません`}
                </p>
              </div>
            ) : (
              filteredHistory.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        entry.type === "earned" ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      {entry.type === "earned" ? "📈" : "📉"}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{entry.reason}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{entry.child}</span>
                        <span>•</span>
                        <span>{entry.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${entry.type === "earned" ? "text-green-600" : "text-red-600"}`}>
                      {entry.type === "earned" ? "+" : ""}
                      {entry.amount}P
                    </div>
                    <Badge
                      className={entry.type === "earned" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}
                    >
                      {entry.type === "earned" ? "獲得" : "使用"}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      {/* ナビゲーション */}
      <ParentNavigation />
    </div>
  )
}
