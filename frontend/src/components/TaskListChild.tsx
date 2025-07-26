import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ClipboardCheck, Repeat,  Calendar, PiggyBank, MessageCircle, CheckCircle } from "lucide-react"
import { colorThemes, iconOptions } from "@/components/OptionThemes"

interface Task {
  id: number
  title: string
  description?: string | null
  status: string
  completed_at?: string | null
  reward_amount: number | null
  due_date?: string | null
  child?: {
    name: string
    avatar: string
    theme?: string
  } | null
  isRecurring?: boolean
  recurringType?: "daily" | "weekly" | "monthly"
  task_category?: {
    id: number
    name: string
    slug: string
  } | null
}

interface TaskListParentProps {
  tasks: Task[]
  onEdit?: (task: Task) => void
  onDelete?: (task: Task) => void
  onComment?: (task: Task) => void
  onComplete?: (task: Task) => void
  allowEdit?: boolean
}

export const TaskListChild: React.FC<TaskListParentProps> = ({
  tasks,
  onEdit,
  onComment,
  onComplete,
  allowEdit = true,
}) => {
  const getBgClassByTheme = (themeValue?: string) => {
    const theme = colorThemes.find(t => t.value === themeValue)
    return theme ? theme.gradient : "bg-gray-100"
  }

  const formatDateForDisplay = (input?: string | null) => {
    if (!input) return ""
    const date = new Date(input)
    if (isNaN(date.getTime())) return ""
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, "0")
    const dd = String(date.getDate()).padStart(2, "0")
    return `${yyyy}/${mm}/${dd}`
  }

  return (
    <div className="space-y-4">
      {tasks.length === 0 && (
        <div className="text-center text-gray-600">タスクはありません</div>
      )}
      {tasks.map((task) => (
        <Card
          key={task.id}
          className={`border-2 rounded-3xl transition-all ${
            task.completion_status === "approved"
              ? "border-green-200 bg-green-50"
              : "border-gray-200 hover:border-orange-300 bg-white/80 backdrop-blur-sm"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3
                  className={`font-bold text-lg ${
                    task.completion_status === "approved" ? "text-green-700 line-through" : "text-gray-800"
                  }`}
                >
                  {task.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                <div className="flex items-center gap-1 text-xs mt-2">
                  <Calendar className="w-4 h-4" />
                  {task.due_date ? formatDateForDisplay(task.due_date) : "なし"}
                </div>
              </div>
              <div className="flex item-center flex-col">
                <Badge
                  className={`ml-3 text-lg px-3 py-1 ${
                    task.completion_status === "approved" ? "bg-green-100 text-green-600" : "bg-purple-100 text-purple-600"
                  }`}
                >
                  <PiggyBank className="w-4 h-4 mr-2" />
                  {task.reward_amount}P
                </Badge>
                {task.task_category?.name && (
                  <Badge className="ml-3 text-lg px-3 py-1 bg-yellow-100 text-yellow-600 text-center mt-1 justify-center">
                    {task.task_category?.name}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-2xl border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                onClick={() => onComment(task)}
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                コメント
              </Button>
              {
                task.completion_status === 'pending' ? (
                  <Button size="sm" disabled className="flex-1 bg-yellow-400 text-white rounded-2xl">
                    <ClipboardCheck className="w-4 h-4 mr-1" />
                    申請中
                  </Button>
                ) : task.completion_status === 'rejected' ? (
                  <Button
                    size="sm"
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-2xl"
                    onClick={() => onComplete(task)} // 再申請
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    再申請
                  </Button>
                ) : task.completion_status === 'approved' ? (
                  <Button size="sm" disabled className="flex-1 bg-green-500 text-white rounded-2xl">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    完了済み
                  </Button>
                ) : (
                  // 申請レコードがない（未申請）の場合
                  <Button
                    size="sm"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-2xl"
                    onClick={() => onComplete(task)}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    完了申請
                  </Button>
                )
              }
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}