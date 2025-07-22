"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Clock, Star, MessageCircle, Gift, Target } from "lucide-react"
import { ChildNavigation } from "@/components/navigation/child-navigation"

export default function ChildDashboard() {
  const [rewardDialogOpen, setRewardDialogOpen] = useState(false)
  const [rewardItem, setRewardItem] = useState("")
  const [rewardAmount, setRewardAmount] = useState("")
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false)
  const [commentDialogOpen, setCommentDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [completionComment, setCompletionComment] = useState("")
  const [newComment, setNewComment] = useState("")

  const todayTasks = [
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
    },
    {
      id: 2,
      title: "漢字練習",
      description: "新しい漢字10個を3回ずつ書く",
      reward: 80,
      deadline: "今日 19:00",
      status: "completed",
      comments: [{ id: 1, author: "パパ", message: "きれいに書けてるね！", time: "2時間前" }],
    },
    {
      id: 3,
      title: "お手伝い（食器洗い）",
      description: "夕食後の食器を洗う",
      reward: 50,
      deadline: "今日 20:00",
      status: "pending",
      comments: [],
    },
  ]

  const currentBalance = 450

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
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-2xl">
                👦
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">こんにちは、太郎！</h1>
                <p className="text-sm text-gray-600">今日もがんばろう 🌟</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">{currentBalance}</div>
              <div className="text-xs text-gray-600">ポイント</div>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4 space-y-6 pb-24">
        {/* 今日のタスク概要 */}
        <Card className="border-0 shadow-lg rounded-3xl bg-gradient-to-r from-orange-400 to-pink-400 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold mb-1">🎯 今日のタスク</h2>
                <div className="text-3xl font-bold">
                  {todayTasks.filter((t) => t.status === "completed").length}/{todayTasks.length}
                </div>
                <p className="text-orange-100 text-sm">完了したよ！</p>
              </div>
              <div className="text-6xl opacity-20">📋</div>
            </div>
          </CardContent>
        </Card>

        {/* 報酬残高カード */}
        <Card className="border-0 shadow-lg rounded-3xl bg-gradient-to-r from-purple-400 to-pink-400 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold mb-1">💰 ポイント残高</h2>
                <div className="text-3xl font-bold">{currentBalance} P</div>
                <p className="text-purple-100 text-sm mt-1">よくがんばったね！</p>
              </div>
              <div className="text-6xl opacity-20">💎</div>
            </div>
            <Dialog open={rewardDialogOpen} onOpenChange={setRewardDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full mt-4 bg-white/20 hover:bg-white/30 text-white border-white/30 rounded-2xl h-12">
                  <Gift className="w-5 h-5 mr-2" />
                  ポイントを使う ✨
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="text-center text-xl">🎁 ポイント交換</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="item" className="text-gray-700 font-medium">
                      欲しいもの
                    </Label>
                    <Input
                      id="item"
                      value={rewardItem}
                      onChange={(e) => setRewardItem(e.target.value)}
                      placeholder="例：ゲーム時間30分、お菓子など"
                      className="mt-1 rounded-2xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount" className="text-gray-700 font-medium">
                      使うポイント
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      value={rewardAmount}
                      onChange={(e) => setRewardAmount(e.target.value)}
                      placeholder="100"
                      className="mt-1 rounded-2xl"
                    />
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl h-12"
                    onClick={() => setRewardDialogOpen(false)}
                  >
                    申請する 🚀
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* 今日のタスク */}
        <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="w-5 h-5 text-blue-500" />
              今日のタスク
              <Badge className="bg-blue-100 text-blue-600">
                {todayTasks.filter((t) => t.status === "pending").length}個
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayTasks.map((task) => (
              <Card
                key={task.id}
                className={`border-2 rounded-2xl transition-all ${
                  task.status === "completed" ? "border-green-200 bg-green-50" : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3
                        className={`font-medium ${
                          task.status === "completed" ? "text-green-700 line-through" : "text-gray-800"
                        }`}
                      >
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      <div className="flex items-center gap-4 mt-2">
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
                      className={`ml-3 ${
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
                      className="flex-1 rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                      onClick={() => openCommentDialog(task)}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      コメント
                    </Button>
                    {task.status === "pending" ? (
                      <Button
                        size="sm"
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl"
                        onClick={() => openCompleteDialog(task)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        完了申請
                      </Button>
                    ) : (
                      <Button size="sm" disabled className="flex-1 bg-green-500 text-white rounded-xl">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        完了済み
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* 今週の成果 */}
        <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="w-5 h-5 text-yellow-500" />
              今週の成果
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 rounded-2xl p-4">
                <div className="text-2xl font-bold text-blue-600">8</div>
                <div className="text-sm text-gray-600">完了タスク</div>
              </div>
              <div className="bg-yellow-50 rounded-2xl p-4">
                <div className="text-2xl font-bold text-yellow-600">680</div>
                <div className="text-sm text-gray-600">獲得ポイント</div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-4">
                <div className="text-2xl font-bold text-purple-600">5</div>
                <div className="text-sm text-gray-600">連続達成日</div>
              </div>
            </div>
          </CardContent>
        </Card>
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
