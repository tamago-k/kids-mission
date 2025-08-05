"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PiggyBank, ClipboardCheck, Star, CheckCircle, Gift, ThumbsUp, Smile } from "lucide-react"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { ChildNavigation } from "@/components/navigation/ChildNavigation"
import type { Task } from "@/types/DashboardChild"

export default function ChildDashboard() {
  //　ログイン中のユーザー情報を取得
  const user = useCurrentUser()
  // 今日やるべきタスク一覧
  const [todayTasks, setTodayTasks] = useState<Task[]>([])
  // 現在のポイント残高
  const [currentBalance, setCurrentBalance] = useState(0)
  // 達成済みタスク数、獲得ポイント数などの統計情報
  const [stats, setStats] = useState({
    task_completed: 0,
    points_earned: 0,
  })
  // 環境変数からAPI URL取得
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  //　初回マウント時に実行
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchData = async () => {
      try {

        // GET /api/tasks/today を叩いて今日のタスク一覧を取得
        const resTasks = await fetch(`${apiBaseUrl}/api/tasks/today`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        if (!resTasks.ok) throw new Error("タスク取得失敗")
        const tasksData = await resTasks.json()

        // GET /api/reward-balance を叩いて現在のポイント数を取得
        const resBalance = await fetch(`${apiBaseUrl}/api/reward-balance`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        if (!resBalance.ok) throw new Error("残高取得失敗")
        const balanceData = await resBalance.json()

        setTodayTasks(tasksData)
        setCurrentBalance(balanceData.balance)
      } catch (error) {
        console.error(error)
      }
    }
    const fetchStats = async () => {
      try {
        // GET /api/tasks/weekday を叩いて週間一覧を取得
        const res = await fetch(`${apiBaseUrl}/api/tasks/weekday`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()
        setStats(data)
      } catch (error) {
        console.error("データ取得失敗", error)
      }
    }
    fetchData()
    fetchStats()
  }, [apiBaseUrl])

  if (user === null) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 max-w-xl mx-auto">
      {/* ヘッダー */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-2xl text-white">
                <Smile className="w-6 h-6" /> 
              </div>
              <div>
                <h1 className="text-x font-bold text-gray-800">{user?.name}さん、今日もがんばろう！</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4 space-y-6 pb-24">
        {/* 今日のタスク概要 */}
        <Card className="border-0 shadow-lg rounded-3xl bg-gradient-to-r from-orange-400 to-pink-400 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold mb-1 flex gap-1 items-center">
                  <CheckCircle className="w-4 h-4" />
                  今日のタスク
                </h2>
                <div className="text-3xl font-bold">
                  {todayTasks.filter((t) => t.submission?.status === "approved").length}/{todayTasks.length}
                </div>
                <p className="text-orange-100 text-sm">完了したよ！</p>
              </div>
              <div className="text-6xl opacity-20">
                <ClipboardCheck className="w-15 h-15" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ポイント数カード */}
        <Card className="border-0 shadow-lg rounded-3xl bg-gradient-to-r from-purple-400 to-pink-400 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold flex gap-1 items-center">
                  <PiggyBank className="w-6 h-6" />
                  ポイント数
                </h2>
                <div className="text-3xl font-bold">{currentBalance} P</div>
                <p className="text-purple-100 text-sm mt-1">よくがんばったね！</p>
              </div>
              <div className="text-6xl opacity-20">
                <ThumbsUp className="w-15 h-15" />
              </div>
            </div>
            <Link href="/child/rewards/" className="flex-1">
              <Button className="w-full mt-4 bg-white/20 hover:bg-white/30 text-white border-white/30 rounded-2xl h-12">
                <Gift className="w-5 h-5 mr-2" />
                ポイントを使う
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* 今週の成果 */}
        <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="w-5 h-5 text-yellow-500" />
              今週のがんばり
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-blue-50 rounded-2xl p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.task_completed}
                </div>
                <div className="text-sm text-gray-600">終わったタスク</div>
              </div>
              <div className="bg-yellow-50 rounded-2xl p-4">
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.points_earned}
                </div>
                <div className="text-sm text-gray-600">ゲットポイント</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ナビゲーション */}
      <ChildNavigation />
    </div>
  )
}
