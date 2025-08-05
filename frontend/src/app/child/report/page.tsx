"use client"

//未実装

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Star, Target, TrendingUp, Award, ArrowLeft } from "lucide-react"
import { ChildNavigation } from "@/components/navigation/ChildNavigation"

export default function ChildStatsPage() {
  const [timeRange, setTimeRange] = useState("week")

  // 太郎のデータ例
  const weeklyData = [
    { day: "月", approved: 3 },
    { day: "火", approved: 2 },
    { day: "水", approved: 4 },
    { day: "木", approved: 3 },
    { day: "金", approved: 5 },
    { day: "土", approved: 2 },
    { day: "日", approved: 1 },
  ]

  const pointsData = [
    { day: "月", points: 120 },
    { day: "火", points: 80 },
    { day: "水", points: 200 },
    { day: "木", points: 150 },
    { day: "金", points: 250 },
    { day: "土", points: 100 },
    { day: "日", points: 50 },
  ]

  const achievements = [
    { title: "連続達成マスタ", description: "5日連続でタスクを完了", emoji: "🔥", earned: true },
    { title: "ポイントコレクター", description: "1000ポイント獲得", emoji: "💰", earned: true },
    { title: "宿題キング", description: "宿題を10回連続完了", emoji: "📚", earned: false },
    { title: "お手伝いヒーロー", description: "お手伝いを20回完了", emoji: "🦸", earned: false },
  ]

  const myStats = {
    totalCompleted: 89,
    totalPoints: 1450,
    currentStreak: 5,
    completionRate: 88,
    weeklyGoal: 20,
    weeklyCompleted: 18,
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
                <Award className="w-6 h-6" /> 
                きみのせいせき
              </h1>
              <p className="text-sm text-gray-600">がんばりがみえるよ！</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={timeRange === "week" ? "outline" : "default"}
                size="sm"
                onClick={() => setTimeRange("week")}
                className="rounded-2xl"
              >
                今週
              </Button>
              <Button
                variant={timeRange === "month" ? "outline" : "default"}
                size="sm"
                onClick={() => setTimeRange("month")}
                className="rounded-2xl"
              >
                今月
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4 space-y-6 pb-24">
        {/* 成績サマリー */}
        <Card className="border-0 shadow-lg rounded-3xl bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold mb-1">🌟 きみの成長</h2>
                <div className="text-4xl font-bold">{myStats.completionRate}%</div>
                <p className="text-yellow-100 text-sm">今週もよくがんばったね！</p>
              </div>
              <div className="text-6xl opacity-20">🎯</div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/20 rounded-2xl p-3 text-center">
                <div className="text-2xl font-bold">{myStats.completionRate}%</div>
                <div className="text-sm text-yellow-100">完了率</div>
              </div>
              <div className="bg-white/20 rounded-2xl p-3 text-center">
                <div className="text-2xl font-bold">{myStats.currentStreak}</div>
                <div className="text-sm text-yellow-100">連続達成</div>
              </div>
              <div className="bg-white/20 rounded-2xl p-3 text-center">
                <div className="text-2xl font-bold">{myStats.totalPoints}</div>
                <div className="text-sm text-yellow-100">総ポイント</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 今週の目標 */}
        <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              今週の目標
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-700">タスク完了</span>
              <span className="font-bold text-gray-800">
                {myStats.weeklyCompleted}/{myStats.weeklyGoal}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
              <div
                className="bg-gradient-to-r from-blue-400 to-purple-400 h-3 rounded-full transition-all"
                style={{ width: `${(myStats.weeklyCompleted / myStats.weeklyGoal) * 100}%` }}
              ></div>
            </div>
            <div className="text-center">
              <Badge className="bg-blue-100 text-blue-600">
                あと{myStats.weeklyGoal - myStats.weeklyCompleted}個でクリア！
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* 今週のがんばり */}
        <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              今週のがんばり
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="approved" fill="#10B981" name="完了" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* ポイント獲得グラフ */}
        <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              ポイント獲得
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={pointsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="points" stroke="#F59E0B" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 実績・バッジ */}
        <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-500" />
              実績・バッジ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-2xl border-2 text-center ${
                    achievement.earned ? "border-yellow-200 bg-yellow-50" : "border-gray-200 bg-gray-50 opacity-60"
                  }`}
                >
                  <div className="text-3xl mb-2">{achievement.emoji}</div>
                  <h3 className="font-bold text-sm text-gray-800 mb-1">{achievement.title}</h3>
                  <p className="text-xs text-gray-600">{achievement.description}</p>
                  {achievement.earned && <Badge className="mt-2 bg-yellow-100 text-yellow-600 text-xs">獲得済み</Badge>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ナビゲーション */}
      <ChildNavigation />
    </div>
  )
}
