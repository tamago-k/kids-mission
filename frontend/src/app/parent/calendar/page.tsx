"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, Calendar, Clock, User, ArrowLeft } from "lucide-react"
import { ParentNavigation } from "@/components/navigation/ParentNavigation"

export default function ParentCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 15))
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedChild, setSelectedChild] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const children = [
    { id: "taro", name: "太郎", avatar: "👦", color: "bg-blue-100 text-blue-600" },
    { id: "hanako", name: "花子", avatar: "👧", color: "bg-pink-100 text-pink-600" },
  ]

  // カレンダー用のタスクデータ
  const tasks = [
    {
      id: 1,
      title: "算数の宿題",
      date: new Date(2025, 0, 15),
      childId: "taro",
      childName: "太郎",
      status: "approved",
      reward: 100,
      time: "18:00",
    },
    {
      id: 2,
      title: "漢字練習",
      date: new Date(2025, 0, 15),
      childId: "hanako",
      childName: "花子",
      status: "submitted",
      reward: 80,
      time: "19:00",
    },
    {
      id: 3,
      title: "理科レポート",
      date: new Date(2025, 0, 16),
      childId: "taro",
      childName: "太郎",
      status: "submitted",
      reward: 150,
      time: "17:00",
    },
    {
      id: 4,
      title: "お手伝い",
      date: new Date(2025, 0, 17),
      childId: "hanako",
      childName: "花子",
      status: "approved",
      reward: 50,
      time: "20:00",
    },
    {
      id: 5,
      title: "読書感想文",
      date: new Date(2025, 0, 18),
      childId: "taro",
      childName: "太郎",
      status: "overdue",
      reward: 120,
      time: "16:00",
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
    return tasks.filter((task) => {
      const taskDate = task.date
      const isSameDate =
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      const matchesChild = selectedChild === "all" || task.childId === selectedChild
      return isSameDate && matchesChild
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
                カレンダー
              </h1>
              <p className="text-sm text-gray-600">タスクの予定を確認</p>
            </div>
          </div>
          {/* 子ども選択 */}
          <div className="flex gap-2 overflow-x-auto mt-2">
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
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4 pb-24">
        {/* 凡例 */}
        <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-600">完了</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-gray-600">進行中</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-2 bg-red-400 rounded-full"></div>
                <span className="text-gray-600">期限切れ</span>
              </div>
            </div>
            <div className="text-center mt-2 text-xs text-gray-500">📅 タスクがある日付をタップして詳細を確認</div>
          </CardContent>
        </Card>
        
        {/* カレンダーグリッド */}
        <div className="flex justify-center items-center gap-2 mt-2 mb-2">
          <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")} className="rounded-full">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="text-lg font-bold text-gray-800 min-w-[120px] text-center">{formatDate(currentDate)}</div>
          <Button variant="outline" size="icon" onClick={() => navigateMonth("next")} className="rounded-full">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm mb-6">
          <CardContent className="p-4">
            {/* 曜日ヘッダー */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-600 p-2">
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
                const hasOverdueTasks = dayTasks.some((task) => task.status === "overdue")

                return (
                  <div
                    key={index}
                    className={`aspect-square p-1 rounded-2xl cursor-pointer transition-all ${
                      day ? `hover:bg-purple-50 hover:scale-105 ${dayTasks.length > 0 ? "hover:shadow-md" : ""}` : ""
                    }`}
                    onClick={() => day && dayTasks.length > 0 && handleDateClick(day)}
                  >
                    {day && (
                      <div className="h-full flex flex-col">
                        <div className="text-sm font-medium text-gray-800 text-center mb-1">{day.getDate()}</div>
                        <div className="flex-1 flex flex-col gap-1">
                          {hasOverdueTasks && <div className="w-full h-1 bg-red-400 rounded-full"></div>}
                          {hasPendingTasks && <div className="w-full h-1 bg-yellow-400 rounded-full"></div>}
                          {hasCompletedTasks && <div className="w-full h-1 bg-green-400 rounded-full"></div>}
                          {dayTasks.length > 0 && (
                            <div className="text-xs text-center text-gray-600 font-bold mt-1">{dayTasks.length}</div>
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
                <Calendar className="w-5 h-5 text-blue-500" />
                {selectedDate && `${selectedDate.getMonth() + 1}月${selectedDate.getDate()}日のタスク`}
              </div>
              <Badge className="bg-blue-100 text-blue-600">{getTasksForSelectedDate().length}件</Badge>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {getTasksForSelectedDate().length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📅</div>
                <p className="text-gray-600">この日にタスクはありません</p>
              </div>
            ) : (
              getTasksForSelectedDate().map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      {children.find((c) => c.id === task.childId)?.avatar}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{task.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-3 h-3" />
                        {task.childName}
                        <Clock className="w-3 h-3 ml-2" />
                        {task.time}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      className={
                        task.status === "approved"
                          ? "bg-green-100 text-green-600"
                          : task.status === "overdue"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-600"
                      }
                    >
                      {task.status === "approved" ? "✅ 完了" : task.status === "overdue" ? "⚠️ 期限切れ" : "⏳ 進行中"}
                    </Badge>
                    <div className="text-sm text-gray-600 mt-1">{task.reward}P</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ParentNavigation />
    </div>
  )
}
