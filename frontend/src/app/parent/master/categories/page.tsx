"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, CopyPlus, TriangleAlert } from "lucide-react"
import { ParentNavigation } from "@/components/navigation/ParentNavigation"

export default function ParentMasterPage() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const [addTaskCategoryOpen, setAddTaskCategoryOpen] = useState(false)
  const [categoryName, setTaskCategoryName] = useState("")
  const [categorySlug, setTaskCategorySlug] = useState("")
  const [editingTaskCategoryId, setEditingTaskCategoryId] = useState<number | null>(null)
  const [task_categories, setTaskCategorys] = useState([])
  const [deleteTaskCategoryOpen, setDeleteTaskCategoryOpen] = useState(false)
  const [deletingTaskCategory, setDeletingTaskCategory] = useState<{ id: number; name: string } | null>(null);

  // 初期データ読み込み
  useEffect(() => {
    fetchTaskCategorys();
  }, []);

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift()!);
    return null;
  };

  const fetchTaskCategorys = async () => {
    const csrfToken = getCookie("XSRF-TOKEN");
    try {
      const res = await fetch(`${apiBaseUrl}/api/task_categories`, {
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": csrfToken ?? "",
        },
      });
      if (!res.ok) throw new Error('カテゴリの取得に失敗');
      const data = await res.json();
      setTaskCategorys(Array.isArray(data) ? data : data.task_categories ?? []);
    } catch (e) {
      alert(e.message || "カテゴリの取得に失敗しました");
    }
  };

  // 保存（新規 or 更新）
  const handleSaveTaskCategory = async () => {
    if (!categoryName || !categorySlug ) return alert("すべての項目を入力してください");

    const csrfToken = getCookie("XSRF-TOKEN");
    const payload = {
      name: categoryName,
      slug: categorySlug,
    };

    try {
      let res;
      if (editingTaskCategoryId === null) {
        res = await fetch(`${apiBaseUrl}/api/task_categories`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": csrfToken ?? "",
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${apiBaseUrl}/api/task_categories/${editingTaskCategoryId}`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": csrfToken ?? "",
          },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error(editingTaskCategoryId ? '更新失敗' : '追加失敗');
      const savedTaskCategory = await res.json();

      if (editingTaskCategoryId === null) {
        setTaskCategorys((prev) => [...prev, savedTaskCategory]);
      } else {
        setTaskCategorys((prev) => prev.map((r) => r.id === editingTaskCategoryId ? savedTaskCategory : r));
      }

      // リセット
      setAddTaskCategoryOpen(false);
      setEditingTaskCategoryId(null);
      setTaskCategoryName("");
      setTaskCategorySlug("");

    } catch (error) {
      alert(error.message || "保存に失敗しました");
    }
  };

  // 編集時フォームにセット
  const handleEditTaskCategory = (task_categories: { id: number; name: string; slug: number;}) => {
    setEditingTaskCategoryId(task_categories.id);
    setTaskCategoryName(task_categories.name);
    setTaskCategorySlug(task_categories.slug);
    setAddTaskCategoryOpen(true);
  };

  // 削除
  const handleDeleteTaskCategory = async (id: number) => {
    const csrfToken = getCookie("XSRF-TOKEN");

    try {
      const res = await fetch(`${apiBaseUrl}/api/task_categories/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": csrfToken ?? "",
        },
      });
      if (!res.ok) throw new Error('削除失敗');
      setTaskCategorys(prev => prev.filter(r => r.id !== id));
      setDeleteTaskCategoryOpen(false);
    } catch (error) {
      alert(error.message || "削除に失敗しました");
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 max-w-xl mx-auto">
      {/* ヘッダー */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <CopyPlus className="w-5 h-5 text-purple-500" />
                タスクカテゴリマスタ
              </h1>
              <p className="text-sm text-gray-600">タスクのカテゴリを管理</p>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4 pb-24 space-y-6">

        {/* カテゴリ追加ボタン */}
        <Dialog 
          open={addTaskCategoryOpen} 
          onOpenChange={(open) => {
            setAddTaskCategoryOpen(open)
            if (open) {
              // モーダルが開いた時にリセット
              setTaskCategoryName("")
              setTaskCategorySlug("")
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="w-full bg-gradient-to-r bg-gradient-to-r from-green-400 to-sky-400 hover:to-indigo-500 text-white rounded-2xl h-12">
              <Plus className="w-4 h-4 mr-2" />
              新しいカテゴリを追加
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-xl flex justify-center items-center gap-1"><CopyPlus className="w-5 h-5" /> 新しいカテゴリ</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-700 font-medium">
                  カテゴリ名
                </Label>
                <Input
                  id="name"
                  value={categoryName}
                  onChange={(e) => setTaskCategoryName(e.target.value)}
                  placeholder="例：宿題"
                  className="mt-1 rounded-2xl"
                />
              </div>
              <div>
                <Label htmlFor="points" className="text-gray-700 font-medium">
                  スラッグ
                </Label>
                <Input
                  id="points"
                  type="text"
                  value={categorySlug}
                  onChange={(e) => setTaskCategorySlug(e.target.value)}
                  placeholder="homework"
                  className="mt-1 rounded-2xl"
                />
              </div>
              <Button
                onClick={handleSaveTaskCategory}
                className="w-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl h-12"
              >
                {editingTaskCategoryId ? "保存する" : "カテゴリを追加"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* カテゴリ一覧 */}
        {task_categories.length > 0 && (
          <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CopyPlus className="w-5 h-5 text-purple-500" />
                カテゴリ一覧
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {task_categories.map((category) => {
                  return (
                  <Card key={category.id} className="border border-gray-200 rounded-2xl">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div>
                            <h3 className="font-medium text-gray-800">{category.name}</h3>
                          </div>
                        </div>
                        <div className="flex justify-end items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                            onClick={() => handleEditTaskCategory(category)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setDeletingTaskCategory(category);
                              setDeleteTaskCategoryOpen(true);
                            }}
                            className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 削除モーダル */}
        <Dialog open={deleteTaskCategoryOpen} onOpenChange={setDeleteTaskCategoryOpen}>
          <DialogContent className="rounded-3xl max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-xl text-red-600 flex justify-center gap-2">
                <TriangleAlert className="w-6 h-6" /> カテゴリの削除
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-center">
              <p className="text-gray-700">
                「<strong>{deletingTaskCategory?.name}</strong>」を削除してもよろしいですか？
              </p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 rounded-2xl" onClick={() => setDeleteTaskCategoryOpen(false)}>
                  キャンセル
                </Button>
                <Button
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-2xl"
                  onClick={() => {
                    if (!deletingTaskCategory) return;
                    handleDeleteTaskCategory(deletingTaskCategory.id);
                    setDeletingTaskCategory(null);
                    setDeleteTaskCategoryOpen(false);
                  }}
                >
                  削除する <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <ParentNavigation />
    </div>
  )
}
