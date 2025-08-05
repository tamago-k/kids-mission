"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CalendarSearch, Sun, SwatchBook, ClipboardCheck, PartyPopper, PiggyBank, ArrowLeft, CheckCircle } from "lucide-react"
import { ChildNavigation } from "@/components/navigation/ChildNavigation"
import { TaskCommentModal } from "@/components/TaskCommentModal"
import { TaskListChild } from "@/components/TaskListChild"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import type { Task } from "@/types/TaskChild";

export default function ChildTasksPage() {
  //　ログイン中のユーザー情報を取得
  const user = useCurrentUser()

  // タスク完了ダイアログの表示状態
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false)
  // コメントダイアログの表示状態
  const [commentDialogOpen, setCommentDialogOpen] = useState(false)
  // 選択中のタスク（完了申請やコメント対象）
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  // 今日のタスクリスト
  const [todayTasks, setTodayTasks] = useState<Task[]>([])
  // 明日のタスクリスト
  const [tomorrowTasks, setTomorrowTasks] = useState<Task[]>([])
  // 今度のタスクリスト
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([])
  // 今日のタスクページ（無限スクロール用）
  const [todayPage, setTodayPage] = useState(1)
  // 明日のタスクページ（無限スクロール用）
  const [tomorrowPage, setTomorrowPage] = useState(1)
  // 今度のタスクページ（無限スクロール用）
  const [upcomingPage, setUpcomingPage] = useState(1)
  // 今日のタスクページで読み込み可能なページがあるかどうかのフラグ
  const [hasMoreToday, setHasMoreToday] = useState(true)
  // 明日のタスクページで読み込み可能なページがあるかどうかのフラグ
  const [hasMoreTomorrow, setHasMoreTomorrow] = useState(true)
  // 今度のタスクページで読み込み可能なページがあるかどうかのフラグ
  const [hasMoreUpcoming, setHasMoreUpcoming] = useState(true)
  // 現在表示しているタブ（"today" | "tomorrow" | "upcoming"）
  const [filter, setFilter] = useState("today")
  // APIリクエストの多重発火を防ぐためのフラグ
  const loadingRef = useRef(false);
  // 環境変数からAPI URL取得
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  // タブ名とページ番号を受け取りAPIからタスクを取得する
  const fetchTasks = useCallback(
    async (tab: "today" | "tomorrow" | "upcoming", pageToFetch = 1) => {
      if (!user || loadingRef.current) return
      loadingRef.current = true

      try {
        const token = localStorage.getItem("token")
        // GET /api/tasks?exclude_past_approved=1&page=${pageToFetch} を叩いてページごとに各タスク一覧を取得
        const res = await fetch(`${apiBaseUrl}/api/tasks?exclude_past_approved=1&page=${pageToFetch}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        if (!res.ok) throw new Error("タスク取得に失敗")
        const data = await res.json()
        const newTasks: Task[] = data.data

        // 今日・明日・明後日の日付をそれぞれ生成
        // 時間は00:00にセットし日付比較しやすく
        const now = new Date()
        now.setHours(0, 0, 0, 0)
        const tomorrow = new Date(now)
        tomorrow.setDate(tomorrow.getDate() + 1)
        const dayAfterTomorrow = new Date(tomorrow)
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1)

        // APIからのタスクを、指定したタブに応じて絞り込み
        const filtered = newTasks.filter((task) => {
          const due = task.due_date ? new Date(task.due_date) : null
          // due_dateがないものは除外
          if (!due) return false
          due.setHours(0, 0, 0, 0)

          // due_dateが今日と同じものだけ抽出
          if (tab === "today") return due.getTime() === now.getTime()
          // due_dateが明日と同じものだけ抽出
          if (tab === "tomorrow") return due.getTime() === tomorrow.getTime()
          // due_dateが明後日以降のものだけ抽出
          if (tab === "upcoming") return due.getTime() >= dayAfterTomorrow.getTime()
          return false
        })

        // ページ番号によって1ページ目なら上書き、2ページ目以降なら追加してセット
        // ページ番号を状態にセット
        // 最終ページかどうかを判定し hasMore を設定
        if (tab === "today") {
          setTodayTasks((prev) => (pageToFetch === 1 ? filtered : [...prev, ...filtered]))
          setTodayPage(pageToFetch)
          setHasMoreToday(pageToFetch < data.last_page)
        } else if (tab === "tomorrow") {
          setTomorrowTasks((prev) => (pageToFetch === 1 ? filtered : [...prev, ...filtered]))
          setTomorrowPage(pageToFetch)
          setHasMoreTomorrow(pageToFetch < data.last_page)
        } else if (tab === "upcoming") {
          setUpcomingTasks((prev) => (pageToFetch === 1 ? filtered : [...prev, ...filtered]))
          setUpcomingPage(pageToFetch)
          setHasMoreUpcoming(pageToFetch < data.last_page)
        }
      } catch (e) {
        alert(e instanceof Error ? e.message : "データの取得に失敗しました")
      } finally {
        loadingRef.current = false
      }
    },
    [apiBaseUrl, user]
  )

  // userやfilterが変わったら該当タブの1ページ目を取得
  // fetchTasksはuseCallbackでメモ化済
  useEffect(() => {
    if (!user) return
    if (filter === "today") fetchTasks("today", 1)
    else if (filter === "tomorrow") fetchTasks("tomorrow", 1)
    else if (filter === "upcoming") fetchTasks("upcoming", 1)
  }, [user, filter, fetchTasks])

  // スクロールイベントハンドラー
  // スクロールが100px以内でかつ読み込み中でなければ次ページ取得
  //現在のタブごとに対応するページ番号を1つ増やしてAPIコール
  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 100 && !loadingRef.current) {
      if (filter === "today" && hasMoreToday) fetchTasks("today", todayPage + 1)
      else if (filter === "tomorrow" && hasMoreTomorrow) fetchTasks("tomorrow", tomorrowPage + 1)
      else if (filter === "upcoming" && hasMoreUpcoming) fetchTasks("upcoming", upcomingPage + 1)
    }
  }

  async function handleCompleteTask(task: Task) {
    if (!task?.id) return;

    try {
      const token = localStorage.getItem("token");

      // POST /api/tasks/${taskId}/submit を叩いてタスクの完了リクエスト送信
      const res = await fetch(`${apiBaseUrl}/api/task/${task.id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setCompleteDialogOpen(false)
        setSelectedTask(null)

        // 完了申請したタスクの状態を"submitted"に更新
        const updateTaskList = (tasks: Task[]): Task[] =>
          tasks.map((t) =>
            t.id === task.id ? { ...t, completion_status: "submitted" } : t
          )

        if (filter === "today") {
          setTodayTasks((prev) => updateTaskList(prev))
        } else if (filter === "tomorrow") {
          setTomorrowTasks((prev) => updateTaskList(prev))
        } else if (filter === "upcoming") {
          setUpcomingTasks((prev) => updateTaskList(prev))
        }
      } else {
        const data = await res.json();
        alert(`完了申請エラー: ${data.message ?? "不明なエラー"}`);
      }
    } catch (error) {
      alert("通信エラーが発生しました");
      console.error(error);
    }
  }

  // タスクをセットして、完了申請ダイアログを開く
  const openCompleteDialog = (task: Task) => {
    setSelectedTask(task)
    setCompleteDialogOpen(true)
  }

  // タスクをセットして、メントダイアログを開く
  const openCommentDialog = (task: Task) => {
    setSelectedTask(task)
    setCommentDialogOpen(true)
  }

  // フィルターに応じて表示するタスク配列を切り替え
  const filteredTasks = filter === "today"
    ? todayTasks
    : filter === "tomorrow"
    ? tomorrowTasks
    : upcomingTasks

    if (!user) {
      return
    }

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
                <ClipboardCheck className="w-6 h-6" /> 
                タスクいちらん
              </h1>
              <p className="text-sm text-gray-600">がんばってクリアしよう！</p>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4 space-y-4 pb-24">
        {/* フィルターボタン */}
        <div className="grid grid-cols-3 mb-4 rounded-xl bg-gray-100 p-1">
          <Button
            onClick={() => setFilter("today")}
            className={`px-4 py-2 whitespace-nowrap rounded-xl ${
              filter === "today" ? "bg-white shadow" : ""
            }`}
          >
            <CalendarSearch className="w-4 h-4 mr-1" />
            今日
          </Button>

          <Button
            onClick={() => setFilter("tomorrow")}
            className={`px-4 py-2 whitespace-nowrap rounded-xl ${
              filter === "tomorrow" ? "bg-white shadow" : ""
            }`}
          >
            <Sun className="w-4 h-4 mr-1" />
            明日
          </Button>

          <Button
            onClick={() => setFilter("upcoming")}
            className={`px-4 py-2 whitespace-nowrap rounded-xl ${
              filter === "upcoming" ? "bg-white shadow" : ""
            }`}
          >
            <SwatchBook className="w-4 h-4 mr-1" />
            今度
          </Button>
        </div>

        {/* タスク一覧 */}
        {filteredTasks.length === 0 && (
          <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4 flex justify-center"><PartyPopper className="w-10 h-10 mr-1" /></div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {filter === "today" ? "今日のタスクはありません！" : "タスクはありません"}
              </h3>
              <p className="text-gray-600">
                {filter === "today" ? "今日はゆっくり休んでね" : "新しいタスクが追加されるまで待ってね"}
              </p>
            </CardContent>
          </Card>
        )}
        <TaskListChild
          tasks={filteredTasks}
          onComplete={openCompleteDialog}
          onComment={openCommentDialog}
          onScroll={onScroll}
        />
      </div>

      {/* 完了申請モーダル */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl"><CheckCircle className="w-4 h-4" />タスク完了しんせい</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-2xl p-4">
              <h3 className="font-bold text-gray-800">{selectedTask?.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{selectedTask?.description}</p>
              <Badge className="bg-purple-100 text-purple-600 mt-2"><PiggyBank className="w-4 h-4 mr-2" />{selectedTask?.reward_amount}P</Badge>
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
                onClick={() => selectedTask && handleCompleteTask(selectedTask)}
              >
                完了しんせい
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* コメントモーダル */}
      {selectedTask && (
        <TaskCommentModal
          open={commentDialogOpen}
          onOpenChange={setCommentDialogOpen}
          taskId={selectedTask.id}
          taskTitle={selectedTask.title}
          currentUserId={user!.id}
        />
      )}
      {/* ナビゲーション */}
      <ChildNavigation />
    </div>
  )
}
