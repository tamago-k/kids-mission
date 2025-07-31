"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskListParent } from "@/components/TaskListParent"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, Repeat, ClipboardCheck, TriangleAlert, Ban, ArrowLeft } from "lucide-react"
import { ParentNavigation } from "@/components/navigation/ParentNavigation"
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { TaskCommentModal } from "@/components/TaskCommentModal"

const weekDays = [
  { id: "sunday", label: "日" },
  { id: "monday", label: "月" },
  { id: "tuesday", label: "火" },
  { id: "wednesday", label: "水" },
  { id: "thursday", label: "木" },
  { id: "friday", label: "金" },
  { id: "saturday", label: "土" },
]

export default function ParentTasksPage() {
  const user = useCurrentUser();

  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [deleteTaskOpen, setDeleteTaskOpen] = useState(false)
  const [commentDialogOpen, setCommentDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [_newComment, setNewComment] = useState<string>("")
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [taskReward, setTaskReward] = useState("")
  const [taskDeadline, setTaskDeadline] = useState("")
  const [assignedChild, setAssignedChild] = useState("")
  const [assignedTaskCategory, setAssignedTaskCategory] = useState("")
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringType, setRecurringType] = useState("")
  const [recurringDays, setRecurringDays] = useState<string[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [children, setChildren] = useState<{id: string; name: string; avatar: string}[]>([])
  const [taskCategories, setTaskCategories] = useState<{id: string; name: string; slug: string}[]>([])
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Task | null>(null);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  type Task = {
    id: number
    title: string
    description: string
    due_date: string
    reward_amount: number
    child_id: number
    parent_id: number
    task_category_id: number
    recurrence: string | null
    recurringType?: string
    isRecurring?: boolean
    completion_status: "none" | "submitted" | "approved" | "rejected" | null
    created_at: string
    updated_at: string
    recurringDays?: string[]  

    child: {
      id: number
      name: string
      avatar: string
      role: string
      theme: string
      created_at: string
      updated_at: string
    }

    task_category: {
      id: number
      name: string
      slug: string
      created_at: string
      updated_at: string
    }

    latest_submission?: {
      id: number
      task_id: number
      user_id: number
      submitted_at: string
      status: "submitted" | "approved" | "rejected"
      created_at: string
      updated_at: string
    } | null
  }

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${apiBaseUrl}/api/tasks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      alert("タスク取得に失敗しました");
      return;
    }
    const data = await res.json();
    setTasks(data);
  };
  
  useEffect(() => {
    const fetchChildren = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiBaseUrl}/api/children`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        alert("子アカウント取得に失敗しました")
        return
      }
      const data = await res.json()
      setChildren(data)
    }

    const fetchTaskCategories = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiBaseUrl}/api/task-categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        alert("タスク取得に失敗しました")
        return
      }
      const data = await res.json()

      setTaskCategories(data)
    }

    fetchChildren()
    fetchTasks()
    fetchTaskCategories()
  }, [apiBaseUrl])

  const dayToNumber = (dayId: string) => {
    switch (dayId) {
      case "sunday": return 0
      case "monday": return 1
      case "tuesday": return 2
      case "wednesday": return 3
      case "thursday": return 4
      case "friday": return 5
      case "saturday": return 6
      default: return null
    }
  }

  const resetForm = () => {
    setTaskTitle("")
    setTaskDescription("")
    setTaskReward("")
    setTaskDeadline("")
    setAssignedChild("")
    setAssignedTaskCategory("")
    setIsRecurring(false)
    setRecurringType("")
    setRecurringDays([])
    setSelectedTask(null)
  }

  const openEditDialog = (task: Task) => {
    setSelectedTask(task)
    setTaskTitle(task.title)
    setTaskDescription(task.description)
    setTaskReward(String(task.reward_amount || ""))
    setTaskDeadline(formatForInputDateTimeLocal(task.due_date))
    setAssignedChild(String(task.child_id))
    setIsRecurring(Boolean(task.recurrence))
    setRecurringType(task.recurrence || "")
    setRecurringDays(task.recurringDays ?? [])
    setAssignedTaskCategory(String(task.task_category_id))
    setTaskModalOpen(true)
  }

  const handleCreateTask = async () => {
    if (!(taskTitle && taskDescription && taskReward && taskDeadline && assignedChild && assignedTaskCategory)) return

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiBaseUrl}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: taskTitle,
          description: taskDescription,
          reward_amount: Number(taskReward),
          due_date: taskDeadline,
          child_id: assignedChild,
          task_category_id: assignedTaskCategory,
          recurrence: isRecurring ? recurringType : null,
          weekdays: isRecurring && recurringType === "weekly" ? recurringDays.map(dayToNumber) : [],
        }),
      })
      if (!res.ok) throw new Error("タスク作成失敗")

      const newTask = await res.json()
      setTasks([newTask,...tasks])
      setTaskModalOpen(false)
      resetForm()
    } catch (error) {
      console.error(error)
    }
  }

  const handleUpdateTask = async () => {
    if (!selectedTask) return
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiBaseUrl}/api/tasks/${selectedTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: taskTitle,
          description: taskDescription,
          reward_amount: Number(taskReward),
          due_date: taskDeadline,
          child_id: assignedChild,
          task_category_id: assignedTaskCategory,
          recurrence: isRecurring ? recurringType : null,
          weekdays: isRecurring && recurringType === "weekly" ? recurringDays.map(dayToNumber) : [],
        }),
      })
      if (!res.ok) throw new Error("更新失敗")
      const updatedTask = await res.json()
      setTasks(tasks.map(t => (t.id === updatedTask.id ? updatedTask : t)))
      setTaskModalOpen(false)
      setSelectedTask(null)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteTask = async () => {
    if (!selectedTask) return
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiBaseUrl}/api/tasks/${selectedTask.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) throw new Error("削除失敗")
      setTasks(tasks.filter(t => t.id !== selectedTask.id))
      setDeleteTaskOpen(false)
      setSelectedTask(null)
    } catch (error) {
      console.error(error)
    }
  }

  const handleAddComment = () => {
    setCommentDialogOpen(false)
    setNewComment("")
    setSelectedTask(null)
  }

  const openCommentDialog = (task: Task) => {
    setSelectedTask(task)
    setTaskTitle(task.title);
    setCommentDialogOpen(true)
  }

  const openTaskModal = (task?: Task) => {
    if (task) {
      setSelectedTask(task)
      setTaskTitle(task.title)
      setTaskDescription(task.description)
      setTaskReward(String(task.reward_amount || ""))
      setTaskDeadline(task.due_date || task.due_date || "")
      setAssignedChild(String(task.child_id))
      setAssignedTaskCategory(String(task.task_category_id))
      setIsRecurring(Boolean(task.recurrence || task.isRecurring))
      setRecurringType(task.recurrence || task.recurringType || "")
    } else {
      resetForm()
    }
    setTaskModalOpen(true)
  }

  const handleCreateOrUpdateTask = () => {
    if (selectedTask) {
      handleUpdateTask()
    } else {
      handleCreateTask()
    }
  }

  const formatForInputDateTimeLocal = (dateString: string | undefined | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
  }

  const handleApprove = async (taskId: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiBaseUrl}/api/task-submissions/${taskId}/approve`, {
        method: "PATCH", // またはPATCH
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "approved" }), // 必要に応じて送信
      });
      if (!res.ok) throw new Error("承認更新に失敗しました");
      await fetchTasks();
    } catch (error) {
      console.error(error);
      alert("承認処理でエラーが発生しました");
    }
  };

  const handleReject = async (taskId: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiBaseUrl}/api/task-submissions/${taskId}/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "rejected" }),
      });
      if (!res.ok) throw new Error("却下更新に失敗しました");

      await fetchTasks();
    } catch (error) {
      console.error(error);
      alert("却下処理でエラーが発生しました");
    }
  };

  if (!user) return null;
  
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
                <ClipboardCheck className="w-6 h-6" /> 
                タスク管理
              </h1>
              <p className="text-sm text-gray-600">子どもたちのタスクを管理</p>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4 space-y-4 pb-24">
      <Button
        className="w-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl flex items-center gap-2"
        onClick={() => openTaskModal()}
        >
        <Plus className="w-4 h-4" />
        新規作成
      </Button>
        {/* 統計カード */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-0 shadow-lg rounded-3xl bg-gradient-to-r from-blue-400 to-purple-400 text-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{tasks.length}</div>
              <div className="text-sm text-blue-100">総タスク数</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg rounded-3xl bg-gradient-to-r from-green-400 to-blue-400 text-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{tasks.filter((t) => t.completion_status === "submitted").length}</div>
              <div className="text-sm text-green-100">申請待ち</div>
            </CardContent>
          </Card>
        </div>

        {/* タスク一覧タブ */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4 rounded-xl bg-gray-100 p-1">
            <TabsTrigger value="active" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow">
              進行中
            </TabsTrigger>
            <TabsTrigger value="submission" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow">
              申請中
            </TabsTrigger>
            <TabsTrigger value="approved" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow">
              完了済み
            </TabsTrigger>
          </TabsList>

          {/* 進行中タスク */}
          <TabsContent value="active">
            <TaskListParent
              tasks={tasks.filter(t => t.completion_status !== "submitted" && t.completion_status !== "approved")}
              onEdit={openEditDialog}
              onDelete={(task) => {
                setSelectedTask(task)
                setDeleteTaskOpen(true)
              }}
              onComment={openCommentDialog}
            />
          </TabsContent>

          {/* 申請中タスク */}
          <TabsContent value="submission">
            <TaskListParent
              tasks={tasks.filter(t => t.completion_status === "submitted")}
              onEdit={openEditDialog}
              onDelete={(task) => {
                setSelectedTask(task)
                setDeleteTaskOpen(true)
              }}
              onApprove={(task) => {
                setSelectedNotification(task);
                setIsApproveModalOpen(true);
              }}
              onReject={(task) => {
                setSelectedNotification(task);
                setIsRejectModalOpen(true);
              }}
              onComment={openCommentDialog}
            />
          </TabsContent>

          {/* 完了済みタスク */}
          <TabsContent value="approved">
            <TaskListParent
              tasks={tasks.filter(t => t.completion_status === "approved")}
              onComment={openCommentDialog}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* コメントモーダル */}
      <TaskCommentModal
        open={commentDialogOpen}
        onOpenChange={setCommentDialogOpen}
        taskId={selectedTask?.id}
        taskTitle={taskTitle}
        onAddComment={handleAddComment}
        currentUserId={user.id}
      />

      {/* 新規・編集モーダル */}
      <Dialog open={taskModalOpen} onOpenChange={(open) => {
        setTaskModalOpen(open)
        if (!open) resetForm()
      }}>
        <DialogContent className="rounded-3xl max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              {selectedTask ? "タスクを編集" : "新しいタスク"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-gray-700 font-medium">タスク名</Label>
              <Input
                id="title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="例：算数の宿題"
                className="mt-1 rounded-2xl"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-gray-700 font-medium">説明</Label>
              <Textarea
                id="description"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="詳しい説明を入力してください"
                className="mt-1 rounded-2xl"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reward" className="text-gray-700 font-medium">報酬（ポイント）</Label>
                <Input
                  id="reward"
                  type="number"
                  value={taskReward}
                  onChange={(e) => setTaskReward(e.target.value)}
                  placeholder="100"
                  className="mt-1 rounded-2xl"
                />
              </div>
              <div>
                <Label htmlFor="deadline" className="text-gray-700 font-medium">締切</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={taskDeadline}
                  onChange={(e) => setTaskDeadline(e.target.value)}
                  className="mt-1 rounded-2xl"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="child" className="text-gray-700 font-medium">担当者</Label>
              <Select value={assignedChild} onValueChange={setAssignedChild}>
                <SelectTrigger className="mt-1 rounded-2xl">
                  <SelectValue placeholder="子どもを選択" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-md border rounded-xl z-50">
                  {children.map((child) => (
                    <SelectItem key={child.id} value={String(child.id)}>
                      <span className="flex items-center gap-2">
                        {child.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="task_category" className="text-gray-700 font-medium">カテゴリ</Label>
              <Select value={assignedTaskCategory} onValueChange={setAssignedTaskCategory}>
                <SelectTrigger className="mt-1 rounded-2xl">
                  <SelectValue placeholder="カテゴリ" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-md border rounded-xl z-50">
                  {taskCategories.map((taskCategory) => (
                    <SelectItem key={taskCategory.id} value={String(taskCategory.id)}>
                      <span className="flex items-center gap-2">
                        {taskCategory.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 繰り返し設定 */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="recurring"
                  checked={isRecurring}
                  onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
                />
                <Label htmlFor="recurring" className="text-gray-700 font-medium flex items-center gap-2">
                  <Repeat className="w-4 h-4" />
                  繰り返しタスク
                </Label>
              </div>

              {isRecurring && (
                <div className="space-y-3 pl-6 border-l-2 border-purple-200">
                  <div>
                    <Label className="text-gray-700 font-medium">繰り返し頻度</Label>
                    <Select value={recurringType} onValueChange={setRecurringType}>
                      <SelectTrigger className="mt-1 rounded-2xl">
                        <SelectValue placeholder="頻度を選択" />
                      </SelectTrigger>
                      <SelectContent className="bg-white shadow-md border rounded-xl z-50">
                        <SelectItem value="daily">毎日</SelectItem>
                        {/*<SelectItem value="weekly">毎週</SelectItem>
                        <SelectItem value="monthly">毎月</SelectItem>*/}
                        <SelectItem value="weekdays">平日</SelectItem>
                        <SelectItem value="weekends">土日</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/*recurringType === "weekly" && (
                    <div>
                      <Label className="text-gray-700 font-medium">曜日を選択</Label>
                      <div className="grid grid-cols-7 gap-2 mt-2">
                        {weekDays.map((day) => (
                          <div key={day.id} className="flex flex-col items-center">
                            <Checkbox
                              id={day.id}
                              checked={recurringDays.includes(day.id)}
                              onCheckedChange={(checked) => handleRecurringDayChange(day.id, checked as boolean)}
                            />
                            <Label htmlFor={day.id} className="text-xs mt-1">
                              {day.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )*/}
                </div>
              )}
            </div>

            <Button
              onClick={handleCreateOrUpdateTask}
              className="w-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl h-12"
            >
              {selectedTask ? "更新する" : "タスクを作成"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 削除モーダル */}
      <Dialog open={deleteTaskOpen} onOpenChange={setDeleteTaskOpen}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl text-red-600 flex justify-center gap-2"><TriangleAlert className="w-6 h-6" /> タスクの削除</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <p className="text-gray-700">
              「<strong>{selectedTask?.title}</strong>」を削除してもよろしいですか？
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 rounded-2xl"
                onClick={() => setDeleteTaskOpen(false)}
              >
                キャンセル
              </Button>
              <Button
                className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-2xl"
                onClick={() => {
                  handleDeleteTask()
                }}
              >
                削除する <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* 承認モーダル */}
      <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl text-green-600 flex justify-center gap-2">
              <ClipboardCheck className="w-6 h-6" />
              タスクの承認
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <p className="text-gray-700">
              「<strong>{selectedNotification?.title}</strong>」を承認してもよろしいですか？
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 rounded-2xl"
                onClick={() => setIsApproveModalOpen(false)}
              >
                キャンセル
              </Button>
              <Button
                className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-2xl"
                onClick={() => {
                  handleApprove(selectedNotification!.id)
                  setIsApproveModalOpen(false)
                }}
              >
                承認する
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 却下モーダル */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl text-red-600 flex justify-center gap-2">
              <Ban className="w-6 h-6" />
              タスクの却下
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <p className="text-gray-700">
              「<strong>{selectedNotification?.title}</strong>」を却下してもよろしいですか？
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 rounded-2xl"
                onClick={() => setIsRejectModalOpen(false)}
              >
                キャンセル
              </Button>
              <Button
                className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-2xl"
                onClick={() => {
                  handleReject(selectedNotification!.id)
                  setIsRejectModalOpen(false)
                }}
              >
                却下する
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ナビゲーション */}
      <ParentNavigation />
    </div>
  )
}
