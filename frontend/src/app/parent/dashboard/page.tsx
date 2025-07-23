"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Clock, Bell, Wallet, User, Users, BarChart3, PiggyBank } from "lucide-react"
import { ParentNavigation } from "@/components/navigation/parent-navigation"

export default function ParentDashboard() {
  const [selectedChild, setSelectedChild] = useState("all")
  const router = useRouter()
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const children = [
    { id: "taro", name: "太郎", avatar: "👦", color: "bg-blue-100 text-blue-600" },
    { id: "hanako", name: "花子", avatar: "👧", color: "bg-pink-100 text-pink-600" },
  ]

  const allPendingTasks = [
    {
      id: 1,
      child: "太郎",
      childId: "taro",
      task: "算数の宿題",
      reward: 100,
      submittedAt: "2時間前",
      type: "task",
    },
    {
      id: 2,
      child: "花子",
      childId: "hanako",
      task: "漢字練習",
      reward: 80,
      submittedAt: "30分前",
      type: "task",
    },
  ]

  const allRewardRequests = [
    {
      id: 1,
      child: "太郎",
      childId: "taro",
      item: "ゲーム時間30分",
      amount: 150,
      submittedAt: "1時間前",
      type: "reward",
    },
    {
      id: 2,
      child: "花子",
      childId: "hanako",
      item: "お菓子",
      amount: 100,
      submittedAt: "3時間前",
      type: "reward",
    },
  ]

  // 通知データに childId を追加
  const allNotifications = [
    {
      id: 1,
      child: "太郎",
      childId: "taro",
      task: "算数の宿題が完了しました",
      submittedAt: "2時間前",
      type: "task_completed",
    },
    {
      id: 2,
      child: "花子",
      childId: "hanako",
      task: "報酬を申請しました",
      submittedAt: "1時間前",
      type: "reward_request",
    },
  ]

  // 選択された子どもでフィルタリング
  const notifications =
    selectedChild === "all"
      ? allNotifications
      : allNotifications.filter((notification) => notification.childId === selectedChild)

  // 選択された子どもでフィルタリング
  const pendingTasks =
    selectedChild === "all" ? allPendingTasks : allPendingTasks.filter((task) => task.childId === selectedChild)

  const rewardRequests =
    selectedChild === "all"
      ? allRewardRequests
      : allRewardRequests.filter((request) => request.childId === selectedChild)

  useEffect(() => {
    const checkRole = async () => {
      const res = await fetch(`${apiBaseUrl}/api/user`, { credentials: "include" })
      if (!res.ok) {
        router.push("/")
        return
      }
      const user = await res.json()
      console.log("user.role:", user.role) 
      if (user.role !== "parent") {
        router.push("/")
      }
    }
    checkRole()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* ヘッダー */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-xl text-white">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">親ダッシュボード</h1>
              </div>
            </div>
          </div>

          {/* 子ども選択 */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedChild === "all" ? "default" : "outline"}
              className={`rounded-full px-4 py-2 h-auto whitespace-nowrap ${
                selectedChild === "all"
                  ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white"
                  : "border-2 border-gray-200 hover:border-purple-300"
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
                    : "border-2 border-gray-200 hover:border-purple-300"
                }`}
                onClick={() => setSelectedChild(child.id)}
              >
                <span className="mr-2 text-lg">{child.avatar}</span>
                {child.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4 pb-24">
        {/* 今日の概要 */}
        <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">今日の概要</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 rounded-2xl p-3">
                <div className="text-2xl font-bold text-blue-600">
                  {allPendingTasks.length + allRewardRequests.length}
                </div>
                <div className="text-sm text-gray-600">要対応</div>
              </div>
              <div className="bg-green-50 rounded-2xl p-3">
                <div className="text-2xl font-bold text-green-600">{allPendingTasks.length}</div>
                <div className="text-sm text-gray-600">タスク申請</div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-3">
                <div className="text-2xl font-bold text-purple-600">{allRewardRequests.length}</div>
                <div className="text-sm text-gray-600">報酬申請</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="tasks" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm rounded-2xl p-1">
            <TabsTrigger value="tasks" className="rounded-xl text-sm">
              <BarChart3 className="w-4 h-4 mr-3" /> タスク
            </TabsTrigger>
            <TabsTrigger value="children" className="rounded-xl text-sm">
              <Users className="w-4 h-4 mr-3" /> 子ども
            </TabsTrigger>
            <TabsTrigger value="rewards" className="rounded-xl text-sm">
              <PiggyBank className="w-4 h-4 mr-3" /> 報酬
            </TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-xl text-sm">
              <Bell className="w-4 h-4 mr-3" /> 通知
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5 text-orange-500" />
                  未承認の申請
                  <Badge className="bg-orange-100 text-orange-600">{pendingTasks.length}</Badge>
                  {selectedChild !== "all" && (
                    <Badge className="bg-blue-100 text-blue-600">
                      {children.find((c) => c.id === selectedChild)?.name}のみ
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">🎉</div>
                    <p className="text-gray-600">
                      {selectedChild === "all"
                        ? "未承認の申請はありません！"
                        : `${children.find((c) => c.id === selectedChild)?.name}の未承認申請はありません！`}
                    </p>
                  </div>
                ) : (
                  pendingTasks.map((task) => (
                    <Card key={task.id} className="border border-gray-200 rounded-2xl">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              {children.find((c) => c.id === task.childId)?.avatar}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-800">{task.task}</h3>
                              <p className="text-sm text-gray-600">
                                {task.child} • {task.submittedAt}
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-600">💰 {task.reward}円</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            承認
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 rounded-xl bg-transparent"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            却下
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="children" className="space-y-4">
            <div className="grid gap-4">
              {(selectedChild === "all" ? children : children.filter((c) => c.id === selectedChild)).map((child) => (
                <Card key={child.id} className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-2xl">
                        {child.avatar}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{child.name}</h3>
                        <p className="text-gray-600">今週のタスク完了率: 85%</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-blue-50 rounded-2xl p-3">
                        <div className="text-2xl font-bold text-blue-600">12</div>
                        <div className="text-sm text-gray-600">完了タスク</div>
                      </div>
                      <div className="bg-green-50 rounded-2xl p-3">
                        <div className="text-2xl font-bold text-green-600">850</div>
                        <div className="text-sm text-gray-600">獲得ポイント</div>
                      </div>
                      <div className="bg-purple-50 rounded-2xl p-3">
                        <div className="text-2xl font-bold text-purple-600">3</div>
                        <div className="text-sm text-gray-600">連続達成</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-4">
            <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wallet className="w-5 h-5 text-green-500" />
                  報酬申請
                  <Badge className="bg-green-100 text-green-600">{rewardRequests.length}</Badge>
                  {selectedChild !== "all" && (
                    <Badge className="bg-blue-100 text-blue-600">
                      {children.find((c) => c.id === selectedChild)?.name}のみ
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {rewardRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">🎁</div>
                    <p className="text-gray-600">
                      {selectedChild === "all"
                        ? "報酬申請はありません！"
                        : `${children.find((c) => c.id === selectedChild)?.name}の報酬申請はありません！`}
                    </p>
                  </div>
                ) : (
                  rewardRequests.map((request) => (
                    <Card key={request.id} className="border border-gray-200 rounded-2xl">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              {children.find((c) => c.id === request.childId)?.avatar}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-800">{request.item}</h3>
                              <p className="text-sm text-gray-600">
                                {request.child} • {request.submittedAt}
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-purple-100 text-purple-600">💎 {request.amount}P</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            承認
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 rounded-xl bg-transparent"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            却下
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bell className="w-5 h-5 text-blue-500" />
                  通知一覧
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex items-start gap-3 p-3 bg-blue-50 rounded-2xl">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                        {notification.type === "task_completed" ? "✅" : "💰"}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {notification.child}が{notification.task}
                        </p>
                        <p className="text-xs text-gray-600">{notification.submittedAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* ナビゲーション */}
      <ParentNavigation />
    </div>
  )
}
