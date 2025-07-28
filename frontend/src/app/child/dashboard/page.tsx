"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PiggyBank, ClipboardCheck, Star, CheckCircle, Gift, ThumbsUp } from "lucide-react"
import { ChildNavigation } from "@/components/navigation/ChildNavigation"

export default function ChildDashboard() {
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false)
  const [commentDialogOpen, setCommentDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [completionComment, setCompletionComment] = useState("")
  const [newComment, setNewComment] = useState("")
  const router = useRouter()
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const todayTasks = [
    {
      id: 1,
      title: "算数の宿題",
      description: "教科書p.24-26の問題を解く",
      reward: 100,
      deadline: "今日 18:00",
      status: "submitted",
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
      status: "approved",
      comments: [{ id: 1, author: "パパ", message: "きれいに書けてるね！", time: "2時間前" }],
    },
    {
      id: 3,
      title: "お手伝い（食器洗い）",
      description: "夕食後の食器を洗う",
      reward: 50,
      deadline: "今日 20:00",
      status: "submitted",
      comments: [],
    },
  ]

  const currentBalance = 450

  const handleCompleteTask = () => {
    setCompleteDialogOpen(false)
    setCompletionComment("")
    setSelectedTask(null)
  }

  const handleAddComment = () => {
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

  useEffect(() => {
    const checkRole = async () => {
      const res = await fetch(`${apiBaseUrl}/api/user`, { credentials: "include" })
      if (!res.ok) {
        router.push("/")
        return
      }
      const user = await res.json()
      if (user.role !== "child") {
        router.push("/")
      }
    }
    checkRole()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 max-w-xl mx-auto">
      {/* ヘッダー */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-2xl">
                👦
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">今日もがんばろう！</h1>
              </div>
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
                <h2 className="text-lg font-bold mb-1 flex gap-1 items-center"><CheckCircle className="w-4 h-4" />今日のタスク</h2>
                <div className="text-3xl font-bold">
                  {todayTasks.filter((t) => t.status === "approved").length}/{todayTasks.length}
                </div>
                <p className="text-orange-100 text-sm">完了したよ！</p>
              </div>
              <div className="text-6xl opacity-20"><ClipboardCheck className="w-15 h-15" /></div>
            </div>
          </CardContent>
        </Card>

        {/* 報酬残高カード */}
        <Card className="border-0 shadow-lg rounded-3xl bg-gradient-to-r from-purple-400 to-pink-400 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold flex gap-1 items-center"><PiggyBank className="w-6 h-6" /> ポイント残高</h2>
                <div className="text-3xl font-bold">{currentBalance} P</div>
                <p className="text-purple-100 text-sm mt-1">よくがんばったね！</p>
              </div>
              <div className="text-6xl opacity-20"><ThumbsUp className="w-15 h-15" /></div>
            </div>
            <Link href="/child/rewards/" className="flex-1">
              <Button className="w-full mt-4 bg-white/20 hover:bg-white/30 text-white border-white/30 rounded-2xl h-12">
                <Gift className="w-5 h-5 mr-2" />
                ポイントを使う
              </Button>
            </Link>
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
