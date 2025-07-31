import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button"
import { Smile } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

type Props = {
  taskId?: number;
  currentUserId: number;
  open: boolean;
  onOpenChange: (value: boolean) => void;
  taskTitle?: string;
  onAddComment?: () => void;
};

export function TaskCommentModal({ taskId, currentUserId, open, onOpenChange, taskTitle }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("")
  const commentBoxRef = useRef<HTMLDivElement | null>(null);
  const [_autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  type Comment = {
    id: number;
    user_id: number;
    content: string;
    created_at: string;
  };

  const onScroll = () => {
    const box = commentBoxRef.current;
    if (!box) return;
    const isAtBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 10;
    setAutoScrollEnabled(isAtBottom);
  };

  const fetchComments = async () => {
    const token = localStorage.getItem("token");
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

  useEffect(() => {
    if (!taskId || !open) return;

    const fetchAndScroll = async () => {

      const box = commentBoxRef.current;
      if (box) {
        box.scrollTop = box.scrollHeight;
      }
    };
    if (!open) return;

    const box = commentBoxRef.current;
    if (box) {
      box.scrollTop = box.scrollHeight;
    }

    fetchAndScroll();
  }, [taskId, open]);


  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const token = localStorage.getItem("token");
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
