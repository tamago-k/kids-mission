"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, Calendar, PiggyBank, ArrowLeft } from "lucide-react"
import { ParentNavigation } from "@/components/navigation/ParentNavigation"
import { colorThemes, iconOptions } from "@/components/OptionThemes"

export default function ParentCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedChild, _setSelectedChild] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tasks, setTasks] = useState<CalendarTask[]>([])
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  type Child = {
    avatar: string;
    created_at: string;
    id: number;
    name: string;
    role: string;
    theme: string;
    updated_at: string;
  };

  type TaskCategory = {
    created_at: string;
    id: number;
    name: string;
    slug: string;
    updated_at: string;
  };

  type Submission = {
    created_at: string;
    id: number;
    status: string;
    submitted_at: string;
    task_id: number;
    updated_at: string;
    user_id: number;
  };

  type Task = {
    child: Child;
    child_id: number;
    completion_status: string;
    created_at: string;
    description: string;
    due_date: string;
    id: number;
    isRecurring: boolean;
    latest_submission: Submission | null;
    parent_id: number;
    recurrence: string;
    recurringType: string;
    reward_amount: number;
    task_category: TaskCategory;
    task_category_id: number;
    title: string;
    updated_at: string;
  };

  type CalendarTask = {
    id: number;
    title: string;
    date: Date;
    child: Child;
    childId: string;
    childName: string;
    status: string;
    reward: number;
    time: string;
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(
          `${apiBaseUrl}/api/calendar-tasks?year=${currentDate.getFullYear()}&month=${currentDate.getMonth() + 1}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
          },
         }
        )
        if (!res.ok) throw new Error("タスク取得失敗")
        const data = await res.json()
        const parsed: CalendarTask[] = data.map((task: Task) => ({
          id: task.id,
          title: task.title,
          date: new Date(task.due_date),
          child: task.child,
          childId: String(task.child_id),
          childName: task.child?.name || "未設定",
          status: task.completion_status ?? "none",
          reward: task.reward_amount ?? 0,
          time: task.latest_submission?.submitted_at
            ? new Date(task.latest_submission.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : "未提出",
        }));
        setTasks(parsed)
      } catch (e) {
        console.error("取得エラー", e)
      }
    }

    fetchTasks()
  }, [currentDate, apiBaseUrl])

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
      const taskDate = task.date;
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

  const getBgClassByTheme = (themeValue?: string) => {
    const theme = colorThemes.find(t => t.value === themeValue)
    return theme ? theme.gradient : "bg-gray-100"
  }

  const days = getDaysInMonth(currentDate)
  const weekDays = ["日", "月", "火", "水", "木", "金", "土"]

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
                <Calendar className="w-6 h-6" /> 
                カレンダー
              </h1>
              <p className="text-sm text-gray-600">タスクの予定を確認</p>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4 pb-24">
        
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
                const hasNotSubmittedTasks = dayTasks.some((task) => task.status === "none")

                const today = new Date();
                const isToday =
                  day &&
                  day.getDate() === today.getDate() &&
                  day.getMonth() === today.getMonth() &&
                  day.getFullYear() === today.getFullYear();

                return (
                  <div
                    key={index}
                    className={`aspect-square p-1 rounded-2xl cursor-pointer transition-all ${
                      day ? `hover:bg-purple-50 hover:scale-105 ${dayTasks.length > 0 ? "hover:shadow-md" : ""}` : ""
                    } ${isToday ? "ring-2 ring-blue-400 ring-offset-2" : ""}`}
                    onClick={() => day && dayTasks.length > 0 && handleDateClick(day)}
                  >
                    {day && (
                      <div className="h-full flex flex-col">
                        <div className="text-sm font-medium text-gray-800 text-center mb-1">{day.getDate()}</div>
                        <div className="flex-1 flex flex-col gap-1">
                          {hasCompletedTasks && <div className="w-full h-1 bg-green-400 rounded-full"></div>}
                          {hasPendingTasks && <div className="w-full h-1 bg-yellow-400 rounded-full"></div>}
                          {hasNotSubmittedTasks && <div className="w-full h-1 bg-gray-400 rounded-full"></div>}
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
        <DialogContent className="rounded-3xl max-w-md max-h-[80vh] overflow-y-auto pt-10">
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
              getTasksForSelectedDate().map((task) => {
                  const childInfo = task.child;
                  const iconObj = childInfo ? iconOptions.find(icon => icon.id === childInfo.avatar) : null;
                return (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
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
                    <div className="text-right">
                      <Badge
                        className={
                          task.status === "approved"
                            ? "bg-green-100 text-green-600"
                            : task.status === "overdue"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-gray-100"
                        }
                      >
                        {task.status === "approved" ? "完了" : task.status === "submitted" ? "申請中" : "進行中"}
                      </Badge>
                      <div className="text-sm text-gray-600 mt-1">
                        <Badge className="mt-1 text-xs px-3 bg-purple-100 text-purple-600">
                          <PiggyBank className="w-4 h-4 mr-2" /> {task.reward}P
                        </Badge>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ナビゲーション */}
      <ParentNavigation />
    </div>
  )
}
