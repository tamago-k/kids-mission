"use client"

import { useState, useEffect} from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Lock, Heart, ArrowLeft, User, Baby, Smile, BicepsFlexed} from "lucide-react"

export default function LoginPage() {
  // トップページに遷移可能
  const router = useRouter()
   // 今の画面（ステップ）を管理
  const [step, setStep] = useState<"role" | "parent" | "child">("role")
  // 親のユーザー名
  const [name, setName] = useState("")          
  // 親のパスワード
  const [password, setPassword] = useState("")  
  // 子どもの名前入力
  const [childId, setChildId] = useState("")    
  // 子どもの名前
  const [nameChild, setNameChild] = useState("") 
  // 子どもの4桁PIN
  const [pin, setPin] = useState("")             
  // エラーメッセージ表示用
  const [errorMessage, setErrorMessage] = useState<string | null>(null) 
  // 環境変数からAPI URL取得
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // 親ログイン
  const handleParentLogin = async () => {

    // エラーメッセージをセット
    setErrorMessage(null);

    // 名前もしくはパスワードがnullだったら
    if (!name || !password) {
      setErrorMessage("ユーザー名とパスワードを入力してください");
      return;
    }

    try {
      // POST /api/login を叩いてログインのリクエスト送信
      const res = await fetch(`${apiBaseUrl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name, password }),
      });

      //　レスポンスがokでなければエラーを返す
      if (!res.ok) {
        const errorData = await res.json();
        setErrorMessage(errorData.message || "入力情報が違います。");
        return;
      }

      // レスポンスをdataに保存
      const data = await res.json();

      // tokenをローカルストレージに保存
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // dashboardへ遷移
      window.location.href = "/parent/dashboard";

    // エラー
    } catch (error) {
      console.error(error);
      alert("通信エラーが発生しました");
    }
  };

  // 子ログイン
  const handleChildLogin = async () => {

    // エラーメッセージをセット
    setErrorMessage(null);

    // 名前もしくはPINがnullだったら
    if (!nameChild || pin.length !== 4) {
      setErrorMessage("子の名前と4桁のPINを入力してください");
      return;
    }

    try {
      // POST /api/login を叩いてログインのリクエスト送信
      const res = await fetch(`${apiBaseUrl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name: nameChild, password: pin }),
      });

      //　レスポンスがokでなければエラーを返す
      if (!res.ok) {
        setErrorMessage("何かまちがえているよ");
        return;
      }

      // レスポンスをdataに保存
      const data = await res.json();

      // tokenをローカルストレージに保存
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // dashboardへ遷移
      window.location.href = "/child/dashboard";

    // エラー
    } catch (error) {
      console.error(error);
      alert("通信エラーが発生しました");
    }
  };

  //router、apiBaseUrlが変わるたびに実行される
  useEffect(() => {
    const checkLogin = async () => {

      // ローカルストレージに保存されたJWTトークンを取り出す
      const token = localStorage.getItem("token");

      // トークン無ければ何もしない
      if (!token) return;

      try {
        // GET /api/user を叩いてログインユーザーを取得
        const res = await fetch(`${apiBaseUrl}/api/user`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        // 取得できなければtokenをremove
        if (!res.ok) {
          localStorage.removeItem("token");
          return;
        }

        // resをuserに保存
        const user = await res.json();

        // userのroleを確認し、それぞれのdashboardに遷移
        if (user.role === "parent") {
          router.push("/parent/dashboard");
        } else if (user.role === "child") {
          router.push("/child/dashboard");
        }

      // エラー
      } catch (error) {
        console.error("ログインチェック失敗:", error);
        localStorage.removeItem("token");
      }
    };

    checkLogin();
  }, [apiBaseUrl, router]);

  // 子どもログイン時に4桁のPINを数字ボタンで入力する処理
  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      setPin(pin + digit)
    }
  }

  // 子どもログイン時のPINのクリアボタン
  const clearPin = () => {
    setPin("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* ロゴ・タイトル */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-3xl text-white ">
            <BicepsFlexed className="w-8 h-8" />
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
                // 状態をparentに切り替え
                onClick={() => setStep("parent")}
                className="w-full h-16 rounded-2xl bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-500 hover:to-blue-500 text-white font-medium text-lg shadow-lg"
              >
                <User className="w-6 h-6 mr-3" />
                おとうさん・おかあさん
              </Button>

              <Button
                //状態をchildに切り替え
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
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                    // ログイン画面の「ロール選択画面」に戻る（状態を "role" に切り替える）
                    setStep("role")
                    // 親のユーザー名入力を空にする
                    setName("");
                    // 親のパスワード入力を空にする
                    setPassword("");
                    // 子どもの名前の状態を空にする
                    setNameChild("");
                    // 子ども入力用のテキストを空にする
                    setChildId("");
                    // PINコード入力を空にする（リセット）
                    setPin("");
                    // エラーメッセージをクリア（表示しないように）
                    setErrorMessage(null);
                  }}
                  className="rounded-full"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <CardTitle className="text-xl text-gray-800 flex items-center gap-2">ログイン</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 font-medium">
                    ユーザー名
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      // ユーザーが入力欄に文字を打つたびに、その文字列がリアルタイムで状態nameに保存される
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 h-12 rounded-2xl border-2 border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                      placeholder="family_account"
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
                      // ユーザーが入力欄に文字を打つたびに、その文字列がリアルタイムで状態passwordに保存される
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-12 rounded-2xl border-2 border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                      placeholder="パスワードを入力"
                    />
                  </div>
                </div>
              </div>

              <Button
                // handleParentLoginを呼ぶ
                onClick={handleParentLogin}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-500 hover:to-blue-500 text-white font-medium text-lg shadow-lg"
              >
                ログイン
              </Button>
              {errorMessage && (
                <p className="text-red-600 text-center font-medium mt-2">
                  {errorMessage}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* 子どもログイン画面 */}
        {step === "child" && (
          <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                    // ログイン画面の「ロール選択画面」に戻る（状態を "role" に切り替える）
                    setStep("role")
                    // 親のユーザー名入力を空にする
                    setName("");
                    // 親のパスワード入力を空にする
                    setPassword("");
                    // 子どもの名前の状態を空にする
                    setNameChild("");
                    // 子ども入力用のテキストを空にする
                    setChildId("");
                    // PINコード入力を空にする（リセット）
                    setPin("");
                    // エラーメッセージをクリア（表示しないように）
                    setErrorMessage(null);
                  }}
                  className="rounded-full"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <CardTitle className="text-xl text-gray-800">だれかな？</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {!nameChild ? (
                // 子ども選択
                <div className="space-y-4">
                  <div className="grid gap-3">
                    <div className="relative">
                      <Baby className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        className="pl-10 h-12 rounded-2xl border-2 border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                        placeholder="じぶんのなまえ"
                        value={childId}
                        onChange={(e) => setChildId(e.target.value)}
                      />
                      </div>
                    <Button
                      onClick={() => {
                        if (childId.trim()) {
                          setNameChild(childId.trim())
                        } else {
                          alert("なまえをいれてね")
                        }
                      }}
                      className="h-12 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-medium text-lg shadow-lg"
                    >
                      決定
                    </Button>
                  </div>
                </div>
              ) : (
                // PIN入力
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-4xl">
                      <Smile className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      こんにちは！
                    </h3>
                    <p className="text-gray-600">ばんごうをいれてね</p>
                  </div>

                  {/* PIN表示 */}
                  <div className="flex justify-center gap-3 mb-6">
                    {[0, 1, 2, 3].map((index) => (
                      // mapで1つずつ取り出して4子入力枠を作成
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
                      // mapで1つずつ取り出して1~9のボタンを作成
                      <Button
                        key={digit}
                        onClick={() => handlePinInput(digit.toString())}
                        className="h-14 rounded-2xl bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white text-xl font-bold shadow-lg"
                      >
                        {digit}
                      </Button>
                    ))}
                    <Button
                      onClick={() => {
                        clearPin();
                        setErrorMessage(null);
                      }}
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
                      // handleChildLoginを呼ぶ
                      onClick={handleChildLogin}
                      disabled={pin.length !== 4}
                      className="h-14 rounded-2xl bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white text-lg font-bold shadow-lg disabled:opacity-50"
                    >
                      ✓
                    </Button>
                  </div>
                  {errorMessage && (
                    <p className="text-red-600 text-center font-medium mt-2">
                      {errorMessage}
                    </p>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => {
                      // 子どもの名前リセット
                      setNameChild("");
                      // 子どもidをリセット
                      setChildId("");
                      // 子どものPINをリセット
                      setPin("");
                      // エラーをリセット
                      setErrorMessage(null);
                    }}
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
