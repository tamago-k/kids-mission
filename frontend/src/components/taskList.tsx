import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ClipboardCheck, Repeat,  Calendar, PiggyBank, MessageCircle, Edit, Trash2 } from "lucide-react"
import { colorThemes, iconOptions } from "@/components/optionThemes"

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

interface TaskListProps {
  tasks: Task[]
  onEdit?: (task: Task) => void
  onDelete?: (task: Task) => void
  onComment?: (task: Task) => void
  allowEdit?: boolean
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEdit,
  onDelete,
  onComment,
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
    <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ClipboardCheck className="w-6 h-6" />
          タスク一覧
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.map(task => {
          const iconObj = task.child ? iconOptions.find(icon => icon.id === task.child.avatar) : null

          return (
            <Card key={task.id} className="border border-gray-200 rounded-2xl mb-6">
              <CardContent className="p-4">
                <div className="flex gap-2 justify-between">
                  <div className="text-sm text-gray-500">
                    <div className={`flex items-center gap-1 rounded-2xl p-1 pr-3 pl-3 bg-gradient-to-r text-white ${getBgClassByTheme(
                      task.child?.theme
                    )}`}>
                      {iconObj ? <iconObj.Icon /> : "未設定"}
                      {task.child?.name || "未設定"}
                    </div>
                  </div>
                  <div className="flex item-center flex-col">
                  <Badge className="bg-purple-100 text-purple-600">
                    <PiggyBank className="w-4 h-4 mr-2" />
                    {task.reward_amount}P
                  </Badge>
                  {task.task_category?.name && (
                    <Badge className="bg-yellow-100 text-yellow-600 text-xs text-center mt-1 justify-center">
                      {task.task_category?.name}
                    </Badge>
                  )}
                  </div>
                </div>
                <h3 className="font-medium text-gray-800 mt-3">{task.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{task.description}</p>
                <div className="flex gap-2 mt-4">
                  <div className="flex items-center gap-1 text-xs">
                    <Calendar className="w-4 h-4" />
                    {task.due_date ? formatDateForDisplay(task.due_date) : "なし"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {task.isRecurring && (
                        <Badge className="bg-purple-100 text-purple-600 text-xs">
                          <Repeat className="w-3 h-3 mr-1" />
                          {task.recurringType === "daily"
                            ? "毎日"
                            : task.recurringType === "weekly"
                            ? "毎週"
                            : "毎月"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-2xl border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                    onClick={() => onComment && onComment(task)}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                  {allowEdit && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                        onClick={() => onEdit && onEdit(task)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-xl border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                        onClick={() => onDelete && onDelete(task)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </CardContent>
    </Card>
  )
}
