"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Wallet, User, BarChart3, PiggyBank, Gift } from "lucide-react"
import { ParentNavigation } from "@/components/navigation/ParentNavigation"
import { colorThemes, iconOptions } from "@/components/OptionThemes"

export default function ParentDashboard() {
  const [selectedChild, _setSelectedChild] = useState("all")
  const router = useRouter()
  const [children, _setChildren] = useState<{ id: string, name: string, avatar: string }[]>([])
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [rewardRequests, _setRewardRequests] = useState<RewardRequest[]>([])
  const [submittedTasks, _setSubmittedTasks] = useState<Task[]>([])

  type RewardRequest = {
    id: number
    reward_id: number
    status: "submitted" | "approved" | "rejected"
    requested_at: string
    created_at: string
    updated_at: string
    reward: {
      id: number
      name: string
      icon: string
      need_reward: number
      created_at: string
      updated_at: string
    }
    user: {
      id: number
      name: string
      avatar: string
      role: "child"
      theme: string
      created_at: string
      updated_at: string
    }
  }
  type Task = {
    id: number
    title: string
    description: string
    due_date: string
    reward_amount: number
    isRecurring: boolean
    recurrence: "daily" | "weekly" | "monthly" | "weekdays" | "weekends" | null
    recurringType: string | null
    completion_status: "none" | "submitted" | "approved" | "rejected"
    child_id: number
    parent_id: number
    created_at: string
    updated_at: string
    task_category_id: number
    task_category: {
      id: number
      name: string
      slug: string
      created_at: string
      updated_at: string
    }
    child: {
      id: number
      name: string
      avatar: string
      theme: string
      role: "child"
      created_at: string
      updated_at: string
    }
    latest_submission: {
      id: number
      task_id: number
      user_id: number
      status: "submitted" | "approved" | "rejected"
      submitted_at: string
      created_at: string
      updated_at: string
    } | null
  }

  useEffect(() => {

    const checkAuthAndFetch = async () => {
    const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      // ロールチェック
      const resUser = await fetch(`${apiBaseUrl}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!resUser.ok) {
        localStorage.removeItem("token");
        router.push("/");
        return;
      }
      const user = await resUser.json();
      if (user.role !== "parent") {
        localStorage.removeItem("token");
        router.push("/");
        return;
      }

      // 認証OKならデータ取得
      try {
        const resTasks = await fetch(`${apiBaseUrl}/api/tasks?status=submitted`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (!resTasks.ok) throw new Error("タスク取得失敗");
      } catch (error) {
        localStorage.removeItem("token");
        router.push("/");
        return;
      }

      try {
        const resRewards = await fetch(`${apiBaseUrl}/api/reward-requests?status=submitted`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (!resRewards.ok) throw new Error("報酬申請取得失敗");
      } catch (error) {
        localStorage.removeItem("token");
        router.push("/");
        return;
      }
    }

    checkAuthAndFetch();
  }, [apiBaseUrl, router]);


  const getBgClassByTheme = (themeValue?: string) => {
    const theme = colorThemes.find(t => t.value === themeValue)
    return theme ? theme.gradient : "bg-gray-100"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 max-w-xl mx-auto">
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
                  {submittedTasks.length + rewardRequests.length}
                </div>
                <div className="text-sm text-gray-600">要対応</div>
              </div>
              <div className="bg-green-50 rounded-2xl p-3">
                <div className="text-2xl font-bold text-green-600">{submittedTasks.length}</div>
                <div className="text-sm text-gray-600">タスク申請</div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-3">
                <div className="text-2xl font-bold text-purple-600">{rewardRequests.length}</div>
                <div className="text-sm text-gray-600">報酬申請</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="tasks" className="space-y-4">
          <TabsList  className="grid grid-cols-2 mb-4 rounded-xl bg-gray-100 p-1">
            <TabsTrigger value="tasks" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow text-sm">
              <BarChart3 className="w-4 h-4 mr-2" /> タスク
            </TabsTrigger>
            <TabsTrigger value="rewards" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow text-sm">
              <PiggyBank className="w-4 h-4 mr-2" /> 報酬
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5 text-orange-500" />
                  未承認の申請
                  <Badge className="bg-orange-100 text-orange-600">{submittedTasks.length}</Badge>
                  {selectedChild !== "all" && (
                    <Badge className="bg-blue-100 text-blue-600">
                      {children.find((c) => c.id === selectedChild)?.name}のみ
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {submittedTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">🎉</div>
                    <p className="text-gray-600">
                      {selectedChild === "all"
                        ? "未承認の申請はありません！"
                        : `${children.find((c) => c.id === selectedChild)?.name}の未承認申請はありません！`}
                    </p>
                  </div>
                ) : (
                  submittedTasks.map((task) => {
                    const childInfo = task.child
                    const iconObj = childInfo ? iconOptions.find(icon => icon.id === childInfo.avatar) : null
                    return (
                    <Card key={task.id} className="border border-gray-200 rounded-2xl">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex flex-col gap-3 items-start">
                            <div
                              className={`text-sm flex items-center gap-1 rounded-2xl p-1 pr-3 pl-3 bg-gradient-to-r text-white ${
                                getBgClassByTheme(childInfo?.theme)
                              }`}
                            >
                              {iconObj ? <iconObj.Icon className="w-4 h-4" /> : "未設定"}
                              {childInfo?.name || "未設定"}
                            </div>
                            <h3 className="font-medium text-gray-800">{task.title}</h3>
                          </div>
                          <Badge className="bg-purple-100 text-purple-600"><PiggyBank className="w-4 h-4 mr-2" /> {task.reward_amount}P</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Link href="/parent/tasks/" className="flex-1">
                            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-2xl">
                              タスクページへ
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  )})
                )}
              </CardContent>
            </Card>
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
                    <div className="text-4xl mb-2 flex justify-center"><Gift className="w-10 h-10" /></div>
                    <p className="text-gray-600">
                      {selectedChild === "all"
                        ? "報酬申請はありません！"
                        : `${children.find((c) => c.id === selectedChild)?.name}の報酬申請はありません！`}
                    </p>
                  </div>
                ) : (
                  rewardRequests.map((reward) => {
                    const childInfo = reward.user
                    const iconObj = childInfo ? iconOptions.find(icon => icon.id === childInfo.avatar) : null
                    return (
                    <Card key={reward.id} className="border border-gray-200 rounded-2xl">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex flex-col gap-3 items-start">
                                <div
                                  className={`text-sm flex items-center gap-1 rounded-2xl p-1 pr-3 pl-3 bg-gradient-to-r text-white ${
                                    getBgClassByTheme(childInfo?.theme)
                                  }`}
                                >
                                  {iconObj ? <iconObj.Icon className="w-4 h-4" /> : "未設定"}
                                  {childInfo?.name || "未設定"}
                                </div>
                                <h3 className="font-medium text-gray-800">{reward.reward?.name || "未設定"}</h3>
                              </div>  
                              <Badge className="bg-purple-100 text-purple-600"><PiggyBank className="w-4 h-4 mr-2" /> {reward.reward?.need_reward ?? 0}P</Badge>
                            </div>
                            <div className="flex gap-2">
                              <Link href="/parent/rewards/" className="flex-1">
                                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-2xl">
                                  報酬ページへ
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                  )})
                )}
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
