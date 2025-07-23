"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Gift, History, Star, Trophy } from "lucide-react"
import { ChildNavigation } from "@/components/navigation/child-navigation"

export default function ChildRewardsPage() {
  const [rewardDialogOpen, setRewardDialogOpen] = useState(false)
  const [rewardItem, setRewardItem] = useState("")
  const [rewardAmount, setRewardAmount] = useState("")

  const currentBalance = 450
  const totalEarned = 1250

  const rewardHistory = [
    {
      id: 1,
      type: "earned",
      title: "算数の宿題完了",
      amount: 100,
      date: "今日",
      status: "completed",
    },
    {
      id: 2,
      type: "spent",
      title: "ゲーム時間30分",
      amount: -150,
      date: "昨日",
      status: "approved",
    },
    {
      id: 3,
      type: "earned",
      title: "漢字練習完了",
      amount: 80,
      date: "昨日",
      status: "completed",
    },
    {
      id: 4,
      type: "spent",
      title: "お菓子",
      amount: -100,
      date: "2日前",
      status: "pending",
    },
  ]

  const suggestedRewards = [
    { name: "ゲーム時間30分", points: 150, emoji: "🎮" },
    { name: "お菓子", points: 100, emoji: "🍭" },
    { name: "好きなテレビ番組", points: 120, emoji: "📺" },
    { name: "おもちゃ", points: 300, emoji: "🧸" },
    { name: "外食", points: 500, emoji: "🍔" },
    { name: "映画鑑賞", points: 200, emoji: "🎬" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      {/* ヘッダー */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">💰 ポイント</h1>
              <p className="text-sm text-gray-600">がんばったぶんだけたまるよ！</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">{currentBalance}</div>
              <div className="text-xs text-gray-600">ポイント</div>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4 space-y-6 pb-24">
        {/* ポイント残高カード */}
        <Card className="border-0 shadow-lg rounded-3xl bg-gradient-to-r from-purple-400 to-pink-400 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold mb-1">💎 ポイント残高</h2>
                <div className="text-4xl font-bold">{currentBalance} P</div>
              </div>
              <div className="text-6xl opacity-20">💰</div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white/20 rounded-2xl p-3 text-center">
                <div className="text-2xl font-bold">{totalEarned}</div>
                <div className="text-sm text-purple-100">合計獲得</div>
              </div>
              <div className="bg-white/20 rounded-2xl p-3 text-center">
                <div className="text-2xl font-bold">{totalEarned - currentBalance}</div>
                <div className="text-sm text-purple-100">使ったポイント</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* おすすめ報酬 */}
        <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="w-5 h-5 text-yellow-500" />
              おすすめ報酬
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {suggestedRewards.map((reward, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`h-auto p-4 rounded-2xl border-2 flex flex-col items-center gap-2 ${
                    currentBalance >= reward.points
                      ? "border-green-200 hover:border-green-300 hover:bg-green-50"
                      : "border-gray-200 opacity-50 cursor-not-allowed"
                  }`}
                  disabled={currentBalance < reward.points}
                  onClick={() => {
                    setRewardItem(reward.name)
                    setRewardAmount(reward.points.toString())
                    setRewardDialogOpen(true)
                  }}
                >
                  <span className="text-3xl">{reward.emoji}</span>
                  <div className="text-center">
                    <div className="font-medium text-sm">{reward.name}</div>
                    <div className="text-xs text-gray-600">{reward.points}P</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ポイント履歴 */}
        <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <History className="w-5 h-5 text-blue-500" />
              ポイント履歴
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {rewardHistory.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      item.type === "earned" ? "bg-green-100" : "bg-purple-100"
                    }`}
                  >
                    {item.type === "earned" ? (
                      <Trophy className="w-5 h-5 text-green-600" />
                    ) : (
                      <Gift className="w-5 h-5 text-purple-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${item.amount > 0 ? "text-green-600" : "text-purple-600"}`}>
                    {item.amount > 0 ? "+" : ""}
                    {item.amount}P
                  </div>
                  <Badge
                    className={`text-xs ${
                      item.status === "completed"
                        ? "bg-green-100 text-green-600"
                        : item.status === "approved"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {item.status === "completed" ? "完了" : item.status === "approved" ? "承認済み" : "申請中"}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ナビゲーション */}
      <ChildNavigation />
    </div>
  )
}
