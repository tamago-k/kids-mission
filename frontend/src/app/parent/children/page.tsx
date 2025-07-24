"use client"

import { useState, useEffect } from "react"
import { ParentNavigation } from "@/components/navigation/parent-navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Settings, Check, Trash2, Users, TriangleAlert } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { colorThemes, iconOptions } from "@/components/optionThemes"


const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export default function ChildrenPage() {
  const [children, setChildren] = useState<Child[]>([])

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
    return null;
  }

  useEffect(() => {
    const fetchChildren = async () => {
      const csrfToken = getCookie("XSRF-TOKEN");
      const res = await fetch(`${apiBaseUrl}/api/children`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": csrfToken ?? "",
        },
      });
      if (!res.ok) {
        alert("取得に失敗しました")
        return
      }
      const data = await res.json()
      setChildren(data)
    }

    fetchChildren()
  }, [])


  const [showColorPicker, setShowColorPicker] = useState<number | null>(null)

  // 編集・追加共通モーダルの開閉状態
  const [modalOpen, setModalOpen] = useState(false)
  // 編集対象の子どもID（nullなら追加モード）
  const [editChildId, setEditChildId] = useState<number | null>(null)

  // フォーム状態
  const [formName, setFormName] = useState("")
  const [formPassword, setFormPassword] = useState("")
  const [formIcon, setFormIcon] = useState(iconOptions[0].id)
  const [formColorTheme, setFormColorTheme] = useState(colorThemes[0].value)
  const [deleteChildOpen, setDeleteChildOpen] = useState(false)
  const [selectedChild, setSelectedChild] = useState<typeof children[0] | null>(null)

  //初期データ読み込み
  useEffect(() => {
    async function fetchChildren() {
      try {
        const res = await fetch(`${apiBaseUrl}/api/children`, { credentials: 'include' });
        if (!res.ok) throw new Error('取得失敗');
        const data = await res.json();
        setChildren(data);
      } catch (e) {
        alert('読み込みに失敗しました');
      }
    }

    fetchChildren();
  }, []);

  // 編集モード時、対象子どもの情報をフォームにセット
  useEffect(() => {
    if (editChildId !== null) {
      const child = children.find((c) => c.id === editChildId)
      if (child) {
        setFormName(child.name)
        setFormPassword(String(child.password))
        setFormIcon(child.icon || iconOptions[0].id);
        setFormColorTheme(child.colorTheme)
      }
    } else {
      // 追加モード時リセット
      setFormName("")
      setFormPassword("")
      setFormIcon(iconOptions[0].id)
      setFormColorTheme(colorThemes[0].value)
    }
  }, [editChildId, children])

  const getThemeStyles = (colorTheme: string) => {
    const theme = colorThemes.find((t) => t.value === colorTheme)
    return theme || colorThemes[0]
  }

  const handleSave = async () => {
    if (!formName.trim()) return alert("名前を入力してください");

    const payload = {
      name: formName.trim(),
      password: formPassword.trim(),
      icon: formIcon,
      colorTheme: formColorTheme,
    };
    const csrfToken = getCookie("XSRF-TOKEN");
    try {
      if (editChildId === null) {
        const res = await fetch(`${apiBaseUrl}/api/children`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": csrfToken ?? "",
          },
          credentials: 'include',
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('追加失敗');
        const newChild = await res.json();
        setChildren(prev => [...prev, newChild]);
      } else {
        const res = await fetch(`${apiBaseUrl}/api/children/${editChildId}`, {
          method: 'PUT',
          headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": csrfToken ?? "",
          },
          credentials: 'include',
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('更新失敗');
        const updatedChild = await res.json();
        setChildren(prev => prev.map(c => c.id === editChildId ? updatedChild : c));
      }

      setModalOpen(false);
      setEditChildId(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id: number) => {

    const csrfToken = getCookie("XSRF-TOKEN");
    try {
      const res = await fetch(`${apiBaseUrl}/api/children/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": csrfToken ?? "",
        },
      });
      if (!res.ok) throw new Error('削除に失敗しました');
      setChildren(prev => prev.filter(c => c.id !== id));
      setDeleteChildOpen(false);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* ヘッダー */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Users className="w-6 h-6" /> 子ども</h1>
              <p className="text-sm text-gray-600">子どもアカウント管理</p>
            </div>
            <Button
              className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-full px-4 py-2 h-auto"
              onClick={() => {
                setEditChildId(null)
                setModalOpen(true)
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              子ども追加
            </Button>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4 pb-24">
        <div className="space-y-4">
          {children.map((child) => {
            const theme = getThemeStyles(child.colorTheme)
            const completionRate = child.totalTasks ? Math.round((child.completedTasks / child.totalTasks) * 100) : 0
            const iconObj = iconOptions.find((icon) => icon.id === child.icon)

            return (
              <Card key={child.id} className="overflow-hidden">
                <CardHeader className={`bg-gradient-to-r ${theme.gradient} text-white`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">
                        {iconObj ? <iconObj.Icon /> : null}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{child.name}</CardTitle>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20"
                        onClick={() => {
                          setEditChildId(child.id) // 編集モード
                          setModalOpen(true)
                        }}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20"
                          onClick={() => {
                            setSelectedChild(child)
                            setDeleteChildOpen(true)
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {showColorPicker === child.id && (
                  <div className="p-4 bg-gray-50 border-b">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">カラーテーマを選択</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {colorThemes.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => {
                            setChildren((prev) =>
                              prev.map((c) => (c.id === child.id ? { ...c, colorTheme: color.value } : c))
                            )
                            setShowColorPicker(null)
                          }}
                          className={`relative p-3 rounded-full bg-gradient-to-r ${color.gradient} hover:scale-105 transition-transform`}
                        >
                          {child.colorTheme === color.value && (
                            <Check className="w-4 h-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                          )}
                          <span className="sr-only">{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className={`p-4 rounded-xl ${theme.bg}`}>
                      <div className={`text-2xl font-bold ${theme.text}`}>{child.points}</div>
                      <div className="text-sm text-gray-600">獲得ポイント</div>
                    </div>
                    <div className={`p-4 rounded-xl ${theme.bg}`}>
                      <div className={`text-2xl font-bold ${theme.text}`}>{completionRate}%</div>
                      <div className="text-sm text-gray-600">完了率</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>今週のタスク進捗</span>
                      <span>
                        {child.completedTasks}/{child.totalTasks}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${theme.gradient} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* 追加・編集共通モーダル */}
      <Dialog
        open={modalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setModalOpen(false)
            setEditChildId(null)
          }
        }}
      >
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl flex justify-center gap-2">
              <Users className="w-6 h-6 mr-3" />
              {editChildId === null ? "新しい子どもを追加" : "子ども情報を編集"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-700 font-medium">
                名前
              </Label>
              <Input
                id="name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="例：太郎"
                className="mt-1 rounded-2xl"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700 font-medium">
                PIN
              </Label>
              <Input
                id="password"
                type="number"
                min={0}
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                placeholder="例：0000"
                className="mt-1 rounded-2xl"
              />
            </div>

            <div>
              <Label className="text-gray-700 font-medium">アイコンを選択</Label>
              <div className="flex gap-2 mt-2">
                {iconOptions.map(({ id, Icon }) => (
                  <Button
                    key={id}
                    variant={formIcon === id ? "default" : "outline"}
                    className={`h-12 w-12 text-2xl rounded-2xl ${
                      formIcon === id ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white" : "bg-transparent"
                    }`}
                    onClick={() => setFormIcon(id)}
                  >
                    <Icon />
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-gray-700 font-medium">カラーテーマを選択</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {colorThemes.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`relative p-3 rounded-full bg-gradient-to-r ${color.gradient} hover:scale-105 transition-transform`}
                    onClick={() => setFormColorTheme(color.value)}
                  >
                    {formColorTheme === color.value && (
                      <Check className="w-4 h-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    )}
                    <span className="sr-only">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 rounded-2xl"
                onClick={() => {
                  setModalOpen(false)
                  setEditChildId(null)
                }}
              >
                キャンセル
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-2xl"
                onClick={handleSave}
              >
                {editChildId === null ? "追加" : "更新"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 削除モーダル */}
      <Dialog open={deleteChildOpen} onOpenChange={setDeleteChildOpen}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl text-red-600 flex justify-center gap-2"><TriangleAlert className="w-6 h-6" /> 子どもの削除</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <p className="text-gray-700">
              「<strong>{selectedChild?.name}</strong>」のアカウントを削除してもよろしいですか？
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 rounded-2xl"
                onClick={() => setDeleteChildOpen(false)}
              >
                キャンセル
              </Button>
              <Button
                className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-2xl"
                onClick={() => {
                  if (!selectedChild) return;
                  handleDelete(selectedChild.id);
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
