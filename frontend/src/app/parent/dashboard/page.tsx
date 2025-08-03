"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"
import { ParentNavigation } from "@/components/navigation/ParentNavigation"
import { colorThemes } from "@/components/OptionThemes"

export default function ParentDashboard() {
  const router = useRouter()
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [rewardRequests, setRewardRequests] = useState<RewardRequest[]>([])
  const [submittedTasks, setSubmittedTasks] = useState<Task[]>([])

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
    completion_status: "submitted" | "approved" | "rejected" | null;
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

      try {
        const resTasks = await fetch(`${apiBaseUrl}/api/tasks?status=submitted`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (!resTasks.ok) throw new Error("タスク取得失敗");
        const tasksData = await resTasks.json();
        setSubmittedTasks(tasksData.data);
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
        if (!resRewards.ok) throw new Error("ポイント申請取得失敗");
        const rewardsData = await resRewards.json();
        setRewardRequests(rewardsData.requests);
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
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-20">
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
                  {(submittedTasks?.length ?? 0) + (rewardRequests?.length ?? 0)}
                </div>
                <div className="text-sm text-gray-600">要対応</div>
              </div>
              <div className="bg-green-50 rounded-2xl p-3">
                <div className="text-2xl font-bold text-green-600">{submittedTasks?.length ?? 0}</div>
                <div className="text-sm text-gray-600">タスク申請</div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-3">
                <div className="text-2xl font-bold text-purple-600">{rewardRequests?.length ?? 0}</div>
                <div className="text-sm text-gray-600">ポイント申請</div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* ナビゲーション */}
      <ParentNavigation />
    </div>
  )
}
