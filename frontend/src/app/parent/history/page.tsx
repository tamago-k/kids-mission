"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Filter, ClipboardCheck } from "lucide-react"
import { ParentNavigation } from "@/components/navigation/parent-navigation"

export default function ParentHistoryPage() {
  const [selectedChild, setSelectedChild] = useState("all")
  const [timeFilter, setTimeFilter] = useState("week")

  const children = [
    { id: "taro", name: "太郎", avatar: "👦" },
    { id: "hanako", name: "花子", avatar: "👧" },
  ]

  const taskHistory = [
    {
      id: 1,
      title: "算数の宿題",
      description: "教科書p.24-26の問題を解く",
      child: "太郎",
      childId: "taro",
      reward: 100,
      status: "completed",
      completedAt: "2025年1月15日 18:30",
      submittedAt: "2025年1月15日 18:00",
      approvedAt: "2025年1月15日 19:00",
      comment: "きちんと解けていました！",
    },
    {
      id: 2,
      title: "漢字練習",
      description: "新しい漢字10個を3回ずつ書く",
      child: "花子",
      childId: "hanako",
      reward: 80,
      status: "completed",
      completedAt: "2025年1月15日 17:00",
      submittedAt: "2025年1月15日 17:15",
      approvedAt: "2025年1月15日 17:30",
      comment: "とても丁寧に書けています",
    },
    {
      id: 3,
      title: "お手伝い（食器洗い）",
      description: "夕食後の食器を洗う",
      child: "太郎",
      childId: "taro",
      reward: 50,
      status: "rejected",
      completedAt: "2025年1月14日 20:00",
      submittedAt: "2025年1月14日 20:30",
      rejectedAt: "2025年1月14日 21:00",
      comment: "まだ汚れが残っているので、もう一度お願いします",
    },
    {
      id: 4,
      title: "読書感想文",
      description: "好きな本を読んで感想を書く",
      child: "花子",
      childId: "hanako",
      reward: 150,
      status: "completed",
      completedAt: "2025年1月13日 16:00",
      submittedAt: "2025年1月13日 16:30",
      approvedAt: "2025年1月13日 17:00",
      comment: "感想がとても詳しく書けていて素晴らしいです！",
    },
  ]

  const filteredHistory = taskHistory.filter((task) => {
    const matchesChild = selectedChild === "all" || task.childId === selectedChild
    // 時間フィルターの実装は省略（実際にはここで日付フィルタリング）
    return matchesChild
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-600">✅ 承認済み</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-600">❌ 却下</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-600">❓ 不明</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 max-w-xl mx-auto">
      {/* ヘッダー */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2"><ClipboardCheck className="w-6 h-6" /> タスク履歴</h1>
              <p className="text-sm text-gray-600">過去のタスク実績を確認</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setTimeFilter("week")}
                className={`rounded-full px-4 py-2 h-auto whitespace-nowrap ${
                  timeFilter === "week"
                    ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white"
                    : "border-2 border-gray-200"
                }`}
              >
                今週
              </Button>

              <Button
                onClick={() => setTimeFilter("month")}
                className={`rounded-full px-4 py-2 h-auto whitespace-nowrap ${
                  timeFilter === "month"
                    ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white"
                    : "border-2 border-gray-200"
                }`}
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
        {/* 統計サマリー */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="border-0 shadow-lg rounded-3xl bg-gradient-to-r from-green-400 to-blue-400 text-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{filteredHistory.filter((t) => t.status === "completed").length}</div>
              <div className="text-sm text-green-100">承認済み</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg rounded-3xl bg-gradient-to-r from-red-400 to-pink-400 text-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{filteredHistory.filter((t) => t.status === "rejected").length}</div>
              <div className="text-sm text-red-100">却下</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg rounded-3xl bg-gradient-to-r from-purple-400 to-indigo-400 text-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">
                {filteredHistory.reduce((sum, t) => sum + (t.status === "completed" ? t.reward : 0), 0)}
              </div>
              <div className="text-sm text-purple-100">付与ポイント</div>
            </CardContent>
          </Card>
        </div>

        {/* タスク履歴一覧 */}
        <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="w-5 h-5 text-blue-500" />
              タスク履歴
              <Badge className="bg-blue-100 text-blue-600">{filteredHistory.length}件</Badge>
              {selectedChild !== "all" && (
                <Badge className="bg-purple-100 text-purple-600">
                  {children.find((c) => c.id === selectedChild)?.name}のみ
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📋</div>
                <p className="text-gray-600">
                  {selectedChild === "all"
                    ? "タスク履歴がありません"
                    : `${children.find((c) => c.id === selectedChild)?.name}のタスク履歴がありません`}
                </p>
              </div>
            ) : (
              filteredHistory.map((task) => (
                <Card key={task.id} className="border border-gray-200 rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          {children.find((c) => c.id === task.childId)?.avatar}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">{task.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {task.child}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {task.status === "completed" ? task.approvedAt : task.rejectedAt}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(task.status)}
                        <Badge className="bg-purple-100 text-purple-600">💰 {task.reward}P</Badge>
                      </div>
                    </div>
                    {task.comment && (
                      <div className="bg-gray-50 rounded-2xl p-3 mt-3">
                        <p className="text-sm text-gray-700">💬 {task.comment}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <ParentNavigation />
    </div>
  )
}
