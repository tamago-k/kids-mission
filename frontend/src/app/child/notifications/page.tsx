"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, ArrowLeft } from "lucide-react"
import { ChildNavigation } from "@/components/navigation/ChildNavigation"

export default function ChildNotificationsPage() {
  const [filter, setFilter] = useState("all")

  // 子ども専用の通知データ（太郎の例）
  const notifications = [
    {
      id: 1,
      type: "task_approved",
      title: "算数の宿題が承認されました！",
      description: "100ポイントをゲットしたよ！🎉",
      timestamp: "1時間前",
      isRead: false,
      icon: "✅",
      color: "bg-green-100 text-green-600",
    },
    {
      id: 2,
      type: "reward_approved",
      title: "ポイント交換が承認されました！",
      description: "ゲーム時間30分 - 楽しんでね！",
      timestamp: "2時間前",
      isRead: false,
      icon: "🎮",
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: 3,
      type: "task_rejected",
      title: "漢字練習が却下されました",
      description: "もう一度がんばってみよう！コメントを確認してね",
      timestamp: "3時間前",
      isRead: true,
      icon: "❌",
      color: "bg-red-100 text-red-600",
    },
    {
      id: 4,
      type: "new_task",
      title: "新しいタスクが追加されました",
      description: "理科の実験レポート - がんばろう！",
      timestamp: "4時間前",
      isRead: true,
      icon: "📋",
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: 5,
      type: "comment_received",
      title: "お母さんからコメントが届きました",
      description: "「よくがんばったね！次も期待してるよ」",
      timestamp: "1日前",
      isRead: true,
      icon: "💬",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      id: 6,
      type: "deadline_reminder",
      title: "締切が近づいています",
      description: "お手伝い（食器洗い）- 今日 20:00まで",
      timestamp: "1日前",
      isRead: true,
      icon: "⏰",
      color: "bg-orange-100 text-orange-600",
    },
  ]

  const unreadCount = notifications.filter((n) => !n.isRead).length
  const filteredNotifications = filter === "unread" ? notifications.filter((n) => !n.isRead) : notifications

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
                <Bell className="w-5 h-5 text-orange-500" />
                おしらせ
                {unreadCount > 0 && <Badge className="bg-red-500 text-white">{unreadCount}</Badge>}
              </h1>
              <p className="text-sm text-gray-600">きみへのおしらせだよ！</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-2xl bg-transparent"
              onClick={() => {
                /* 全て既読にする処理 */
              }}
            >
              ぜんぶよんだ
            </Button>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4 pb-24">

        <Tabs value={filter} onValueChange={setFilter} className="space-y-4">
          <TabsList className="grid grid-cols-2 mb-4 rounded-xl bg-gray-100 p-1">
            <TabsTrigger value="all"  className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow">
              📋 ぜんぶ ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow">
              🔔 あたらしい ({unreadCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    {filter === "unread" ? "あたらしいおしらせはないよ" : "おしらせはないよ"}
                  </h3>
                  <p className="text-gray-600">
                    {filter === "unread" ? "ぜんぶよんだね！えらい！" : "あたらしいおしらせがあるとここにでるよ"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm transition-all hover:shadow-xl cursor-pointer ${
                    !notification.isRead ? "ring-2 ring-orange-200" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${notification.color}`}
                      >
                        {notification.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3
                            className={`font-bold text-gray-800 text-lg ${!notification.isRead ? "text-orange-700" : ""}`}
                          >
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <div className="w-4 h-4 bg-orange-500 rounded-full flex-shrink-0 ml-2"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3 leading-relaxed">{notification.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {notification.timestamp}
                          </span>
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-orange-600 hover:text-orange-700 text-xs font-bold"
                              onClick={(e) => {
                                e.stopPropagation()
                                // 既読にする処理
                              }}
                            >
                              よんだ！
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

      </div>

      {/* ナビゲーション */}
      <ChildNavigation />
    </div>
  )
}
