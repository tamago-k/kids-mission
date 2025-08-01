"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2,  Award, Medal, ArrowLeft, TriangleAlert } from "lucide-react"
import { ParentNavigation } from "@/components/navigation/ParentNavigation"
import { badgeIconOptions } from "@/components/OptionThemes"

export default function ParentMasterPage() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const [addBadgeOpen, setAddBadgeOpen] = useState(false)
  const [badgeName, setBadgeName] = useState("")
  const [badgeCondition, setBadgeCondition] = useState("")
  const [editingBadgeId, setEditingBadgeId] = useState<number | null>(null)
  const [badges, setBadges] = useState<Badge[]>([])
  const [formBadgeIcon, setFormBadgeIcon] = useState(badgeIconOptions[0].id)
  const [deleteBadgeOpen, setDeleteBadgeOpen] = useState(false);
  const [deletingBadge, setDeletingBadge] = useState<{ id: number; name: string } | null>(null);

  type Badge = {
    id: number
    name: string
    icon: string
    condition: string
    is_active: boolean
  }

  // バッジ一覧取得
  const fetchBadges = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${apiBaseUrl}/api/badges`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("バッジの取得に失敗しました");
      const data = await res.json();
      setBadges(Array.isArray(data) ? data : data.badges ?? []);
      } catch (e) {
        if (e instanceof Error) {
          alert(e.message);
        } else {
          alert("バッジの取得に失敗しました");
        }
      }
  }, [apiBaseUrl]);

  // 初期データ読み込み
  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  // 保存（新規 or 更新）
  const handleSaveBadge = async () => {
    if (!badgeName || !formBadgeIcon|| !badgeCondition) return alert("すべての項目を入力してください");

    const token = localStorage.getItem("token");
    const payload = {
      name: badgeName,
      icon: formBadgeIcon,
      condition: badgeCondition,
    };

    try {
      let res;
      if (editingBadgeId === null) {
        res = await fetch(`${apiBaseUrl}/api/badges`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${apiBaseUrl}/api/badges/${editingBadgeId}`, {
          method: 'PUT',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error(editingBadgeId ? '更新失敗' : '追加失敗');
      const savedBadge = await res.json();

      if (editingBadgeId === null) {
        setBadges((prev) => [...prev, savedBadge]);
      } else {
        setBadges((prev) => prev.map((b) => (b.id === editingBadgeId ? savedBadge : b)));
      }

      // リセット
      setAddBadgeOpen(false);
      setEditingBadgeId(null);
      setBadgeName("");
      setFormBadgeIcon(badgeIconOptions[0].id);
      setBadgeCondition("");
      setDeleteBadgeOpen(false);

    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("保存に失敗しました");
      }
    }
  };

  // 編集時フォームにセット
  const handleEditBadge = (badge: {
    id: number;
    name: string;
    icon: string;
    condition: string;
  }) => {
    setEditingBadgeId(badge.id);
    setBadgeName(badge.name);
    setFormBadgeIcon(badge.icon);
    setBadgeCondition(badge.condition);
    setAddBadgeOpen(true);
    setDeleteBadgeOpen(false);
  };

  // 削除
  const handleDeleteBadge = async (id: number) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${apiBaseUrl}/api/badges/${id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('削除失敗');
      setBadges(prev => prev.filter(r => r.id !== id));
      setDeleteBadgeOpen(false);
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      } else {
        alert("削除に失敗しました");
      }
    }
  };

  // 表示用のON/OFF切替（
  const toggleBadgeActive = async (id: number) => {
    const badge = badges.find(b => b.id === id);
    if (!badge) return;

    const updatedBadge = { ...badge, is_active: !badge.is_active };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiBaseUrl}/api/badges/${id}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active: updatedBadge.is_active }),
      });
      if (!res.ok) throw new Error('更新失敗');

      const data = await res.json();
      setBadges((prev) => prev.map(b => (b.id === id ? data : b)));
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      } else {
        alert("更新に失敗しました");
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
                <Medal className="w-6 h-6" /> 
                バッジマスタ
              </h1>
              <p className="text-sm text-gray-600">条件達成で付与されるバッジの管理</p>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4 pb-24 space-y-6">
        {/* バッジ統計 */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-0 shadow-lg rounded-3xl bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{badges.length}</div>
              <div className="text-sm text-yellow-100">総バッジ数</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg rounded-3xl bg-gradient-to-r from-green-400 to-blue-400 text-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{badges.filter((b) => b.is_active).length}</div>
              <div className="text-sm text-green-100">有効なバッジ</div>
            </CardContent>
          </Card>
        </div>

        {/* バッジ追加ボタン */}
        <Dialog 
          open={addBadgeOpen} 
          onOpenChange={(open) => {
            setAddBadgeOpen(open)
            if (open) {
              // モーダルが開いた時にリセット
              setBadgeName("")
              setFormBadgeIcon("")
              setBadgeCondition("")
              setFormBadgeIcon(badgeIconOptions[0].id)
            }
          }}
          >
          <DialogTrigger asChild>
            <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white rounded-2xl h-12">
              <Plus className="w-4 h-4 mr-2" />
              新しいバッジを追加
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-xl">🏆 新しいバッジ</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="badgeName" className="text-gray-700 font-medium">
                  バッジ名
                </Label>
                <Input
                  id="badgeName"
                  value={badgeName}
                  onChange={(e) => setBadgeName(e.target.value)}
                  placeholder="例：タスク5個達成！"
                  className="mt-1 rounded-2xl"
                />
              </div>
              <div>
                <Label htmlFor="badgeCondition" className="text-gray-700 font-medium">
                  獲得条件（システム用）
                </Label>
                <Input
                  id="badgeCondition"
                  value={badgeCondition}
                  onChange={(e) => setBadgeCondition(e.target.value)}
                  placeholder='例：{"task_approve":{"gte":5,"category":"help"}}'
                  className="mt-1 rounded-2xl"
                />
              </div>
              <div>
                <Label className="text-gray-700 font-medium">絵文字を選択</Label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {badgeIconOptions.map((icon) => (
                    <Button
                      key={icon.id}
                      type="button"
                      variant={formBadgeIcon === icon.id ? "default" : "outline"}
                      className={`h-12 rounded-2xl ${
                        formBadgeIcon === icon.id
                          ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white"
                          : "bg-white"
                      }`}
                      onClick={() => setFormBadgeIcon(icon.id)}
                    >
                      <icon.Icon className="w-5 h-5" />
                    </Button>
                  ))}
                </div>
              </div>
              <Button
                onClick={handleSaveBadge}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white rounded-2xl h-12"
              >
                {editingBadgeId ? "保存する" : "バッジを追加"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* バッジ一覧 */}
        <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="w-5 h-5 text-yellow-500" />
              バッジ一覧
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {badges.map((badge) => {
                const Icon = badgeIconOptions.find(icon => icon.id === badge.icon)?.Icon;

                return (
                  <Card key={badge.id} className="border border-gray-200 rounded-2xl">
                    <CardContent className="p-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleBadgeActive(badge.id)}
                        className={`rounded-xl ${
                          badge.is_active
                            ? "border-green-200 text-white bg-green-400 w-full mb-2"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50 w-full mb-2"
                        }`}
                      >
                        {badge.is_active ? "有効" : "無効"}
                      </Button>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center justify-start gap-2">
                          <div
                            className={`min-w-12 min-h-12 rounded-full flex items-center justify-center text-2xl ${
                              badge.is_active ? "bg-yellow-100" : "bg-gray-100"
                            }`}
                          >
                            {Icon ? <Icon className="w-6 h-6 text-yellow-600" /> : "未設定"}
                          </div>
                          <div className="flex-grow">
                            <h3 className={`font-medium ${badge.is_active ? "text-gray-800" : "text-gray-500"}`}>
                              {badge.name}
                            </h3>
                            <p className="text-xs text-gray-400 mt-1">条件: {badge.condition}</p>
                          </div>
                        </div>
                        <div className="flex justify-end flex-col items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                            onClick={() => handleEditBadge(badge)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setDeletingBadge(badge);
                              setDeleteBadgeOpen(true);
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
      </div>

      {/* 削除モーダル */}
      <Dialog open={deleteBadgeOpen} onOpenChange={setDeleteBadgeOpen}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl text-red-600 flex justify-center gap-2">
              <TriangleAlert className="w-6 h-6" /> バッジの削除
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <p className="text-gray-700">
              「<strong>{deletingBadge?.name}</strong>」を削除してもよろしいですか？
            </p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 rounded-2xl" onClick={() => setDeleteBadgeOpen(false)}>
                キャンセル
              </Button>
              <Button
                className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-2xl"
                onClick={() => {
                  if (!deletingBadge) return;
                  handleDeleteBadge(deletingBadge.id);
                  setDeletingBadge(null);
                  setDeleteBadgeOpen(false);
                }}
              >
                削除する <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ナビゲーション */}
      <ParentNavigation />
    </div>
  )
}
