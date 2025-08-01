"use client"

import { useState } from "react"
import { ParentNavigation } from "@/components/navigation/ParentNavigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, ArrowLeft } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, Award, Target } from "lucide-react"

const colorThemes = {
  blue: { gradient: "from-blue-400 to-blue-600", bg: "bg-blue-100", text: "text-blue-800", color: "#3B82F6" },
  pink: { gradient: "from-pink-400 to-pink-600", bg: "bg-pink-100", text: "text-pink-800", color: "#EC4899" },
  green: { gradient: "from-green-400 to-green-600", bg: "bg-green-100", text: "text-green-800", color: "#10B981" },
  purple: { gradient: "from-purple-400 to-purple-600", bg: "bg-purple-100", text: "text-purple-800", color: "#8B5CF6" },
  orange: { gradient: "from-orange-400 to-orange-600", bg: "bg-orange-100", text: "text-orange-800", color: "#F59E0B" },
  red: { gradient: "from-red-400 to-red-600", bg: "bg-red-100", text: "text-red-800", color: "#EF4444" },
  yellow: { gradient: "from-yellow-400 to-yellow-600", bg: "bg-yellow-100", text: "text-yellow-800", color: "#F59E0B" },
  indigo: { gradient: "from-indigo-400 to-indigo-600", bg: "bg-indigo-100", text: "text-indigo-800", color: "#6366F1" },
}

const children = [
  { id: 1, name: "太郎", colorTheme: "blue", avatar: "👦"  },
  { id: 2, name: "花子", colorTheme: "pink", avatar: "👧"  },
]

export default function StatsPage() {
  const [selectedChild, setSelectedChild] = useState<number | string | null>("all");
  const [activeTab, setActiveTab] = useState<"progress" | "points">("progress")

  // サンプルデータ
  const weeklyData = [
    { day: "月", 太郎: 4, 花子: 3 },
    { day: "火", 太郎: 3, 花子: 4 },
    { day: "水", 太郎: 5, 花子: 2 },
    { day: "木", 太郎: 2, 花子: 5 },
    { day: "金", 太郎: 4, 花子: 3 },
    { day: "土", 太郎: 6, 花子: 4 },
    { day: "日", 太郎: 3, 花子: 5 },
  ]

  const pointsData = [
    { month: "1月", 太郎: 120, 花子: 80 },
    { month: "2月", 太郎: 150, 花子: 110 },
    { month: "3月", 太郎: 180, 花子: 140 },
    { month: "4月", 太郎: 200, 花子: 160 },
  ]

  const categoryData = [
    { name: "勉強", value: 40, color: colorThemes.blue.color },
    { name: "お手伝い", value: 30, color: colorThemes.green.color },
    { name: "運動", value: 20, color: colorThemes.orange.color },
    { name: "その他", value: 10, color: colorThemes.purple.color },
  ]

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
                <Users className="w-6 h-6" /> 
                レポート
              </h1>
              <p className="text-sm text-gray-600">レポート画面</p>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4 pb-24">
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

        {/* タブ */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "progress" ? "default" : "outline"}
            onClick={() => setActiveTab("progress")}
            className={`rounded-full px-4 py-2 h-auto whitespace-nowrap ${
              activeTab === "progress"
                ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white"
                : "border-2 border-gray-200 hover:border-purple-300"
            }`}
          >
            <Target className="w-4 h-4 mr-2" />
            進捗
          </Button>
          <Button
            variant={activeTab === "points" ? "default" : "outline"}
            onClick={() => setActiveTab("points")}
            className={`rounded-full px-4 py-2 h-auto whitespace-nowrap ${
              activeTab === "points"
                ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white"
                : "border-2 border-gray-200 hover:border-purple-300"
            }`}
          >
            <Award className="w-4 h-4 mr-2" />
            ポイント
          </Button>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {children.map((child) => {
            const theme = colorThemes[child.colorTheme as keyof typeof colorThemes]
            return (
              <Card key={child.id} className={`${theme.bg} border-0`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-r ${theme.gradient} flex items-center justify-center text-white font-bold`}
                    >
                      {child.name[0]}
                    </div>
                    <div>
                      <div className={`text-lg font-bold ${theme.text}`}>{child.name === "太郎" ? "150" : "89"}</div>
                      <div className="text-sm text-gray-600">今月のポイント</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {activeTab === "progress" && (
          <div className="space-y-6">
            {/* 週間進捗グラフ */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  週間タスク完了数
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    {selectedChild === "all" || selectedChild === "太郎" ? (
                      <Bar dataKey="太郎" fill={colorThemes.blue.color} />
                    ) : null}
                    {selectedChild === "all" || selectedChild === "花子" ? (
                      <Bar dataKey="花子" fill={colorThemes.pink.color} />
                    ) : null}
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* カテゴリ別円グラフ */}
            <Card>
              <CardHeader>
                <CardTitle>タスクカテゴリ別分布</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "points" && (
          <div className="space-y-6">
            {/* 月間ポイント推移 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  月間ポイント推移
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={pointsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    {selectedChild === "all" || selectedChild === "太郎" ? (
                      <Line
                        type="monotone"
                        dataKey="太郎"
                        stroke={colorThemes.blue.color}
                        strokeWidth={3}
                        dot={{ fill: colorThemes.blue.color, strokeWidth: 2, r: 6 }}
                      />
                    ) : null}
                    {selectedChild === "all" || selectedChild === "花子" ? (
                      <Line
                        type="monotone"
                        dataKey="花子"
                        stroke={colorThemes.pink.color}
                        strokeWidth={3}
                        dot={{ fill: colorThemes.pink.color, strokeWidth: 2, r: 6 }}
                      />
                    ) : null}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

          </div>
        )}
      </div>
      {/* ナビゲーション */}
      <ParentNavigation />
    </div>
  )
}
