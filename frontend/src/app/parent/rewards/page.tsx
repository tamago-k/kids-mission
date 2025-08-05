"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Gift, CheckCircle2, XCircle, TriangleAlert, ArrowLeft, ClipboardCheck, CheckCircle, PiggyBank } from "lucide-react"
import { ParentNavigation } from "@/components/navigation/ParentNavigation"
import { Badge } from "@/components/ui/badge"
import { colorThemes, iconOptions } from "@/components/OptionThemes"


export default function RewardUsageApproval() {
  // 報酬申請データの配列を保持するstate
  const [requests, setRequests] = useState<RewardUsageRequest[]>([])
  // ローディング状態の setter だけ使用
  const [, setLoading] = useState(false)
  // 承認・却下の「確認ダイアログ」が開いているかどうかを管理
  const [dialogOpen, setDialogOpen] = useState(false)
  // 現在「操作対象になっている申請（承認または却下）」を保持
  const [selectedRequest, setSelectedRequest] = useState<RewardUsageRequest | null>(null)
  // requests の中から、ステータスが "submitted" のものだけを抽出した一覧
  const submittedRequests = requests.filter(req => req.status === "submitted")
  // 承認 or 却下 のどちらのアクションを実行するかを保持
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null)
  // 各子どもの ID をキーに、残ポイント・名前を保持するマップ
  const [balancesMap, setBalancesMap] = useState<Record<number, { balance: number; name: string }>>({});
  // 環境変数からAPI URL取得
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  //　ユーザーデータの型定義
  type User = {
    id: number;
    name: string;
    avatar: string;
    theme?: string;
  };

  //　報酬リクエストデータの型定義
  type RewardUsageRequest = {
    id: number;
    reward_name: string;
    points: number;
    child_name: string;
    requested_at: string;
    status: "submitted" | "approved" | "rejected";
    user?: User;
    reward?: {
      name: string;
      need_reward: number;
    };
  };

  // サーバーからポイント数一覧を取得する非同期関数を定義（useCallbackでメモ化）
  const fetchAllBalances = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      // GET /api/reward-balances を叩いてポイント数一覧を取得
      const res = await fetch(`${apiBaseUrl}/api/reward-balances`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("ポイント一覧の取得に失敗しました");
      const data = await res.json();

      // user_id → balance の Map に変換
      const map: Record<number, { 
        balance: number; 
        name: string 
      }> = {};
      data.balances.forEach((item: { 
        user_id: number; 
        balance: number; 
        name: string 
      }) => {
        map[item.user_id] = { 
          balance: item.balance, 
          name: item.name 
        };
      });

      setBalancesMap(map);
    } catch (e) {
      console.error(e);
      setBalancesMap({});
    }
  }, [apiBaseUrl]);

  // サーバーから報酬申請一覧を取得する非同期関数を定義（useCallbackでメモ化）
  const fetchRequests = useCallback(async () => {
    setLoading(true)
    const token = localStorage.getItem("token");
    try {
      // GET /api/reward-requests を叩いて報酬申請一覧を取得
      const res = await fetch(`${apiBaseUrl}/api/reward-requests`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) throw new Error("申請リストの取得に失敗しました")
      const data = await res.json()
      setRequests(data.requests ?? [])
    } catch (e: unknown) {
      if (e instanceof Error) {
        alert(e.message || "申請リストの取得に失敗しました")
      } else {
        alert("申請リストの取得に失敗しました")
      }
    } finally {
      setLoading(false)
    }
  }, [apiBaseUrl]);

  //　初回マウント時に実行
  useEffect(() => {
    fetchAllBalances()
    fetchRequests()
  }, [fetchRequests])


  // 報酬申請（req）とアクションの種類（承認 or 却下）を受け取って、確認ダイアログを開く関数
  const openDialog = (req: RewardUsageRequest, type: "approve" | "reject") => {
    setSelectedRequest(req)
    setActionType(type)
    setDialogOpen(true)
  }

  // 承認または却下を実行する関数
  const handleAction = async () => {

    //リクエストとアクションタイプの両方がないと中断
    if (!selectedRequest || !actionType) return
    const token = localStorage.getItem("token");

    try {
      // POST /api/reward-requests/${selectedRequest.id}/${actionType} を叩いて承認・却下リクエストを送信
      const res = await fetch(`${apiBaseUrl}/api/reward-requests/${selectedRequest.id}/${actionType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error(actionType === "approve" ? "承認に失敗しました" : "却下に失敗しました")

      setRequests((prev) => prev.filter((r) => r.id !== selectedRequest.id))
      setDialogOpen(false)
      setSelectedRequest(null)
      setActionType(null)
    } catch (e: unknown) {
      if (e instanceof Error) {
        alert(e.message || "処理に失敗しました")
      } else {
        alert("処理に失敗しました")
      }
    }
  }

  // 色テーマの配列から指定されたテーマのグラデーションCSSクラスを取得
  const getBgClassByTheme = (themeValue?: string) => {
    const theme = colorThemes.find(t => t.value === themeValue)
    return theme ? theme.gradient : "bg-gray-100"
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
                <Gift className="w-6 h-6" /> 
                ポイント状況
              </h1>
              <p className="text-sm text-gray-600">ポイントの確認・申請管理画面</p>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4 pb-24 space-y-6">

        {/* --- ポイント一覧 --- */}
        <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PiggyBank className="w-6 h-6" />
              子どものポイント一覧
            </CardTitle>
          </CardHeader>
          <div className="grid grid-cols-2 gap-4 p-4 pt-0">
            {Object.entries(balancesMap).map(([userId, { balance, name }]) => (
              <Card
                key={userId}
                className="border-0 shadow-lg rounded-3xl bg-gradient-to-r from-green-400 to-blue-400 text-white"
              >
                <CardContent className="p-4 text-center">
                  <div className="text-xl font-semibold">{name}</div>
                  <div className="text-2xl font-bold">{balance}P</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Card>

        {/* --- 申請一覧 --- */}
        {submittedRequests.length > 0 ? (
          <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ClipboardCheck className="w-6 h-6" />
                申請中のポイント
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {submittedRequests.map((req) => {
                const iconObj = iconOptions.find(icon => icon.id === req.user?.avatar)

                return (
                  <Card key={req.id} className="border border-gray-200 rounded-2xl mb-6 p-4">
                    <div className="flex gap-2 justify-between">
                      <div className="text-sm text-gray-500">
                        <div className={`flex items-center gap-1 rounded-2xl p-1 pr-3 pl-3 bg-gradient-to-r text-white ${getBgClassByTheme(
                          req.user?.theme
                        )}`}>
                          {iconObj ? <iconObj.Icon /> : "未設定"}
                          {req.user?.name || "未設定"}
                        </div>
                      </div>
                      <div className="flex item-center flex-col">
                        <Badge className="bg-purple-100 text-purple-600">
                          <PiggyBank className="w-4 h-4" />
                          {req.reward?.need_reward}P
                        </Badge>
                        <Badge className="mt-1 flex justify-center bg-yellow-100 text-yellow-600">
                          申請中
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-700 mt-3 font-semibold">ポイント名: {req.reward?.name}</p>
                    <p className="mt-2 text-xs text-gray-500">申請日: {new Date(req.requested_at).toLocaleDateString()}</p>
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl"
                        onClick={() => openDialog(req, "approve")}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        承認
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-red-200 text-red-600 hover:bg-red-50 rounded-xl bg-transparent"
                        onClick={() => openDialog(req, "reject")}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        却下
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ClipboardCheck className="w-6 h-6" />
                申請中のポイント
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center text-gray-500 py-6">
            </CardContent>
          </Card>
        )}


      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 justify-center text-lg font-semibold">
              {actionType === "approve" ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-green-600" /> 承認確認
                </>
              ) : (
                <>
                  <TriangleAlert className="w-6 h-6 text-red-600" /> 却下確認
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="text-center mt-2">
            <p className="text-gray-700 mb-4">
              {actionType === "approve" ? "承認" : "却下"}しますか？
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                キャンセル
              </Button>
              <Button
                className={`rounded-2xl ${
                  actionType === "approve"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
                onClick={handleAction}
              >
                {actionType === "approve" ? "承認する" : "却下する"}
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
