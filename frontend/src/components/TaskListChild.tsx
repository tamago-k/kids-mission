import React, { useRef } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ClipboardCheck,
  Repeat,
  Calendar,
  PiggyBank,
  MessageCircle,
  CheckCircle,
} from "lucide-react"
import { colorThemes } from "@/components/OptionThemes"
import type { Task } from "@/types/TaskChild"

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
  onComment,
  onComplete,
}) => {
  const parentRef = useRef<HTMLDivElement | null>(null)

  const rowVirtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 180,
    overscan: 5,
  })

  const getBgClassByTheme = (themeValue?: string) => {
    const theme = colorThemes.find((t) => t.value === themeValue)
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
    <div
      ref={parentRef}
      className="relative h-[80vh] overflow-auto space-y-4"
      style={{ overflowAnchor: "none" }} 
    >
      <div
        style={{ height: rowVirtualizer.getTotalSize(), position: "relative" }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const task = tasks[virtualRow.index]

          return (
            <div
              key={task.id}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <Card
                className={`border-2 rounded-3xl transition-all relative ${
                  task.completion_status === "approved"
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200 hover:border-orange-300 bg-white/80 backdrop-blur-sm"
                }`}
              >
                {/* 完了マーク */}
                {task.completion_status === "approved" && (
                  <CheckCircle
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-300 z-10"
                    size={100}
                    strokeWidth={2.5}
                    aria-label="完了"
                  />
                )}

                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3
                        className={`font-bold text-lg ${
                          task.completion_status === "approved"
                            ? "text-green-700 line-through"
                            : "text-gray-800"
                        }`}
                      >
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {task.description}
                      </p>
                      <div className="flex items-center gap-1 text-xs mt-2">
                        <Calendar className="w-4 h-4" />
                        {task.due_date
                          ? formatDateForDisplay(task.due_date)
                          : "なし"}
                        {task.isRecurring && (
                          <Badge className="bg-purple-100 text-purple-600 text-xs">
                            <Repeat className="w-3 h-3 mr-1" />
                            {task.recurringType === "daily"
                              ? "毎日"
                              : task.recurringType === "weekly"
                              ? "毎週"
                              : task.recurringType === "monthly"
                              ? "毎月"
                              : task.recurringType === "weekdays"
                              ? "平日"
                              : task.recurringType === "weekends"
                              ? "土日"
                              : ""}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex item-center flex-col">
                      <Badge
                        className={`ml-3 text-lg px-3 py-1 ${
                          task.completion_status === "approved"
                            ? "bg-green-100 text-green-600"
                            : "bg-purple-100 text-purple-600"
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
                      onClick={() => onComment && onComment(task)}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      コメント
                    </Button>
                    {task.completion_status === "submitted" ? (
                      <Button
                        size="sm"
                        disabled
                        className="flex-1 bg-yellow-400 text-white rounded-2xl"
                      >
                        <ClipboardCheck className="w-4 h-4 mr-1" />
                        かくにん中
                      </Button>
                    ) : task.completion_status === "rejected" ? (
                      <Button
                        size="sm"
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-2xl"
                        onClick={() => onComplete && onComplete(task)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        もう一回
                      </Button>
                    ) : task.completion_status === "approved" ? (
                      <Button
                        size="sm"
                        disabled
                        className="flex-1 bg-green-500 text-white rounded-2xl"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        完了
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-2xl"
                        onClick={() => onComplete && onComplete(task)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        完了ほうこく
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}
