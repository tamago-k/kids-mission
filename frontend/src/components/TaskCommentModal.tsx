import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

type Props = {
  taskId: number;
  currentUserId: number;
  open: boolean;
  onOpenChange: (value: boolean) => void;
  taskTitle?: string;
};

export function TaskCommentModal({ taskId, currentUserId, open, onOpenChange, taskTitle }: Props) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop()!.split(';').shift()!);
    return null;
  }

  useEffect(() => {
    if (!taskId) return;
    fetchComments();
  }, [taskId]);

  const fetchComments = async () => {
    const csrfToken = getCookie("XSRF-TOKEN");
    const res = await fetch(`${apiBaseUrl}/api/tasks/${taskId}/comments`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": csrfToken ?? "",
      },
    });
    if (res.ok) {
      const data = await res.json();
      setComments(data);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const csrfToken = getCookie("XSRF-TOKEN");
    const res = await fetch(`${apiBaseUrl}/api/tasks/${taskId}/comments`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": csrfToken ?? "",
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

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-blue-50">
          {comments.map((comment) => {
            const isMine = comment.user_id === currentUserId;
console.log("comment.user_id:", comment.user_id, "currentUserId:", currentUserId, "isMine:", isMine);

            return (
              <div
                key={comment.id}
                className={`flex items-start gap-2 ${isMine ? 'flex-row-reverse justify-end' : 'justify-start'}`}
              >
                {/* アイコン */}
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm select-none">
                  {comment.user?.name?.[0] || "👤"}
                </div>

                {/* 吹き出し */}
                <div
                  className={`p-3 rounded-2xl max-w-[80%] shadow ${
                    isMine
                      ? 'bg-blue-500 text-white text-right'
                      : 'bg-white text-gray-800 text-left'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                  <div className={`text-xs mt-1 ${isMine ? 'text-white/70' : 'text-gray-500'}`}>
                    {new Date(comment.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
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
