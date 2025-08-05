import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button"
import { Smile } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

// このコンポーネントが受け取るプロパティの型定義
type Props = {
  taskId?: number;
  currentUserId: number;
  open: boolean;
  onOpenChange: (value: boolean) => void;
  taskTitle?: string;
  onAddComment?: () => void;
};

export function TaskCommentModal({ taskId, currentUserId, open, onOpenChange, taskTitle }: Props) {
  // コメントの一覧を格納する
  const [comments, setComments] = useState<Comment[]>([]);
  // 新規コメントのテキスト入力内容を管理
  const [newComment, setNewComment] = useState<string>("")
  // コメント一覧を表示するDOM（div）を参照するためのref
  const commentBoxRef = useRef<HTMLDivElement | null>(null);
  // コメント追加時に自動でスクロールさせるかどうかのフラグ
  const [, setAutoScrollEnabled] = useState(true);
  // 環境変数からAPI URL取得
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  // コメントオブジェクトの型定義
  type Comment = {
    id: number;
    user_id: number;
    content: string;
    created_at: string;
  };

  // コメント一覧のスクロールイベントのコールバック関数を定義
  const onScroll = () => {
    // コメント表示領域のDOM要素を取得
    const box = commentBoxRef.current;
    if (!box) return;
    // スクロール位置がほぼ一番下（10px以内）かどうか判定
    const isAtBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 10;
    // 一番下なら自動スクロール有効、そうでなければ無効に設定
    setAutoScrollEnabled(isAtBottom);
  };

  // コメント一覧をAPIから非同期で取得
  const fetchComments = async () => {
    const token = localStorage.getItem("token");
    // GET /api/tasks/${taskId}/comments を叩いてタスクに紐づくコメント一覧を取得
    const res = await fetch(`${apiBaseUrl}/api/tasks/${taskId}/comments`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      setComments(data);
    }
  };

  // taskIdまたはopenが変わるたびに実行
  useEffect(() => {
    // タスクIDがないか、モーダルが閉じていたら何もしない
    if (!taskId || !open) return;

    // コメントを取得
    fetchComments();

    // コメント取得後にスクロール領域を一番下に移動させる
    const fetchAndScroll = async () => {
      const box = commentBoxRef.current;
      if (box) {
        box.scrollTop = box.scrollHeight;
      }
    };
    // モーダルが閉じていれば処理を中断
    if (!open) return;

    // コメント表示ボックスがあればスクロールを一番下
    const box = commentBoxRef.current;
    if (box) {
      box.scrollTop = box.scrollHeight;
    }

    fetchAndScroll();
  }, [taskId, open]);


  // 新しいコメントを投稿
  const handleAddComment = async () => {
    // 入力が空白のみなら何もしない。
    if (!newComment.trim()) return;
    const token = localStorage.getItem("token");
    // POST /api/tasks/${taskId}/comments を叩いてタスクに紐づくコメントのリクエスト送信
    const res = await fetch(`${apiBaseUrl}/api/tasks/${taskId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: newComment }),
    });
    if (res.ok) {
      const created = await res.json();
      setComments([...comments, created]);
      setNewComment("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] rounded-3xl overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{taskTitle} のコメント</DialogTitle>
        </DialogHeader>

        <div 
        ref={commentBoxRef}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-blue-50 max-h-240 overflow-scroll"
        >
        {comments.length === 0 ? (
          <p className="text-center text-gray-500">コメントはありません</p>
        ) : (
          comments.map((comment) => {
            const isMine = comment.user_id === currentUserId;
            return (
              <div
                key={comment.id}
                className={`flex items-start gap-2 ${isMine ? 'flex-row-reverse justify-end' : 'justify-start'}`}
              >
                {/* アイコン */}
                <div className={`w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm select-none shrink-0 ${isMine ? 'bg-blue-300' : 'bg-indigo-300'}`}>
                  <Smile className="w-4 h-4 text-white" />
                </div>

                {/* 吹き出し */}
                <div
                  className={`p-3 rounded-2xl grow shadow ${
                    isMine
                      ? 'bg-blue-500 text-white text-right'
                      : 'bg-white text-gray-800 text-left'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap text-left">{comment.content}</p>
                  <div className={`text-xs mt-1 text-right ${isMine ? 'text-white/70' : 'text-gray-500'}`}>
                    {new Date(comment.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })
        )}
        </div>

        <div className="p-4 border-t flex gap-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={2}
            placeholder="コメントを入力..."
            className="flex-1 rounded-2xl"
          />
          <Button
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className="rounded-2xl bg-blue-500 hover:bg-blue-600 text-white px-6"
          >
            送信
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
