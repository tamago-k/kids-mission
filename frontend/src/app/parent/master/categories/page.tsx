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
  // カテゴリ追加用のモーダルを開くかどうかを管理
  const [addCategoryOpen, setAddCategoryOpen] = useState(false)
  // カテゴリ名の入力値を保持するstate
  const [categoryName, setCategoryName] = useState("")
  // カテゴリslugの入力値を保持するstate
  const [categorySlug, setCategorySlug] = useState("")
  // 編集中のカテゴリのIDを保持。新規はnull
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null)
  // カテゴリの一覧を配列として保持するstate
  const [categories, setCategories] = useState<Category[]>([]);
  // 削除確認ダイアログの開閉状態を管理
  const [deleteCategoryOpen, setDeleteCategoryOpen] = useState(false)
  // 削除対象のカテゴリ情報を保持
  const [deletingCategory, setDeletingCategory] = useState<{ id: number; name: string } | null>(null);
  // 環境変数からAPI URL取得
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  //　タスクカテゴリデータの型定義
  type Category = {
    id: number;
    name: string;
    slug: string;
  };

  // サーバーからタスクカテゴリ一覧を取得する非同期関数を定義（useCallbackでメモ化）
  const fetchCategories = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      // GET /api/task-categories を叩いてタスクカテゴリ一覧を取得
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

  //　初回マウント時に実行
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);


  // フォーム送信時の保存処理（新規・更新）
  const handleSaveCategory = async () => {
    
    // 必須項目が未入力なら保存を中断
    if (!categoryName || !categorySlug) return alert("すべての項目を入力してください");
    const token = localStorage.getItem("token");

    // 送信用のペイロードを作成
    const payload = {
        name: categoryName,
        slug: categorySlug,
    };

    try {
        let res;
        // 新規追加かどうかを判定
        if (editingCategoryId === null) {
          // POST /api/task-categories を叩いて新規追加リクエストを送信
          res = await fetch(`${apiBaseUrl}/api/task-categories`, {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });
        } else {
          // PUT /api/task-categories/${editingCategoryId} を叩いて更新リクエストを送信
          res = await fetch(`${apiBaseUrl}/api/task-categories/${editingCategoryId}`, {
            method: 'PUT',
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });
        }

        // フォーム状態をリセット
        setAddCategoryOpen(false);
        setEditingCategoryId(null);
        setCategoryName("");
        setCategorySlug("");
        await fetchCategories();

    } catch (error) {
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
    setCategoryName(Category.name);
    setCategorySlug(Category.slug);
    setAddCategoryOpen(true);
  };

  // 指定IDのタスクカテゴリを削除
  const handleDeleteCategory = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      // DELETE /api/task-categories/${id} を叩いて削除リクエストを送信
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
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-20">
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
              setCategoryName("")
              setCategorySlug("")
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="w-full bg-gradient-to-r bg-gradient-to-r from-green-400 to-sky-400 hover:to-indigo-500 text-white rounded-2xl h-12 bottom-[60px] left-1/2 transform -translate-x-1/2 fixed z-10 max-w-sm">
              <Plus className="w-4 h-4 mr-2" />
              新しいカテゴリを追加
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-xl flex justify-center items-center gap-1"><CopyPlus className="w-6 h-6" />{editingCategoryId ? "カテゴリを編集" : "新しいカテゴリ"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-700 font-medium">
                  カテゴリ名
                </Label>
                <Input
                  id="name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
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
                  onChange={(e) => setCategorySlug(e.target.value)}
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
