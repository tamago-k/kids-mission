"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Calendar, PiggyBank, ChevronLeft, ChevronRight, PartyPopper } from "lucide-react"
import { ChildNavigation } from "@/components/navigation/ChildNavigation"

export default function ChildCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [myTasks, setMyTasks] = useState<Task[]>([]);

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

  type Task = {
    child: Child;
    child_id: number;
    completion_status: string | null;
    created_at: string;
    description: string;
    due_date: string;
    id: number;
    isRecurring: boolean;
    parent_id: number;
    recurrence: string;
    recurringType: string;
    reward_amount: number;
    task_category: TaskCategory;
    task_category_id: number;
    title: string;
    updated_at: string;
  };

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  const toJSTDate = (utcDateStr: string) => {
    const date = new Date(utcDateStr)
    date.setHours(date.getHours() + 9)
    return date
  }

  const fetchTasks = async (year: number, month: number) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${apiBaseUrl}/api/tasks?year=${year}&month=${month + 1}`, { 
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (!res.ok) throw new Error("タスク取得失敗")
      const data: Task[] = await res.json();
      setMyTasks(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchTasks(currentDate.getFullYear(), currentDate.getMonth())
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
    return myTasks.filter((task) => {
      const taskDate = toJSTDate(task.due_date)
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
              <p className="text-sm text-gray-600">きみのタスクをチェック！</p>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4 space-y-6 pb-24">

        <div className="flex justify-center items-center gap-2 mt-2 mb-2">
          <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")} className="rounded-full">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="text-lg font-bold text-gray-800 min-w-[120px] text-center">{formatDate(currentDate)}</div>
          <Button variant="outline" size="icon" onClick={() => navigateMonth("next")} className="rounded-full">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

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
                const hasCompletedTasks = dayTasks.some((task) => task.completion_status === "approved")
                const hasPendingTasks = dayTasks.some((task) => task.completion_status === "submitted")
                const hasNotSubmittedTasks = dayTasks.some((task) => task.completion_status === null)

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
                      day ? `hover:bg-orange-50 hover:scale-105 ${dayTasks.length > 0 ? "hover:shadow-md" : ""}` : ""
                    } ${isToday ? "ring-2 ring-blue-400 ring-offset-2" : ""}`}
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
                              {hasNotSubmittedTasks && <div className="w-2 h-2 bg-gray-400 rounded-full" />}
                            </div>
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
        <DialogContent className="rounded-3xl max-w-md max-h-[80vh] overflow-y-auto pt-10">
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
                <div className="text-4xl mb-2"><PartyPopper className="w-10 h-10" /></div>
                <p className="text-gray-600">この日はタスクがないよ！</p>
                <p className="text-sm text-gray-500 mt-1">ゆっくり休んでね</p>
              </div>
            ) : (
              getTasksForSelectedDate().map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border-2 ${
                  task.completion_status === "approved"
                    ? "border-green-200 bg-green-50"
                    : task.completion_status === "submitted"
                    ? "border-orange-200 bg-orange-50"
                    : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className={`font-bold text-gray-800 ${task.completion_status === "approved" ? "line-through" : ""}`}>
                          {task.title}
                        </h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={
                        task.completion_status === "approved"
                          ? "bg-green-100 text-green-600"
                          : task.completion_status === "submitted"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-gray-100"
                        }
                      >
                      {task.completion_status === "approved"
                        ? "かんりょう"
                        : task.completion_status === "submitted"
                        ? "かくにん中"
                        : "がんばろう！"}
                      </Badge>
                      <div>
                      <Badge className="mt-1 text-xs px-3 bg-purple-100 text-purple-600">
                        <PiggyBank className="w-4 h-4 mr-2" /> {task.reward_amount}P
                      </Badge>
                      </div>
                    </div>
                  </div>
                  {task.completion_status !== "submitted" && task.completion_status !== "approved" && (
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

      {/* ナビゲーション */}
      <ChildNavigation />
    </div>
  )
}
