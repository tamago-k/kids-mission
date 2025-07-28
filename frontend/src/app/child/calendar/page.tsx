"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Calendar, Clock } from "lucide-react"
import { ChildNavigation } from "@/components/navigation/ChildNavigation"

export default function ChildCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 15)) // 2025年1月15日
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 太郎のタスクデータ例
  const myTasks = [
    {
      id: 1,
      title: "算数の宿題",
      date: new Date(2024, 0, 15),
      status: "approved",
      reward: 100,
      time: "18:00",
      emoji: "📚",
    },
    {
      id: 2,
      title: "お手伝い（食器洗い）",
      date: new Date(2024, 0, 15),
      status: "submitted",
      reward: 50,
      time: "20:00",
      emoji: "🍽️",
    },
    {
      id: 3,
      title: "理科レポート",
      date: new Date(2024, 0, 16),
      status: "submitted",
      reward: 150,
      time: "17:00",
      emoji: "🔬",
    },
    {
      id: 4,
      title: "漢字練習",
      date: new Date(2024, 0, 17),
      status: "submitted",
      reward: 80,
      time: "19:00",
      emoji: "✏️",
    },
    {
      id: 5,
      title: "読書感想文",
      date: new Date(2024, 0, 18),
      status: "submitted",
      reward: 120,
      time: "16:00",
      emoji: "📖",
    },
  ]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // 前月の日付を埋める
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // 当月の日付
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const getTasksForDate = (date: Date | null) => {
    if (!date) return []
    return myTasks.filter((task) => {
      const taskDate = task.date
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const getTasksForSelectedDate = () => {
    return selectedDate ? getTasksForDate(selectedDate) : []
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月`
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setIsModalOpen(true)
  }

  const days = getDaysInMonth(currentDate)
  const weekDays = ["日", "月", "火", "水", "木", "金", "土"]

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
                <Calendar className="w-6 h-6" /> 
                おしらせ
              </h1>
              <p className="text-sm text-gray-600">きみのタスクをチェック！</p>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4 space-y-6 pb-24">


        {/* 使い方の説明 */}
        <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">💡</div>
            <p className="text-gray-600 text-sm">📅 タスクがある日をタップすると詳細が見れるよ！</p>
          </CardContent>
        </Card>
        {/* カレンダーグリッド */}
        <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            {/* 曜日ヘッダー */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-sm font-bold text-gray-700 p-2">
                  {day}
                </div>
              ))}
            </div>

            {/* 日付グリッド */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const dayTasks = getTasksForDate(day)
                const hasCompletedTasks = dayTasks.some((task) => task.status === "approved")
                const hasPendingTasks = dayTasks.some((task) => task.status === "submitted")

                return (
                  <div
                    key={index}
                    className={`aspect-square p-1 rounded-2xl cursor-pointer transition-all ${
                      day ? `hover:bg-orange-50 hover:scale-105 ${dayTasks.length > 0 ? "hover:shadow-md" : ""}` : ""
                    }`}
                    onClick={() => day && dayTasks.length > 0 && handleDateClick(day)}
                  >
                    {day && (
                      <div className="h-full flex flex-col">
                        <div className="text-sm font-bold text-gray-800 text-center mb-1">{day.getDate()}</div>
                        <div className="flex-1 flex flex-col gap-1 items-center">
                          {dayTasks.length > 0 && (
                            <div className="flex gap-1">
                              {hasCompletedTasks && <div className="w-2 h-2 bg-green-400 rounded-full"></div>}
                              {hasPendingTasks && <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>}
                            </div>
                          )}
                          {dayTasks.length > 0 && (
                            <div className="text-xs text-gray-600 font-bold">{dayTasks.length}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 日付詳細モーダル */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="rounded-3xl max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                {selectedDate && `${selectedDate.getMonth() + 1}月${selectedDate.getDate()}日のタスク`}
              </div>
              <Badge className="bg-orange-100 text-orange-600">{getTasksForSelectedDate().length}個</Badge>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {getTasksForSelectedDate().length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🎉</div>
                <p className="text-gray-600">この日はタスクがないよ！</p>
                <p className="text-sm text-gray-500 mt-1">ゆっくり休んでね</p>
              </div>
            ) : (
              getTasksForSelectedDate().map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border-2 ${
                    task.status === "approved" ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{task.emoji}</div>
                      <div>
                        <h3 className={`font-bold text-gray-800 ${task.status === "approved" ? "line-through" : ""}`}>
                          {task.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-3 h-3" />
                          {task.time}まで
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={
                          task.status === "approved" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                        }
                      >
                        {task.status === "approved" ? "✅ 完了" : "⏳ がんばろう"}
                      </Badge>
                      <div className="text-sm text-gray-600 mt-1 font-bold">💰 {task.reward}P</div>
                    </div>
                  </div>
                  {task.status === "submitted" && (
                    <Link href="/child/tasks/" className="flex-1">
                      <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-2xl">
                        タスクページへ
                      </Button>
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ChildNavigation />
    </div>
  )
}
