"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Clock, MessageCircle } from "lucide-react"
import { ChildNavigation } from "@/components/navigation/child-navigation"

export default function ChildTasksPage() {
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false)
  const [commentDialogOpen, setCommentDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [completionComment, setCompletionComment] = useState("")
  const [newComment, setNewComment] = useState("")

  const allTasks = [
    {
      id: 1,
      title: "算数の宿題",
      description: "教科書p.24-26の問題を解く",
      reward: 100,
      deadline: "今日 18:00",
      status: "pending",
      comments: [
        { id: 1, author: "ママ", message: "がんばって！", time: "1時間前" },
        { id: 2, author: "太郎", message: "わかりました！", time: "30分前" },
      ],
      category: "today",
    },
    {
      id: 2,
      title: "漢字練習",
      description: "新しい漢字10個を3回ずつ書く",
      reward: 80,
      deadline: "今日 19:00",
      status: "completed",
      comments: [{ id: 1, author: "パパ", message: "きれいに書けてるね！", time: "2時間前" }],
      category: "today",
    },
    {
      id: 3,
      title: "お手伝い（食器洗い）",
      description: "夕食後の食器を洗う",
      reward: 50,
      deadline: "今日 20:00",
      status: "pending",
      comments: [],
      category: "today",
    },
    {
      id: 4,
      title: "読書感想文",
      description: "好きな本を読んで感想を書く",
      reward: 150,
      deadline: "明日 17:00",
      status: "pending",
      comments: [],
      category: "tomorrow",
    },
    {
      id: 5,
      title: "理科の実験レポート",
      description: "植物の観察記録をまとめる",
      reward: 120,
      deadline: "3日後",
      status: "pending",
      comments: [{ id: 1, author: "ママ", message: "写真も撮ってね", time: "1日前" }],
      category: "upcoming",
    },
  ]

  const [filter, setFilter] = useState("today")

  const filteredTasks = allTasks.filter((task) => task.category === filter)

  const handleCompleteTask = () => {
    console.log("タスク完了申請:", {
      taskId: selectedTask?.id,
      comment: completionComment,
    })
    setCompleteDialogOpen(false)
    setCompletionComment("")
    setSelectedTask(null)
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

  const openCompleteDialog = (task: any) => {
    setSelectedTask(task)
    setCompleteDialogOpen(true)
  }

  const openCommentDialog = (task: any) => {
    setSelectedTask(task)
    setCommentDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50">
      {/* ヘッダー */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">🎯 タスク一覧</h1>
              <p className="text-sm text-gray-600">がんばってクリアしよう！</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-orange-600">
                {allTasks.filter((t) => t.status === "completed").length}/{allTasks.length}
              </div>
              <div className="text-xs text-gray-600">完了</div>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4 space-y-4 pb-24">
        {/* フィルターボタン */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            onClick={() => setFilter("today")}
            className={`rounded-2xl px-4 py-2 whitespace-nowrap ${
              filter === "today"
                ? "bg-gradient-to-r from-orange-400 to-red-400 text-white"
                : "bg-white/80 text-gray-700 border border-gray-200"
            }`}
          >
            📅 今日 ({allTasks.filter((t) => t.category === "today").length})
          </Button>
          <Button
            onClick={() => setFilter("tomorrow")}
            className={`rounded-2xl px-4 py-2 whitespace-nowrap ${
              filter === "tomorrow"
                ? "bg-gradient-to-r from-orange-400 to-red-400 text-white"
                : "bg-white/80 text-gray-700 border border-gray-200"
            }`}
          >
            🌅 明日 ({allTasks.filter((t) => t.category === "tomorrow").length})
          </Button>
          <Button
            onClick={() => setFilter("upcoming")}
            className={`rounded-2xl px-4 py-2 whitespace-nowrap ${
              filter === "upcoming"
                ? "bg-gradient-to-r from-orange-400 to-red-400 text-white"
                : "bg-white/80 text-gray-700 border border-gray-200"
            }`}
          >
            📆 今度 ({allTasks.filter((t) => t.category === "upcoming").length})
          </Button>
        </div>

        {/* タスク一覧 */}
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <Card
              key={task.id}
              className={`border-2 rounded-3xl transition-all ${
                task.status === "completed"
                  ? "border-green-200 bg-green-50"
                  : "border-gray-200 hover:border-orange-300 bg-white/80 backdrop-blur-sm"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3
                      className={`font-bold text-lg ${
                        task.status === "completed" ? "text-green-700 line-through" : "text-gray-800"
                      }`}
                    >
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {task.deadline}
                      </div>
                      {task.comments.length > 0 && (
                        <div className="flex items-center gap-1 text-sm text-blue-500">
                          <MessageCircle className="w-4 h-4" />
                          {task.comments.length}
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge
                    className={`ml-3 text-lg px-3 py-1 ${
                      task.status === "completed" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    💰 {task.reward}P
                  </Badge>
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
                  {task.status === "pending" ? (
                    <Button
                      size="sm"
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-2xl"
                      onClick={() => openCompleteDialog(task)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      完了申請
                    </Button>
                  ) : (
                    <Button size="sm" disabled className="flex-1 bg-green-500 text-white rounded-2xl">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      完了済み
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {filter === "today" ? "今日のタスクはありません！" : "タスクはありません"}
              </h3>
              <p className="text-gray-600">
                {filter === "today" ? "今日はゆっくり休んでね 😊" : "新しいタスクが追加されるまで待ってね"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 完了申請モーダル */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">✅ タスク完了申請</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-2xl p-4">
              <h3 className="font-bold text-gray-800">{selectedTask?.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{selectedTask?.description}</p>
              <Badge className="bg-yellow-100 text-yellow-600 mt-2">💰 {selectedTask?.reward}P</Badge>
            </div>
            <div>
              <Label htmlFor="completion-comment" className="text-gray-700 font-medium">
                完了報告（任意）
              </Label>
              <Textarea
                id="completion-comment"
                value={completionComment}
                onChange={(e) => setCompletionComment(e.target.value)}
                placeholder="どんなふうに頑張ったか教えてね！"
                className="mt-1 rounded-2xl"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 rounded-2xl bg-transparent"
                onClick={() => setCompleteDialogOpen(false)}
              >
                キャンセル
              </Button>
              <Button
                className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-2xl"
                onClick={handleCompleteTask}
              >
                完了申請 🚀
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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

      {/* ナビゲーション */}
      <ChildNavigation />
    </div>
  )
}
