"use client"

import { useState, useEffect } from "react"
import { ParentNavigation } from "@/components/navigation/ParentNavigation"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Settings, Check, Trash2, Users, TriangleAlert, ArrowLeft } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { colorThemes, iconOptions } from "@/components/OptionThemes"

export default function ChildrenPage() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const [children, setChildren] = useState<Child[]>([])
  const [showColorPicker, setShowColorPicker] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editChildId, setEditChildId] = useState<number | null>(null)
  const [formName, setFormName] = useState("")
  const [formPassword, setFormPassword] = useState("")
  const [formIcon, setFormIcon] = useState(iconOptions[0].id)
  const [formColorTheme, setFormColorTheme] = useState(colorThemes[0].value)
  const [deleteChildOpen, setDeleteChildOpen] = useState(false)
  const [selectedChild, setSelectedChild] = useState<typeof children[0] | null>(null)

  type Child = {
    id: number;
    name: string;
    password: string;
    icon: string;
    colorTheme: string;
  };

  useEffect(() => {
    const fetchChildren = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiBaseUrl}/api/children`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        alert("取得に失敗しました")
        return
      }
      const data = await res.json()
      setChildren(data)
    }

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

    fetchChildren()
  }, [editChildId, children, apiBaseUrl]);

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
    const token = localStorage.getItem("token");
    try {
      if (editChildId === null) {
        const res = await fetch(`${apiBaseUrl}/api/children`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
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
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('更新失敗');
        const updatedChild = await res.json();
        setChildren(prev => prev.map(c => c.id === editChildId ? updatedChild : c));
      }

      setModalOpen(false);
      setEditChildId(null);
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      } else {
        alert("更新失敗");
      }
    }
  };

  const handleDelete = async (id: number) => {

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${apiBaseUrl}/api/children/${id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('削除に失敗しました');
      setChildren(prev => prev.filter(c => c.id !== id));
      setDeleteChildOpen(false);
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      } else {
        alert("更新失敗");
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
                <Users className="w-6 h-6" /> 
                子ども
              </h1>
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
              <div className="grid grid-cols-6 gap-2 mt-2">
                {iconOptions.map(({ id, Icon }) => (
                  <Button
                    key={id}
                    variant={formIcon === id ? "default" : "outline"}
                    className={`h-12 text-2xl rounded-2xl ${
                      formIcon === id 
                        ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white"
                        : "bg-white"
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
