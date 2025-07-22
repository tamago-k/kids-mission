"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Mail, Lock, Heart, ArrowLeft, User, Baby, Smile} from "lucide-react"

export default function LoginPage() {
  const [step, setStep] = useState<"role" | "parent" | "child">("role")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedChild, setSelectedChild] = useState("")
  const [pin, setPin] = useState("")

  const children = [
    { id: "taro", name: "太郎", avatar: "👦", color: "from-blue-400 to-blue-600" },
    { id: "hanako", name: "花子", avatar: "👧", color: "from-pink-400 to-pink-600" },
  ]

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      setPin(pin + digit)
    }
  }

  const clearPin = () => {
    setPin("")
  }

  const handleChildLogin = () => {
    if (selectedChild && pin.length === 4) {
      window.location.href = "/child/dashboard"
    }
  }

  const handleParentLogin = () => {
    if (email && password) {
      window.location.href = "/parent/dashboard"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* ロゴ・タイトル */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-3xl">
            🎯
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Kids Mission</h1>
            <p className="text-gray-600">みんなでがんばろう！</p>
          </div>
        </div>

        {/* ロール選択画面 */}
        {step === "role" && (
          <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl text-gray-800 flex items-center justify-center gap-2">
                <Heart className="w-5 h-5 text-pink-400" />
                だれがログインしますか？
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => setStep("parent")}
                className="w-full h-16 rounded-2xl bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-500 hover:to-blue-500 text-white font-medium text-lg shadow-lg"
              >
                <User className="w-6 h-6 mr-3" />
                おとうさん・おかあさん
              </Button>

              <Button
                onClick={() => setStep("child")}
                className="w-full h-16 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-medium text-lg shadow-lg"
              >
                <Baby className="w-6 h-6 mr-3" />
                こども
              </Button>
            </CardContent>
          </Card>
        )}

        {/* 親ログイン画面 */}
        {step === "parent" && (
          <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Button variant="ghost" size="icon" onClick={() => setStep("role")} className="rounded-full">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <CardTitle className="text-xl text-gray-800 flex items-center gap-2">ログイン</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    メールアドレス
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 rounded-2xl border-2 border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">
                    パスワード
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-12 rounded-2xl border-2 border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                      placeholder="パスワードを入力"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleParentLogin}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-500 hover:to-blue-500 text-white font-medium text-lg shadow-lg"
              >
                ログイン
              </Button>
            </CardContent>
          </Card>
        )}

        {/* 子どもログイン画面 */}
        {step === "child" && (
          <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Button variant="ghost" size="icon" onClick={() => setStep("role")} className="rounded-full">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <CardTitle className="text-xl text-gray-800">だれかな？</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {!selectedChild ? (
                // 子ども選択
                <div className="space-y-4">
                  <p className="text-center text-gray-600 mb-4">じぶんをえらんでね！</p>
                  <div className="grid gap-3">
                    {children.map((child) => (
                      <Button
                        key={child.id}
                        onClick={() => setSelectedChild(child.id)}
                        className={`w-full h-16 rounded-2xl bg-gradient-to-r ${child.color} hover:scale-105 transition-transform text-white font-medium text-lg shadow-lg`}
                      >
                        <span className="text-3xl mr-4">{child.avatar}</span>
                        {child.name}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                // PIN入力
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-4xl">
                      {children.find((c) => c.id === selectedChild)?.avatar}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      こんにちは、{children.find((c) => c.id === selectedChild)?.name}！
                    </h3>
                    <p className="text-gray-600">ばんごうをいれてね</p>
                  </div>

                  {/* PIN表示 */}
                  <div className="flex justify-center gap-3 mb-6">
                    {[0, 1, 2, 3].map((index) => (
                      <div
                        key={index}
                        className="w-12 h-12 rounded-2xl border-2 border-gray-200 flex items-center justify-center text-2xl font-bold"
                      >
                        {pin[index] ? "●" : ""}
                      </div>
                    ))}
                  </div>

                  {/* 数字キーパッド */}
                  <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                      <Button
                        key={digit}
                        onClick={() => handlePinInput(digit.toString())}
                        className="h-14 rounded-2xl bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white text-xl font-bold shadow-lg"
                      >
                        {digit}
                      </Button>
                    ))}
                    <Button
                      onClick={clearPin}
                      className="h-14 rounded-2xl bg-gray-300 hover:bg-gray-400 text-gray-700 text-lg font-bold"
                    >
                      ✖
                    </Button>
                    <Button
                      onClick={() => handlePinInput("0")}
                      className="h-14 rounded-2xl bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white text-xl font-bold shadow-lg"
                    >
                      0
                    </Button>
                    <Button
                      onClick={handleChildLogin}
                      disabled={pin.length !== 4}
                      className="h-14 rounded-2xl bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white text-lg font-bold shadow-lg disabled:opacity-50"
                    >
                      ✓
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setSelectedChild("")}
                    className="w-full rounded-2xl bg-transparent"
                  >
                    べつのひとにする
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* フッター */}
        <p className="flex justify-center justify-items-center gap-1 text-gray-500 text-sm">家族みんなで楽しく宿題管理 <Smile className="w-5 h-5" /></p>
      </div>
    </div>
  )
}
