import React, { useRef, useLayoutEffect } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ClipboardCheck, Repeat,  Calendar, PiggyBank, MessageCircle, Edit, Trash2, CheckCircle, XCircle } from "lucide-react"
import { colorThemes, iconOptions } from "@/components/OptionThemes"
import type { Task } from "@/types/TaskParent"


interface TaskListParentProps {
  tasks: Task[]
  onEdit?: (task: Task) => void
  onDelete?: (task: Task) => void
  onComment?: (task: Task) => void
  onApprove?: (task: Task) => void
  onReject?: (task: Task) => void
  allowEdit?: boolean
}

export const TaskListParent: React.FC<TaskListParentProps> = ({
  tasks,
  onEdit,
  onDelete,
  onComment,
  onApprove,
  onReject,
  allowEdit = true,
}) => {
  const parentRef = useRef<HTMLDivElement | null>(null)

  const virtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 180,
    overscan: 5,
  })

  const [, forceUpdate] = React.useState({})

  const measureRefs = useRef<(HTMLDivElement | null)[]>([])

  const getBgClassByTheme = (themeValue?: string) => {
    const theme = colorThemes.find((t) => t.value === themeValue)
    return theme ? theme.gradient : "bg-gray-500"
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

  useLayoutEffect(() => {
    measureRefs.current = measureRefs.current.slice(0, tasks.length)
    const id = setTimeout(() => {
      measureRefs.current.forEach((el, i) => {
        if (el) {
          console.log(`Measuring element index ${i}`, el.getBoundingClientRect().height)
          virtualizer.measureElement(el)
        }
      })
      forceUpdate({})
    }, 50)
    return () => clearTimeout(id)
  }, [tasks])

  return (
    <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ClipboardCheck className="w-6 h-6" />
          タスク一覧
        </CardTitle>
      </CardHeader>
      <CardContent
        ref={parentRef}
        className="relative h-[80vh] overflow-auto"
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            position: "relative",
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const task = tasks[virtualRow.index]
            const iconObj = task.child
              ? iconOptions.find((icon) => icon.id === task.child.avatar)
              : null

            return (
              <div
                key={task.id}
                data-index={virtualRow.index}
                ref={el => {
                  measureRefs.current[virtualRow.index] = el
                }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <Card className="border border-gray-200 rounded-2xl mb-6">
                  <CardContent className="p-4">
                    <div className="flex gap-2 justify-between">
                      <div className="text-sm text-gray-500">
                        <div
                          className={`flex items-center gap-1 rounded-2xl p-1 pr-3 pl-3 bg-gradient-to-r text-white ${getBgClassByTheme(
                            task.child?.theme
                          )}`}
                        >
                          {iconObj ? <iconObj.Icon /> : ""}
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
                    <h3 className="font-medium text-gray-800 mt-3 font-bold">
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                      {task.description}
                    </p>
                    <div className="flex items-center gap-2 mt-4">
                      <div className="flex items-center gap-1 text-xs">
                        <Calendar className="w-4 h-4" />
                        {task.due_date
                          ? formatDateForDisplay(task.due_date)
                          : "なし"}
                      </div>
                      {task.completion_status === "approved" && (
                        <div className="flex items-center gap-1 mr-2 text-xs text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          {formatDateForDisplay(task.updated_at)}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
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
                    </div>
                    {task.completion_status === "submitted" && (
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl"
                          onClick={() => onApprove && onApprove(task)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          承認
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-red-200 text-red-600 hover:bg-red-50 rounded-xl bg-transparent"
                          onClick={() => onReject && onReject(task)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          却下
                        </Button>
                      </div>
                    )}
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-2xl border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                        onClick={() => onComment && onComment(task)}
                      >
                        <MessageCircle className="w-4 h-4" /> {task.comments_count ?? 0}
                      </Button>
                      {allowEdit && task.completion_status !== "approved" &&
                        task.completion_status !== "submitted" && (
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
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
