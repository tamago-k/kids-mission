"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PiggyBank, ClipboardCheck, Star, CheckCircle, Gift, ThumbsUp } from "lucide-react"
import { ChildNavigation } from "@/components/navigation/ChildNavigation"

export default function ChildDashboard() {
  const [todayTasks, setTodayTasks] = useState<any[]>([])
  const [currentBalance, setCurrentBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  // 役割チェック + データ取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ユーザーロール確認
        const resUser = await fetch(`${apiBaseUrl}/api/user`, { credentials: "include" })
        if (!resUser.ok) {
          router.push("/")
          return
        }
        const user = await resUser.json()
        if (user.role !== "child") {
          router.push("/")
          return
        }

        // 今日のタスク取得
        const resTasks = await fetch(`${apiBaseUrl}/api/tasks/today`, { credentials: "include" })
        if (!resTasks.ok) throw new Error("タスク取得失敗")
        const tasksData = await resTasks.json()
      console.log(tasksData);

        // ポイント残高取得
        const resBalance = await fetch(`${apiBaseUrl}/api/reward-balance`, { credentials: "include" })
        if (!resBalance.ok) throw new Error("残高取得失敗")
        const balanceData = await resBalance.json()

        setTodayTasks(tasksData)
        setCurrentBalance(balanceData.balance)
        setLoading(false)
      } catch (error) {
        console.error(error)
        router.push("/")
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">読み込み中...</div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 max-w-xl mx-auto">
      {/* ヘッダー */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-2xl">
                👦
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">今日もがんばろう！</h1>
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

        {/* 報酬残高カード */}
        <Card className="border-0 shadow-lg rounded-3xl bg-gradient-to-r from-purple-400 to-pink-400 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold flex gap-1 items-center">
                  <PiggyBank className="w-6 h-6" />
                  ポイント残高
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
              今週の成果
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 rounded-2xl p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {/* ここはAPIで取得したデータに差し替えてください */}
                  8
                </div>
                <div className="text-sm text-gray-600">完了タスク</div>
              </div>
              <div className="bg-yellow-50 rounded-2xl p-4">
                <div className="text-2xl font-bold text-yellow-600">
                  {/* ここはAPIで取得したデータに差し替えてください */}
                  680
                </div>
                <div className="text-sm text-gray-600">獲得ポイント</div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {/* ここはAPIで取得したデータに差し替えてください */}
                  5
                </div>
                <div className="text-sm text-gray-600">連続達成日</div>
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
