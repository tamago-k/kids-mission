"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, CopyPlus, TriangleAlert, ArrowLeft } from "lucide-react"
import { ParentNavigation } from "@/components/navigation/ParentNavigation"

export default function ParentMasterPage() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const [addCategoryOpen, setAddCategoryOpen] = useState(false)
  const [categoryName, sekCategoryName] = useState("")
  const [categorySlug, sekCategorySlug] = useState("")
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null)
  const [categories, setCategories] = useState<Category[]>([]);
  const [deleteCategoryOpen, setDeleteCategoryOpen] = useState(false)
  const [deletingCategory, setDeletingCategory] = useState<{ id: number; name: string } | null>(null);

  type Category = {
    id: number;
    name: string;
    slug: string;
  };

  const fetchCategories = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${apiBaseUrl}/api/task-categories`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('カテゴリの取得に失敗');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : data.categories ?? []);
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      } else {
        alert("カテゴリの取得に失敗しました");
      }
    }
  }, [apiBaseUrl]);

  // 初期データ読み込み
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);


  // 保存（新規 or 更新）
  const handleSaveCategory = async () => {
    if (!categoryName || !categorySlug) return alert("すべての項目を入力してください");

    const token = localStorage.getItem("token");
    const payload = {
        name: categoryName,
        slug: categorySlug,
    };

    try {
        // ★★★★ この部分をシンプルに書き換えてみてください ★★★★
        const url = `${apiBaseUrl}/api/task-categories/${editingCategoryId}`;
        console.log("テスト用URL:", url);

        const res = await fetch(url, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        // ★★★★ ここまで ★★★★

        console.log("fetch APIからレスポンスが返ってきました。ステータス:", res.status);

        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            console.error("fetch レスポンスがOKではありません。エラーデータ:", errorData);
            throw new Error(editingCategoryId ? '更新失敗' : '追加失敗');
        }

        // リセット
        setAddCategoryOpen(false);
        setEditingCategoryId(null);
        sekCategoryName("");
        sekCategorySlug("");
        await fetchCategories();

    } catch (error) {
        console.error("fetch API呼び出し中にエラーが発生しました:", error);
        if (error instanceof Error) {
            alert(error.message);
        } else {
            alert("保存に失敗しました");
        }
    }
};

  // 編集時フォームにセット
  const handleEditCategory = (Category: Category) => {
    setEditingCategoryId(Category.id);
    sekCategoryName(Category.name);
    sekCategorySlug(Category.slug);
    setAddCategoryOpen(true);
  };

  // 削除
  const handleDeleteCategory = async (id: number) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${apiBaseUrl}/api/task-categories/${id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('削除失敗');
      setCategories(prev => prev.filter(r => r.id !== id));
      setDeleteCategoryOpen(false);
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      } else {
        alert("削除に失敗しました");
      }
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 max-w-xl mx-auto">
      {/* ヘッダー */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => window.history.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <CopyPlus className="w-6 h-6" /> 
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
          open={addCategoryOpen} 
          onOpenChange={(open) => {
            setAddCategoryOpen(open)
            if (open) {
              // モーダルが開いた時にリセット
              sekCategoryName("")
              sekCategorySlug("")
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
              <DialogTitle className="text-center text-xl flex justify-center items-center gap-1"><CopyPlus className="w-5 h-5" /> {editingCategoryId ? "カテゴリを編集" : "新しいカテゴリ"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-700 font-medium">
                  カテゴリ名
                </Label>
                <Input
                  id="name"
                  value={categoryName}
                  onChange={(e) => sekCategoryName(e.target.value)}
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
                  onChange={(e) => sekCategorySlug(e.target.value)}
                  placeholder="homework"
                  className="mt-1 rounded-2xl"
                />
              </div>
              <Button
                onClick={handleSaveCategory}
                className="w-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl h-12"
              >
                {editingCategoryId ? "保存する" : "カテゴリを追加"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* カテゴリ一覧 */}
        {categories.length > 0 && (
          <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CopyPlus className="w-5 h-5 text-purple-500" />
                カテゴリ一覧
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {categories.map((category) => {
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
                            onClick={() => handleEditCategory(category)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setDeletingCategory(category);
                              setDeleteCategoryOpen(true);
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
        <Dialog open={deleteCategoryOpen} onOpenChange={setDeleteCategoryOpen}>
          <DialogContent className="rounded-3xl max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-xl text-red-600 flex justify-center gap-2">
                <TriangleAlert className="w-6 h-6" /> カテゴリの削除
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-center">
              <p className="text-gray-700">
                「<strong>{deletingCategory?.name}</strong>」を削除してもよろしいですか？
              </p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 rounded-2xl" onClick={() => setDeleteCategoryOpen(false)}>
                  キャンセル
                </Button>
                <Button
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-2xl"
                  onClick={() => {
                    if (!deletingCategory) return;
                    handleDeleteCategory(deletingCategory.id);
                    setDeletingCategory(null);
                    setDeleteCategoryOpen(false);
                  }}
                >
                  削除する <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {/* ナビゲーション */}
      <ParentNavigation />
    </div>
  )
}
