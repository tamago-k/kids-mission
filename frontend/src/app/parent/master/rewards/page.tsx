"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Gift, TriangleAlert, ArrowLeft } from "lucide-react"
import { ParentNavigation } from "@/components/navigation/ParentNavigation"
import { rewardIconOptions } from "@/components/OptionThemes"

export default function ParentMasterPage() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const [addRewardOpen, setAddRewardOpen] = useState(false)
  const [rewardName, setRewardName] = useState("")
  const [rewardPoints, setRewardPoints] = useState("")
  const [editingRewardId, setEditingRewardId] = useState<number | null>(null)
  const [rewards, setRewards] = useState([])
  const [formRewardIcon, setFormRewardIcon] = useState(rewardIconOptions[0].id)
  const [deleteRewardOpen, setDeleteRewardOpen] = useState(false)
  const [deletingReward, setDeletingReward] = useState<{ id: number; name: string } | null>(null);

  // 初期データ読み込み
  useEffect(() => {
    fetchRewards();
  }, []);

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift()!);
    return null;
  };

  const fetchRewards = async () => {
    const csrfToken = getCookie("XSRF-TOKEN");
    try {
      const res = await fetch(`${apiBaseUrl}/api/rewards`, {
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": csrfToken ?? "",
        },
      });
      if (!res.ok) throw new Error('報酬の取得に失敗');
      const data = await res.json();
      setRewards(Array.isArray(data) ? data : data.rewards ?? []);
    } catch (e) {
      alert(e.message || "報酬の取得に失敗しました");
    }
  };

  // 保存（新規 or 更新）
  const handleSaveReward = async () => {
    if (!rewardName || !rewardPoints || !formRewardIcon) return alert("すべての項目を入力してください");

    const csrfToken = getCookie("XSRF-TOKEN");
    const payload = {
      name: rewardName,
      icon: formRewardIcon,
      need_reward: Number(rewardPoints),
    };

    try {
      let res;
      if (editingRewardId === null) {
        res = await fetch(`${apiBaseUrl}/api/rewards`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": csrfToken ?? "",
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${apiBaseUrl}/api/rewards/${editingRewardId}`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": csrfToken ?? "",
          },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error(editingRewardId ? '更新失敗' : '追加失敗');
      const savedReward = await res.json();

      if (editingRewardId === null) {
        setRewards((prev) => [...prev, savedReward]);
      } else {
        setRewards((prev) => prev.map((r) => r.id === editingRewardId ? savedReward : r));
      }

      // リセット
      setAddRewardOpen(false);
      setEditingRewardId(null);
      setRewardName("");
      setRewardPoints("");
      setFormRewardIcon(rewardIconOptions[0].id);

    } catch (error) {
      alert(error.message || "保存に失敗しました");
    }
  };

  // 編集時フォームにセット
  const handleEditReward = (reward: { id: number; name: string; points: number; icon: string }) => {
    setEditingRewardId(reward.id);
    setRewardName(reward.name);
    setRewardPoints(reward.need_reward?.toString() ?? "");
    setFormRewardIcon(reward.icon);
    setAddRewardOpen(true);
  };

  // 削除
  const handleDeleteReward = async (id: number) => {
    const csrfToken = getCookie("XSRF-TOKEN");

    try {
      const res = await fetch(`${apiBaseUrl}/api/rewards/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": csrfToken ?? "",
        },
      });
      if (!res.ok) throw new Error('削除失敗');
      setRewards(prev => prev.filter(r => r.id !== id));
      setDeleteRewardOpen(false);
    } catch (error) {
      alert(error.message || "削除に失敗しました");
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
                <Gift className="w-6 h-6" /> 
                報酬マスタ
              </h1>
              <p className="text-sm text-gray-600">ポイントで交換できる報酬の設定</p>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4 pb-24 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-0 shadow-lg rounded-3xl bg-gradient-to-r from-purple-400 to-pink-400 text-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{rewards.length}</div>
              <div className="text-sm text-purple-100">登録済み報酬</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg rounded-3xl bg-gradient-to-r from-green-400 to-blue-400 text-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">
                {rewards.length > 0 
                  ? Math.min(...rewards.map((r) => Number(r.need_reward) || Infinity)) 
                  : 0}
              </div>
              <div className="text-sm text-green-100">最低ポイント</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg rounded-3xl bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">
                {rewards.length > 0 
                  ? Math.max(...rewards.map((r) => Number(r.need_reward) || -Infinity)) 
                  : 0}
              </div>
              <div className="text-sm text-yellow-100">最高ポイント</div>
            </CardContent>
          </Card>
        </div>

        {/* 報酬追加ボタン */}
        <Dialog 
          open={addRewardOpen} 
          onOpenChange={(open) => {
            setAddRewardOpen(open)
            if (open) {
              // モーダルが開いた時にリセット
              setRewardName("")
              setRewardPoints("")
              setFormRewardIcon(rewardIconOptions[0].id)
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="w-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl h-12">
              <Plus className="w-4 h-4 mr-2" />
              新しい報酬を追加
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-xl flex justify-center items-center gap-1"><Gift className="w-5 h-5" /> 新しい報酬</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-700 font-medium">
                  報酬名
                </Label>
                <Input
                  id="name"
                  value={rewardName}
                  onChange={(e) => setRewardName(e.target.value)}
                  placeholder="例：ゲーム時間30分"
                  className="mt-1 rounded-2xl"
                />
              </div>
              <div>
                <Label htmlFor="points" className="text-gray-700 font-medium">
                  必要ポイント
                </Label>
                <Input
                  id="points"
                  type="number"
                  value={rewardPoints}
                  onChange={(e) => setRewardPoints(e.target.value)}
                  placeholder="150"
                  className="mt-1 rounded-2xl"
                />
              </div>
              <div>
                <Label className="text-gray-700 font-medium">アイコンを選択</Label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {rewardIconOptions.map((icon) => (
                    <Button
                      key={icon.id}
                      type="button"
                      variant={formRewardIcon === icon.id ? "default" : "outline"}
                      className={`h-12 rounded-2xl ${
                        formRewardIcon === icon.id
                          ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white"
                          : "bg-white"
                      }`}
                      onClick={() => setFormRewardIcon(icon.id)}
                    >
                      <icon.Icon className="w-5 h-5" />
                    </Button>
                  ))}
                </div>
              </div>
              <Button
                onClick={handleSaveReward}
                className="w-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl h-12"
              >
                {editingRewardId ? "保存する" : "報酬を追加"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* 報酬一覧 */}
        <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Gift className="w-5 h-5 text-purple-500" />
              報酬一覧
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {rewards.map((reward) => {
                const rewardIconObj = rewardIconOptions.find((icon) => icon.id === reward.icon);
                return (
                  <Card key={reward.id} className="border border-gray-200 rounded-2xl">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
                            {rewardIconObj ? <rewardIconObj.Icon className="w-6 h-6" /> : "未設定"}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">{reward.name}</h3>
                            <p className="text-sm text-gray-600">{reward.need_reward}ポイント必要</p>
                          </div>
                        </div>
                        <div className="flex justify-end flex-col items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                            onClick={() => handleEditReward(reward)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setDeletingReward(reward);
                              setDeleteRewardOpen(true);
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

        {/* 削除モーダル */}
        <Dialog open={deleteRewardOpen} onOpenChange={setDeleteRewardOpen}>
          <DialogContent className="rounded-3xl max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-xl text-red-600 flex justify-center gap-2">
                <TriangleAlert className="w-6 h-6" /> 報酬の削除
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-center">
              <p className="text-gray-700">
                「<strong>{deletingReward?.name}</strong>」を削除してもよろしいですか？
              </p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 rounded-2xl" onClick={() => setDeleteRewardOpen(false)}>
                  キャンセル
                </Button>
                <Button
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-2xl"
                  onClick={() => {
                    if (!deletingReward) return;
                    handleDeleteReward(deletingReward.id);
                    setDeletingReward(null);
                    setDeleteRewardOpen(false);
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
