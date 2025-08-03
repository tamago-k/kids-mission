"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Gift, History, Star, Trophy, PiggyBank, ThumbsUp, ArrowLeft } from "lucide-react"
import { ChildNavigation } from "@/components/navigation/ChildNavigation"
import { rewardIconOptions } from "@/components/OptionThemes"

export default function ChildRewardsPage() {
  const [rewardDialogOpen, setRewardDialogOpen] = useState(false)
  const [rewardItem, setRewardItem] = useState<{ id: number; name: string; need_reward: number; icon: string } | null>(null)
  const [currentBalance, setCurrentBalance] = useState(0)
  const [rewardHistory, setRewardHistory] = useState<RewardRequest[]>([]);
  const [suggestedRewards, setSuggestedRewards] = useState<Reward[]>([])
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  type Reward = {
    id: number;
    name: string;
    icon: string;
    need_reward: number;
    created_at: string;
    updated_at: string;
  };

  type User = {
    id: number;
    name: string;
    role: string;
    avatar: string;
    theme: string;
    created_at: string;
    updated_at: string;
  };

  type RewardRequest = {
    id: number;
    reward_id: number;
    status: string;
    requested_at: string;
    created_at: string;
    updated_at: string;
    reward: Reward;
    user_id: number;
    user: User;
  };

  // クッキーからCSRFトークンを取得するユーティリティ
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return decodeURIComponent(parts.pop()!.split(';').shift()!)
    return null
  }

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      // ポイント数取得
      const resBalance = await fetch(`${apiBaseUrl}/api/reward-balance`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      if (!resBalance.ok) throw new Error("ポイント数の取得に失敗しました")
      const balanceData = await resBalance.json()
      setCurrentBalance(balanceData.balance)

      // おすすめポイント取得
      const resRewards = await fetch(`${apiBaseUrl}/api/rewards`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      if (!resRewards.ok) throw new Error("ポイントの取得に失敗しました")
      const rewardsData = await resRewards.json()
      setSuggestedRewards(rewardsData)

      // ポイント履歴は別API想定
      const resHistory = await fetch(`${apiBaseUrl}/api/reward-requests`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      if (!resHistory.ok) throw new Error("履歴の取得に失敗しました")
      const historyData = await resHistory.json()
      setRewardHistory(historyData.requests ?? [])

    } catch (e) {
      if (e instanceof Error) {
        alert(e.message)
      } else {
        alert("データの取得に失敗しました")
      }
    }
  }, [apiBaseUrl])

  useEffect(() => {
    fetchData()
  }, [fetchData])


  // ポイント申請処理
  const handleRequestReward = async () => {
    if (!rewardItem) return alert("ポイントを選択してください")

    if (rewardItem.need_reward > currentBalance) {
      return alert("ポイントが足りません")
    }

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${apiBaseUrl}/api/reward-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reward_id: rewardItem.id,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || "申請に失敗しました")
      }

      setRewardDialogOpen(false)
      fetchData() // 最新情報取得（残高、履歴更新）
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message)
      } else {
        alert("申請に失敗しました")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 max-w-xl mx-auto pb-[100px]">
      {/* ヘッダー */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => window.history.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <PiggyBank className="w-6 h-6" /> 
                ポイント
              </h1>
              <p className="text-sm text-gray-600">がんばったぶんだけたまるよ！</p>
            </div>
          </div>
        </div>
      </div>

      {/* ポイント数カード */}
      <Card className="border-0 shadow-lg rounded-3xl bg-gradient-to-r from-purple-400 to-pink-400 text-white m-4">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold flex gap-1 items-center"><PiggyBank className="w-6 h-6" /> ポイント数</h2>
            <div className="text-4xl font-bold">{currentBalance} P</div>
          </div>
          <div className="text-6xl opacity-20"><ThumbsUp className="w-15 h-15" /></div>
        </CardContent>
      </Card>

      {/* おすすめポイント */}
      <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm m-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Star className="w-5 h-5 text-yellow-500" />
            おすすめポイント
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {suggestedRewards.map((reward: Reward) => {
              const rewardIconObj = rewardIconOptions.find(icon => icon.id === reward?.icon);
              const IconComponent = rewardIconObj ? rewardIconObj.Icon : null;

              return (
                <Button
                  key={reward.id}
                  variant="outline"
                  className={`h-auto p-4 rounded-2xl border-2 flex flex-col items-center gap-2 whitespace-normal break-words ${
                    currentBalance >= (reward?.need_reward ?? 0)
                      ? "border-green-200 hover:border-green-300 hover:bg-green-50"
                      : "border-gray-200 opacity-50 cursor-not-allowed"
                  }`}
                  disabled={currentBalance < (reward?.need_reward ?? 0)}
                  onClick={() => {
                    setRewardItem(reward);
                    setRewardDialogOpen(true);
                  }}
                >
                  {IconComponent ? <IconComponent className="min-w-[30px] min-h-[30px]" /> : "未設定"}

                  <div className="text-center">
                    <div className="font-medium text-sm">{reward?.name ?? "名前なし"}</div>
                    <div className="text-xs text-gray-600">{reward?.need_reward ?? 0}P</div>
                  </div>
                </Button>
              );
            })}

          </div>
        </CardContent>
      </Card>

      {/* ポイント履歴 */}
      <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm m-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="w-5 h-5 text-blue-500" />
            ポイントりれき
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {rewardHistory.map((item: RewardRequest) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    item.status === "earned" ? "bg-green-100" : "bg-purple-100"
                  }`}
                >
                  {item.status === "earned" ? (
                    <Trophy className="w-5 h-5 text-green-600" />
                  ) : (
                    <Gift className="w-5 h-5 text-purple-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{item.reward?.name}</h4>
                  <p className="text-sm text-gray-600">
                    {item.requested_at
                      ? new Date(item.requested_at).toLocaleDateString("ja-JP", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })
                      : "不明"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`font-bold ${
                    item.status === "approved" 
                    ? "text-green-600" 
                    : item.status === "submitted" 
                    ? "text-yellow-600"
                    : item.status === "rejected"
                    ? "text-red-600"
                    : "text-purple-600" 
                  }`}
                >
                  {item.status === "earned" ? "+" : "-"}
                  {item.reward?.need_reward}P
                </div>
                <Badge
                  className={`text-xs ${
                    item.status === "approved"
                      ? "bg-green-100 text-green-600"
                      : item.status === "submitted"
                      ? "bg-yellow-100 text-yellow-600"
                      : item.status === "rejected"
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {item.status === "submitted"
                    ? "かくにん中"
                    : item.status === "approved"
                    ? "OK"
                    : item.status === "rejected"
                    ? "NG"
                    : ""}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ポイント申請モーダル */}
      <Dialog open={rewardDialogOpen} onOpenChange={setRewardDialogOpen}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl text-green-600 flex justify-center gap-2">
              <Gift className="w-5 h-5" /> ポイントの申請
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            {(() => {
              const rewardIconObj = rewardIconOptions.find((icon) => icon.id === rewardItem?.icon);
              const IconComponent = rewardIconObj?.Icon;

              return (
                <p className="text-gray-700">
                  「<strong className="inline-flex items-center gap-2 justify-center">
                    {IconComponent ? <IconComponent className="w-4 h-4" /> : <span>未設定</span>}
                    {rewardItem?.name}
                  </strong>」を申請しますか？
                </p>
              );
            })()}
            <p className="text-gray-600 text-sm">
              必要ポイント：<span className="font-bold">{rewardItem?.need_reward}P</span>
            </p>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1 rounded-2xl" onClick={() => setRewardDialogOpen(false)}>
                キャンセル
              </Button>
              <Button
                className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-2xl"
                onClick={handleRequestReward}
              >
                申請する
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ナビゲーション */}
      <ChildNavigation />
    </div>
  )
}