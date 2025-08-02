"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CalendarSearch, Sun, SwatchBook, ClipboardCheck, PartyPopper, PiggyBank, ArrowLeft, CheckCircle } from "lucide-react"
import { ChildNavigation } from "@/components/navigation/ChildNavigation"
import { TaskCommentModal } from "@/components/TaskCommentModal"
import { TaskListChild } from "@/components/TaskListChild"
import { useCurrentUser } from "@/hooks/useCurrentUser"

export default function ChildTasksPage() {
  const user = useCurrentUser()
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false)
  const [commentDialogOpen, setCommentDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [_newComment, setNewComment] = useState<string>("")
  const [tasks, setTasks] = useState<Task[]>([])
  const [_taskCategories, setTaskCategories] = useState<{id: string; name: string; slug: string}[]>([])
  const [filter, setFilter] = useState("today")
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  const fetchTasks = useCallback(async () => {
    if (!user) return;
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
    console.log(data);
    setTasks(data);
  }, [apiBaseUrl,user]);

  const fetchTaskCategories = useCallback(async () => {
    if (!user) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`${apiBaseUrl}/api/task-categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      alert("タスクカテゴリ取得に失敗しました");
      return;
    }
    const data = await res.json();
    setTaskCategories(data);
  }, [apiBaseUrl, user]);

  useEffect(() => {
    if (!user) return;
    fetchTasks();
    fetchTaskCategories();
  }, [user, fetchTasks, fetchTaskCategories]);

  async function handleCompleteTask(task: Task) {
    if (!task?.id) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiBaseUrl}/api/task/${task.id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setCompleteDialogOpen(false);
        setSelectedTask(null);
        await fetchTasks(); // 成功後に再取得
      } else {
        const data = await res.json();
        alert(`完了申請エラー: ${data.message ?? "不明なエラー"}`);
      }
    } catch (error) {
      alert("通信エラーが発生しました");
      console.error(error);
    }
  }


  const handleAddComment = () => {
    setCommentDialogOpen(false)
    setNewComment("")
    setSelectedTask(null)
  }

  const openCompleteDialog = (task: Task) => {
    setSelectedTask(task)
    setCompleteDialogOpen(true)
  }

  const openCommentDialog = (task: Task) => {
    setSelectedTask(task)
    setCommentDialogOpen(true)
  }

  const isToday = (dateStr?: string | null) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const today = new Date();
    const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const now = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return target <= now;
  };

  const isTomorrow = (dateStr?: string | null) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return (
      date.getFullYear() === tomorrow.getFullYear() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getDate() === tomorrow.getDate()
    );
  };

  const isUpcoming = (dateStr?: string | null) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
    // 今度は明日の次の日以降のタスク（期限がそれ以降）
    return date >= dayAfterTomorrow;
  };

    
  const filteredTasks = tasks.filter(task => {
    if (!task.due_date) return false;
    const today = new Date();
    const dueDate = new Date(task.due_date);

    if (filter === "today") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const dueDateOnly = new Date(dueDate);
      dueDateOnly.setHours(0, 0, 0, 0);
      const isDueToday = dueDateOnly.getTime() === today.getTime();

      const approvedAtRaw = task.latest_submission?.created_at;
      const approvedAt = approvedAtRaw ? new Date(approvedAtRaw) : null;
      const isApprovedToday =
        approvedAt &&
        approvedAt >= today &&
        approvedAt <= todayEnd;

      return (
        (isDueToday || isApprovedToday) &&
        (
          task.completion_status !== "approved" || isApprovedToday
        )
      );
    } else if (filter === "tomorrow") {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      return (
        dueDate.getFullYear() === tomorrow.getFullYear() &&
        dueDate.getMonth() === tomorrow.getMonth() &&
        dueDate.getDate() === tomorrow.getDate()
      );
    } else if (filter === "upcoming") {
      const dayAfterTomorrow = new Date(today);
      dayAfterTomorrow.setDate(today.getDate() + 1);
      return dueDate >= dayAfterTomorrow;
    }

    // デフォルトで全件返す
    return true;
  });

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
            今日 ({tasks.filter(t => isToday(t.due_date)).length})
          </Button>

          <Button
            onClick={() => setFilter("tomorrow")}
            className={`px-4 py-2 whitespace-nowrap rounded-xl ${
              filter === "tomorrow" ? "bg-white shadow" : ""
            }`}
          >
            <Sun className="w-4 h-4 mr-1" />
            明日 ({tasks.filter(t => isTomorrow(t.due_date)).length})
          </Button>

          <Button
            onClick={() => setFilter("upcoming")}
            className={`px-4 py-2 whitespace-nowrap rounded-xl ${
              filter === "upcoming" ? "bg-white shadow" : ""
            }`}
          >
            <SwatchBook className="w-4 h-4 mr-1" />
            今度 ({tasks.filter(t => isUpcoming(t.due_date)).length})
          </Button>
        </div>

        {/* タスク一覧 */}
        <TaskListChild
          tasks={filteredTasks}
          onComplete={openCompleteDialog}
          onComment={openCommentDialog}
        />

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
      </div>

      {/* 完了申請モーダル */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl"><CheckCircle className="w-4 h-4" />タスク完了申請</DialogTitle>
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
