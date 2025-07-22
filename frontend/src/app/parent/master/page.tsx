"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Gift, Award, Settings } from "lucide-react"
import { ParentNavigation } from "@/components/navigation/parent-navigation"

export default function ParentMasterPage() {
  const [addRewardOpen, setAddRewardOpen] = useState(false)
  const [addBadgeOpen, setAddBadgeOpen] = useState(false)
  const [rewardName, setRewardName] = useState("")
  const [rewardPoints, setRewardPoints] = useState("")
  const [rewardEmoji, setRewardEmoji] = useState("")
  const [badgeName, setBadgeName] = useState("")
  const [badgeDescription, setBadgeDescription] = useState("")
  const [badgeEmoji, setBadgeEmoji] = useState("")
  const [badgeCondition, setBadgeCondition] = useState("")
  const [editingRewardId, setEditingRewardId] = useState<number | null>(null)
  const [editingBadgeId, setEditingBadgeId] = useState<number | null>(null)

  const [rewards, setRewards] = useState([
    { id: 1, name: "ゲーム時間30分", points: 150, emoji: "🎮" },
    { id: 2, name: "お菓子", points: 100, emoji: "🍭" },
    { id: 3, name: "好きなテレビ番組", points: 120, emoji: "📺" },
    { id: 4, name: "おもちゃ", points: 300, emoji: "🧸" },
    { id: 5, name: "外食", points: 500, emoji: "🍔" },
    { id: 6, name: "映画鑑賞", points: 200, emoji: "🎬" },
  ])

  const [badges, setBadges] = useState([
    {
      id: 1,
      name: "連続達成マスター",
      description: "5日連続でタスクを完了",
      emoji: "🔥",
      condition: "consecutive_5",
      isActive: true,
    },
    {
      id: 2,
      name: "ポイントコレクター",
      description: "1000ポイント獲得",
      emoji: "💰",
      condition: "points_1000",
      isActive: true,
    },
    {
      id: 3,
      name: "宿題キング",
      description: "宿題を10回連続完了",
      emoji: "📚",
      condition: "homework_10",
      isActive: true,
    },
    {
      id: 4,
      name: "お手伝いヒーロー",
      description: "お手伝いを20回完了",
      emoji: "🦸",
      condition: "help_20",
      isActive: false,
    },
  ])

  const handleAddReward = () => {
    if (rewardName && rewardPoints && rewardEmoji) {
      const newReward = {
        id: rewards.length + 1,
        name: rewardName,
        points: Number.parseInt(rewardPoints),
        emoji: rewardEmoji,
      }
      setRewards([...rewards, newReward])
      setAddRewardOpen(false)
      setRewardName("")
      setRewardPoints("")
      setRewardEmoji("")
    }
  }

  const handleAddBadge = () => {
    if (badgeName && badgeDescription && badgeEmoji && badgeCondition) {
      const newBadge = {
        id: badges.length + 1,
        name: badgeName,
        description: badgeDescription,
        emoji: badgeEmoji,
        condition: badgeCondition,
        isActive: true,
      }
      setBadges([...badges, newBadge])
      setAddBadgeOpen(false)
      setBadgeName("")
      setBadgeDescription("")
      setBadgeEmoji("")
      setBadgeCondition("")
    }
  }

  const handleDeleteReward = (id: number) => {
    if (confirm("この報酬を削除しますか？")) {
      setRewards(rewards.filter((reward) => reward.id !== id))
    }
  }

  const handleDeleteBadge = (id: number) => {
    if (confirm("このバッジを削除しますか？")) {
      setBadges(badges.filter((badge) => badge.id !== id))
    }
  }

  const toggleBadgeActive = (id: number) => {
    setBadges(badges.map((badge) => (badge.id === id ? { ...badge, isActive: !badge.isActive } : badge)))
  }

  const emojiOptions = ["🎮", "🍭", "📺", "🧸", "🍔", "🎬", "🎨", "📚", "⚽", "🎵", "🍕", "🎪"]
  const badgeEmojiOptions = ["🔥", "💰", "📚", "🦸", "🌟", "🏆", "⭐", "💎", "🎯", "🚀", "👑", "🎖️"]

  
  const handleEditReward = (reward: { id: number; name: string; points: number; emoji: string }) => {
    setEditingRewardId(reward.id)
    setRewardName(reward.name)
    setRewardPoints(reward.points.toString())
    setRewardEmoji(reward.emoji)
    setAddRewardOpen(true)
  }
  
  const handleSaveReward = () => {
    if (rewardName && rewardPoints && rewardEmoji) {
      const points = Number.parseInt(rewardPoints)
      if (editingRewardId) {
        // 編集
        setRewards(
          rewards.map((r) =>
            r.id === editingRewardId ? { ...r, name: rewardName, points, emoji: rewardEmoji } : r
          )
        )
      } else {
        // 追加
        const newReward = {
          id: rewards.length + 1,
          name: rewardName,
          points,
          emoji: rewardEmoji,
        }
        setRewards([...rewards, newReward])
      }

      // 共通でモーダル閉じる & 状態初期化
      setAddRewardOpen(false)
      setEditingRewardId(null)
      setRewardName("")
      setRewardPoints("")
      setRewardEmoji("")
    }
  }
  
  const handleEditBadge = (badge: {
    id: number
    name: string
    description: string
    emoji: string
    condition: string
  }) => {
    setEditingBadgeId(badge.id)
    setBadgeName(badge.name)               
    setBadgeDescription(badge.description) 
    setBadgeEmoji(badge.emoji)             
    setBadgeCondition(badge.condition)     
    setAddBadgeOpen(true)
  }

  const handleSaveBadge = () => {
    if (badgeName && badgeDescription && badgeEmoji && badgeCondition) {
      if (editingBadgeId) {
        // 編集
        setBadges(
          badges.map((b) =>
            b.id === editingBadgeId
              ? {
                  ...b,
                  name: badgeName,
                  description: badgeDescription,
                  emoji: badgeEmoji,
                  condition: badgeCondition,
                }
              : b
          )
        )
      } else {
        // 追加
        const newBadge = {
          id: badges.length + 1,
          name: badgeName,
          description: badgeDescription,
          emoji: badgeEmoji,
          condition: badgeCondition,
          isActive: true,
        }
        setBadges([...badges, newBadge])
      }

      // モーダル閉じる & 状態初期化
      setAddBadgeOpen(false)
      setEditingBadgeId(null)
      setBadgeName("")
      setBadgeDescription("")
      setBadgeEmoji("")
      setBadgeCondition("")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* ヘッダー */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-500" />
                マスタ設定
              </h1>
              <p className="text-sm text-gray-600">報酬とバッジを管理</p>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4 pb-24">
        <Tabs defaultValue="rewards" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm rounded-2xl p-1">
            <TabsTrigger value="rewards" className="rounded-xl">
              🎁 報酬管理
            </TabsTrigger>
            <TabsTrigger value="badges" className="rounded-xl">
              🏆 バッジ管理
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rewards" className="space-y-6">
            {/* 統計カード */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="border-0 shadow-lg rounded-3xl bg-gradient-to-r from-purple-400 to-pink-400 text-white">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{rewards.length}</div>
                  <div className="text-sm text-purple-100">登録済み報酬</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg rounded-3xl bg-gradient-to-r from-green-400 to-blue-400 text-white">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{Math.min(...rewards.map((r) => r.points))}</div>
                  <div className="text-sm text-green-100">最低ポイント</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg rounded-3xl bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{Math.max(...rewards.map((r) => r.points))}</div>
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
                  setRewardEmoji("")
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
                  <DialogTitle className="text-center text-xl">🎁 新しい報酬</DialogTitle>
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
                    <Label className="text-gray-700 font-medium">絵文字を選択</Label>
                    <div className="grid grid-cols-6 gap-2 mt-2">
                      {emojiOptions.map((emoji) => (
                        <Button
                          key={emoji}
                          type="button"
                          variant={rewardEmoji === emoji ? "default" : "outline"}
                          className={`h-12 rounded-2xl text-2xl ${
                            rewardEmoji === emoji
                              ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white"
                              : "bg-transparent"
                          }`}
                          onClick={() => setRewardEmoji(emoji)}
                        >
                          {emoji}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={handleSaveReward}
                    className="w-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl h-12"
                  >
                    {editingRewardId ? "保存する 💾" : "報酬を追加 🚀"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* 報酬一覧 */}
            <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Gift className="w-5 h-5 text-purple-500" />
                  おすすめ報酬一覧
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {rewards.map((reward) => (
                    <Card key={reward.id} className="border border-gray-200 rounded-2xl">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
                              {reward.emoji}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-800">{reward.name}</h3>
                              <p className="text-sm text-gray-600">{reward.points}ポイント必要</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                              onClick={() => {
                                handleEditReward(reward)
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteReward(reward.id)}
                              className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
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
                  <div className="text-2xl font-bold">{badges.filter((b) => b.isActive).length}</div>
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
                  setBadgeDescription("")
                  setBadgeEmoji("")
                  setBadgeCondition("")
                  setEditingBadgeId(null)
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
                      placeholder="例：早起きマスター"
                      className="mt-1 rounded-2xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="badgeDescription" className="text-gray-700 font-medium">
                      説明
                    </Label>
                    <Textarea
                      id="badgeDescription"
                      value={badgeDescription}
                      onChange={(e) => setBadgeDescription(e.target.value)}
                      placeholder="例：7日連続で朝6時に起床"
                      className="mt-1 rounded-2xl"
                      rows={2}
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
                      placeholder="例：early_bird_7"
                      className="mt-1 rounded-2xl"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium">絵文字を選択</Label>
                    <div className="grid grid-cols-6 gap-2 mt-2">
                      {badgeEmojiOptions.map((emoji) => (
                        <Button
                          key={emoji}
                          type="button"
                          variant={badgeEmoji === emoji ? "default" : "outline"}
                          className={`h-12 rounded-2xl text-2xl ${
                            badgeEmoji === emoji
                              ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-white"
                              : "bg-transparent"
                          }`}
                          onClick={() => setBadgeEmoji(emoji)}
                        >
                          {emoji}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={handleSaveBadge}
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white rounded-2xl h-12"
                  >
                    {editingBadgeId ? "保存する 💾" : "バッジを追加 🚀"}
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
                  {badges.map((badge) => (
                    <Card key={badge.id} className="border border-gray-200 rounded-2xl">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                                badge.isActive ? "bg-yellow-100" : "bg-gray-100"
                              }`}
                            >
                              {badge.emoji}
                            </div>
                            <div>
                              <h3 className={`font-medium ${badge.isActive ? "text-gray-800" : "text-gray-500"}`}>
                                {badge.name}
                              </h3>
                              <p className="text-sm text-gray-600">{badge.description}</p>
                              <p className="text-xs text-gray-400 mt-1">条件: {badge.condition}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleBadgeActive(badge.id)}
                              className={`rounded-xl ${
                                badge.isActive
                                  ? "border-green-200 text-green-600 hover:bg-green-50"
                                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
                              } bg-transparent`}
                            >
                              {badge.isActive ? "有効" : "無効"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                              onClick={() => {
                                handleEditBadge(badge)
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteBadge(badge.id)}
                              className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <ParentNavigation />
    </div>
  )
}
