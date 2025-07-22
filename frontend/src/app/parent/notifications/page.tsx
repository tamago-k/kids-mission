"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import { ParentNavigation } from "@/components/navigation/parent-navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function ParentNotificationsPage() {
  const [filter, setFilter] = useState("all")
  const [selectedNotification, setSelectedNotification] = useState<typeof notifications[0] | null>(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"approve" | "reject" | null>(null)
  const [targetNotificationId, setTargetNotificationId] = useState<number | null>(null)

  // 親専用の通知データ
  const notifications = [
    {
      id: 1,
      type: "task_submission",
      title: "太郎がタスクを申請しました",
      description: "算数の宿題 - 承認待ちです",
      timestamp: "2時間前",
      isRead: false,
      icon: "📝",
      color: "bg-blue-100 text-blue-600",
      childName: "太郎",
      childAvatar: "👦",
      actionRequired: true,
    },
    {
      id: 2,
      type: "reward_request",
      title: "花子が報酬を申請しました",
      description: "ゲーム時間30分 (150P)",
      timestamp: "3時間前",
      isRead: false,
      icon: "💰",
      color: "bg-purple-100 text-purple-600",
      childName: "花子",
      childAvatar: "👧",
      actionRequired: true,
    },
    {
      id: 3,
      type: "comment",
      title: "太郎からコメントが届きました",
      description: "「問題25番が分からないです...」",
      timestamp: "4時間前",
      isRead: true,
      icon: "💬",
      color: "bg-green-100 text-green-600",
      childName: "太郎",
      childAvatar: "👦",
      actionRequired: false,
    },
    {
      id: 4,
      type: "deadline_reminder",
      title: "締切が近づいています",
      description: "花子の漢字練習 - 今日 19:00",
      timestamp: "1時間前",
      isRead: true,
      icon: "⏰",
      color: "bg-orange-100 text-orange-600",
      childName: "花子",
      childAvatar: "👧",
      actionRequired: false,
    },
    {
      id: 5,
      type: "task_overdue",
      title: "タスクが期限切れです",
      description: "太郎の理科レポート - 昨日が締切でした",
      timestamp: "1日前",
      isRead: true,
      icon: "⚠️",
      color: "bg-red-100 text-red-600",
      childName: "太郎",
      childAvatar: "👦",
      actionRequired: false,
    },
  ]

  const unreadCount = notifications.filter((n) => !n.isRead).length
  const actionRequiredCount = notifications.filter((n) => n.actionRequired).length
  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : filter === "action"
        ? notifications.filter((n) => n.actionRequired)
        : notifications

  const handleApprove = (notification: typeof notifications[0]) => {
    setSelectedNotification(notification)
    setIsApproveModalOpen(true)
  }

  const handleReject = (notification: typeof notifications[0]) => {
    setSelectedNotification(notification)
    setIsRejectModalOpen(true)
}


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* ヘッダー */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => window.history.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-500" />
                親の通知
                {unreadCount > 0 && <Badge className="bg-red-500 text-white">{unreadCount}</Badge>}
              </h1>
              <p className="text-sm text-gray-600">子どもたちからのお知らせ</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-2xl bg-transparent"
              onClick={() => {
                /* 全て既読にする処理 */
              }}
            >
              全て既読
            </Button>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4 pb-24">
        <Tabs value={filter} onValueChange={setFilter} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm rounded-2xl p-1">
            <TabsTrigger value="all" className="rounded-xl text-sm">
              📋 すべて ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="action" className="rounded-xl text-sm">
              ⚡ 要対応 ({actionRequiredCount})
            </TabsTrigger>
            <TabsTrigger value="unread" className="rounded-xl text-sm">
              🔔 未読 ({unreadCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    {filter === "unread"
                      ? "未読の通知はありません"
                      : filter === "action"
                        ? "対応が必要な通知はありません"
                        : "通知はありません"}
                  </h3>
                  <p className="text-gray-600">
                    {filter === "unread"
                      ? "すべての通知を確認済みです！"
                      : filter === "action"
                        ? "すべて対応済みです！"
                        : "新しい通知が届くとここに表示されます"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm transition-all hover:shadow-xl ${
                    !notification.isRead ? "ring-2 ring-blue-200" : ""
                  } ${notification.actionRequired ? "ring-2 ring-orange-200" : ""}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${notification.color}`}
                        >
                          {notification.icon}
                        </div>
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                          {notification.childAvatar}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className={`font-medium text-gray-800 ${!notification.isRead ? "font-bold" : ""}`}>
                            {notification.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            {notification.actionRequired && (
                              <Badge className="bg-orange-100 text-orange-600 text-xs">要対応</Badge>
                            )}
                            {!notification.isRead && (
                              <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.description}</p>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-gray-500">{notification.timestamp}</span>
                          <Badge variant="outline" className="text-xs">
                            {notification.childName}
                          </Badge>
                        </div>

                        {/* アクション必要な通知の場合、承認/却下ボタンを表示 */}
                        {notification.actionRequired && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(notification)}
                              className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              承認
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(notification)}
                              className="flex-1 border-red-200 text-red-600 hover:bg-red-50 rounded-xl bg-transparent"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              却下
                            </Button>
                          </div>
                        )}

                        {!notification.isRead && !notification.actionRequired && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 text-xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              // 既読にする処理
                            }}
                          >
                            既読にする
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* 承認モーダル */}
      <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>承認の確認</DialogTitle>
          </DialogHeader>
          <p>{selectedNotification?.title} を承認してもよろしいですか？</p>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsApproveModalOpen(false)}>キャンセル</Button>
            <Button onClick={() => {
              handleApprove(selectedNotification!.id);
              setIsApproveModalOpen(false);
            }}>承認する</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 却下モーダル */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>却下の確認</DialogTitle>
          </DialogHeader>
          <p>{selectedNotification?.title} を却下してもよろしいですか？</p>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsRejectModalOpen(false)}>キャンセル</Button>
            <Button variant="destructive" onClick={() => {
              handleReject(selectedNotification!.id);
              setIsRejectModalOpen(false);
            }}>却下する</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ナビゲーション */}
      <ParentNavigation />
    </div>
  )
}
