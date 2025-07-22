"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Calendar, Clock, User, Edit, Trash2, Repeat } from "lucide-react"
import { MessageCircle } from "lucide-react"
import { ParentNavigation } from "@/components/navigation/parent-navigation"

export default function ParentTasksPage() {
  const [createTaskOpen, setCreateTaskOpen] = useState(false)
  const [commentDialogOpen, setCommentDialogOpen] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [taskTitle, setTaskTitle] = useState("")
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [taskDescription, setTaskDescription] = useState("")
  const [taskReward, setTaskReward] = useState("")
  const [taskDeadline, setTaskDeadline] = useState("")
  const [assignedChild, setAssignedChild] = useState("")
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringType, setRecurringType] = useState("")
  const [recurringDays, setRecurringDays] = useState<string[]>([])
  const [editTaskOpen, setEditTaskOpen] = useState(false)
  const [deleteTaskOpen, setDeleteTaskOpen] = useState(false)

  const children = [
    { id: "taro", name: "太郎", avatar: "👦" },
    { id: "hanako", name: "花子", avatar: "👧" },
  ]

  const weekDays = [
    { id: "monday", label: "月" },
    { id: "tuesday", label: "火" },
    { id: "wednesday", label: "水" },
    { id: "thursday", label: "木" },
    { id: "friday", label: "金" },
    { id: "saturday", label: "土" },
    { id: "sunday", label: "日" },
  ]

  const tasks = [
    {
      id: 1,
      title: "算数の宿題",
      description: "教科書p.24-26の問題を解く",
      reward: 100,
      deadline: "今日 18:00",
      assignedTo: "太郎",
      avatar: "👦",
      status: "submitted",
      createdAt: "2024年1月15日",
      isRecurring: false,
      comments: [
        { id: 1, author: "ママ", message: "がんばって！", time: "1時間前" },
        { id: 2, author: "太郎", message: "わかりました！", time: "30分前" },
      ],
    },
    {
      id: 2,
      title: "漢字練習",
      description: "新しい漢字10個を3回ずつ書く",
      reward: 80,
      deadline: "今日 19:00",
      assignedTo: "花子",
      avatar: "👧",
      status: "completed",
      createdAt: "2024年1月15日",
      isRecurring: true,
      recurringType: "weekly",
      comments: [{ id: 1, author: "パパ", message: "きれいに書けてるね！", time: "2時間前" }],
    },
    {
      id: 3,
      title: "お手伝い（食器洗い）",
      description: "夕食後の食器を洗う",
      reward: 50,
      deadline: "今日 20:00",
      assignedTo: "太郎",
      avatar: "👦",
      status: "pending",
      createdAt: "2024年1月15日",
      isRecurring: true,
      recurringType: "daily",
      comments: [],
    },
    {
      id: 4,
      title: "読書感想文",
      description: "好きな本を読んで感想を書く",
      reward: 150,
      deadline: "明日 17:00",
      assignedTo: "花子",
      avatar: "👧",
      status: "pending",
      createdAt: "2024年1月14日",
      isRecurring: false,
      comments: [],
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-600">⏳ 進行中</Badge>
      case "submitted":
        return <Badge className="bg-blue-100 text-blue-600">📝 申請中</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-600">✅ 完了</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-600">❌ 却下</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-600">❓ 不明</Badge>
    }
  }

  const handleCreateTask = () => {
    if (taskTitle && taskDescription && taskReward && taskDeadline && assignedChild) {
      // タスク作成処理
      console.log("新しいタスクを作成:", {
        title: taskTitle,
        description: taskDescription,
        reward: taskReward,
        deadline: taskDeadline,
        assignedTo: assignedChild,
        isRecurring,
        recurringType: isRecurring ? recurringType : null,
        recurringDays: isRecurring && recurringType === "weekly" ? recurringDays : [],
      })
      setCreateTaskOpen(false)
      // フォームリセット
      setTaskTitle("")
      setTaskDescription("")
      setTaskReward("")
      setTaskDeadline("")
      setAssignedChild("")
      setIsRecurring(false)
      setRecurringType("")
      setRecurringDays([])
    }
  }

  const handleRecurringDayChange = (dayId: string, checked: boolean) => {
    if (checked) {
      setRecurringDays([...recurringDays, dayId])
    } else {
      setRecurringDays(recurringDays.filter((id) => id !== dayId))
    }
  }

  const handleAddComment = () => {
    console.log("コメント追加:", {
      taskId: selectedTask?.id,
      comment: newComment,
    })
    setCommentDialogOpen(false)
    setNewComment("")
    setSelectedTask(null)
  }

  const openCommentDialog = (task: any) => {
    setSelectedTask(task)
    setCommentDialogOpen(true)
  }

  const openEditDialog = (task: any) => {
    setSelectedTask(task)
    setTaskTitle(task.title)
    setTaskDescription(task.description)
    setTaskReward(String(task.reward))
    setTaskDeadline("") // 実装により日付変換が必要かも
    setAssignedChild(task.assignedTo)
    setIsRecurring(task.isRecurring)
    setRecurringType(task.recurringType || "")
    setRecurringDays(task.recurringDays || [])
    setEditTaskOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* ヘッダー */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">📋 タスク管理</h1>
              <p className="text-sm text-gray-600">子どもたちのタスクを管理</p>
            </div>
            <Dialog
              open={createTaskOpen}
              onOpenChange={(open) => {
                setCreateTaskOpen(open)
                if (open) {
                  // 🌟 フォーム初期化
                  setTaskTitle("")
                  setTaskDescription("")
                  setTaskReward("")
                  setTaskDeadline("")
                  setAssignedChild("")
                  setIsRecurring(false)
                  setRecurringType("")
                  setRecurringDays([])
                  setSelectedTask(null)
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl">
                  <Plus className="w-4 h-4 mr-2" />
                  新規作成
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-3xl max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-center text-xl">📝 新しいタスク</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-gray-700 font-medium">
                      タスク名
                    </Label>
                    <Input
                      id="title"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      placeholder="例：算数の宿題"
                      className="mt-1 rounded-2xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-gray-700 font-medium">
                      説明
                    </Label>
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
                      <Label htmlFor="reward" className="text-gray-700 font-medium">
                        報酬（ポイント）
                      </Label>
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
                      <Label htmlFor="deadline" className="text-gray-700 font-medium">
                        締切
                      </Label>
                      <Input
                        id="deadline"
                        type="datetime-local"
                        value={taskDeadline}
                        onChange={(e) => setTaskDeadline(e.target.value)}
                        className="mt-1 rounded-2xl"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="child" className="text-gray-700 font-medium">
                      担当者
                    </Label>
                    <Select value={assignedChild} onValueChange={setAssignedChild}>
                      <SelectTrigger className="mt-1 rounded-2xl">
                        <SelectValue placeholder="子どもを選択" />
                      </SelectTrigger>
                      <SelectContent className="bg-white shadow-md border rounded-xl z-50">
                        {children.map((child) => (
                          <SelectItem key={child.id} value={child.id}>
                            <span className="flex items-center gap-2">
                              {child.avatar} {child.name}
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
                              <SelectItem value="weekly">毎週</SelectItem>
                              <SelectItem value="monthly">毎月</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {recurringType === "weekly" && (
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
                        )}
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleCreateTask}
                    className="w-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl h-12"
                  >
                    タスクを作成 🚀
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4 space-y-4 pb-24">
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
              <div className="text-2xl font-bold">{tasks.filter((t) => t.status === "submitted").length}</div>
              <div className="text-sm text-green-100">申請待ち</div>
            </CardContent>
          </Card>
        </div>

        {/* タスク一覧 */}
        <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">📋 全タスク一覧</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasks.map((task) => (
              <Card key={task.id} className="border border-gray-200 rounded-2xl">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                        {task.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-800">{task.title}</h3>
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
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {task.assignedTo}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {task.deadline}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {task.createdAt}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(task.status)}
                      <Badge className="bg-purple-100 text-purple-600">💰 {task.reward}P</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-2xl border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                      onClick={() => openCommentDialog(task)}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      コメント
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                      onClick={() => openEditDialog(task)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      編集
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-xl border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                      onClick={() => {
                        setSelectedTask(task)
                        setDeleteTaskOpen(true)
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      削除
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>


      {/* コメントモーダル */}
      <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
        <DialogContent className="rounded-3xl max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">💬 コメント</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-2xl p-4">
              <h3 className="font-bold text-gray-800">{selectedTask?.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{selectedTask?.description}</p>
            </div>

            {/* 既存のコメント */}
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {selectedTask?.comments?.map((comment: any) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                    {comment.author === "太郎" ? "👦" : comment.author === "ママ" ? "👩" : "👨"}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-2xl p-3">
                      <p className="text-sm text-gray-800">{comment.message}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {comment.author} • {comment.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 新しいコメント */}
            <div>
              <Label htmlFor="new-comment" className="text-gray-700 font-medium">
                新しいコメント
              </Label>
              <Textarea
                id="new-comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="質問や報告があれば書いてね！"
                className="mt-1 rounded-2xl"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 rounded-2xl bg-transparent"
                onClick={() => setCommentDialogOpen(false)}
              >
                閉じる
              </Button>
              <Button
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
              >
                送信 📤
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 編集モーダル */}
      <Dialog open={editTaskOpen} onOpenChange={setEditTaskOpen}>
        <DialogContent className="rounded-3xl max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">✏️ タスクを編集</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-gray-700 font-medium">
                タスク名
              </Label>
              <Input
                id="title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="例：算数の宿題"
                className="mt-1 rounded-2xl"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-gray-700 font-medium">
                説明
              </Label>
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
                <Label htmlFor="reward" className="text-gray-700 font-medium">
                  報酬（ポイント）
                </Label>
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
                <Label htmlFor="deadline" className="text-gray-700 font-medium">
                  締切
                </Label>
                <Input
                  id="deadline"
                  type="datetime-local"
                  value={taskDeadline}
                  onChange={(e) => setTaskDeadline(e.target.value)}
                  className="mt-1 rounded-2xl"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="child" className="text-gray-700 font-medium">
                担当者
              </Label>
              <Select value={assignedChild} onValueChange={setAssignedChild}>
                <SelectTrigger className="mt-1 rounded-2xl">
                  <SelectValue placeholder="子どもを選択" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-md border rounded-xl z-50">
                  {children.map((child) => (
                    <SelectItem key={child.id} value={child.id}>
                      <span className="flex items-center gap-2">
                        {child.avatar} {child.name}
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
                        <SelectItem value="weekly">毎週</SelectItem>
                        <SelectItem value="monthly">毎月</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {recurringType === "weekly" && (
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
                  )}
                </div>
              )}
            </div>
            <Button
              onClick={() => {
                console.log("タスクを更新:", {
                  id: selectedTask?.id,
                  title: taskTitle,
                  description: taskDescription,
                  reward: taskReward,
                  deadline: taskDeadline,
                  assignedTo: assignedChild,
                  isRecurring,
                  recurringType: isRecurring ? recurringType : null,
                  recurringDays: isRecurring && recurringType === "weekly" ? recurringDays : [],
                })
                setEditTaskOpen(false)
                setSelectedTask(null)
              }}
              className="w-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl h-12"
            >
              更新する 💾
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 削除モーダル */}
      <Dialog open={deleteTaskOpen} onOpenChange={setDeleteTaskOpen}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl text-red-600">⚠️ タスクの削除</DialogTitle>
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
                  console.log("タスク削除:", selectedTask?.id)
                  setDeleteTaskOpen(false)
                  setSelectedTask(null)
                }}
              >
                削除する 🗑️
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
