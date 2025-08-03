"use client"

import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation";
import Link from "next/link"
import { Home, Calendar, Menu, ClipboardCheck, Settings, LogOut, PiggyBank } from "lucide-react"
import { useState } from "react"

export function ParentNavigation() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  const navItems = [
    { href: "/parent/dashboard", icon: Home, label: "ホーム" },
    { href: "/parent/tasks", icon: ClipboardCheck, label: "タスク" },
    { href: "/parent/rewards", icon: PiggyBank, label: "ポイント" },
    /*{ href: "/parent/report", icon: BarChart3, label: "レポート" },*/
    { href: "/parent/calendar", icon: Calendar, label: "カレンダー" },
  ]

  const menuItems = [
    /*{
      label: "履歴", icon: History,
      children: [
        { label: "タスク履歴", href: "/parent/history/tasks" },
        { label: "ポイント履歴", href: "/parent/history/rewards" },
        { label: "バッジ履歴", href: "/parent/history/badges" }
      ]
    },*/
    {
      label: "マスタ設定", icon: Settings,
      children: [
        { label: "子どもマスタ", href: "/parent/master/children" },
        { label: "タスクカテゴリマスタ", href: "/parent/master/categories" },
        { label: "報酬マスタ", href: "/parent/master/rewards" },
        { label: "バッジマスタ", href: "/parent/master/badges" },
      ]
    }
  ]

  const router = useRouter();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${apiBaseUrl}/api/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      router.push("/");
    } catch (error) {
      console.error("ログアウト失敗:", error);
    }
  };


  return (
    <>
      {/* オーバーレイ */}
      {isMenuOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsMenuOpen(false)} />}

      {/* サイドメニュー */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-800">メニュー</h2>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
              ✕
            </button>
          </div>

          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const hasChildren = Array.isArray(item.children) && item.children.length > 0

              if (hasChildren) {
                // 親項目はリンクなし見出しとして表示、子リンクをネストして表示
                return (
                  <div key={item.label}>
                    <div className="flex items-center gap-4 px-4 py-2 text-gray-600 font-semibold select-none">
                      {Icon && <Icon className="w-5 h-5" />}
                      <span>{item.label}</span>
                    </div>
                    <div className="ml-8 space-y-1">
                      {item.children.map((child) => {
                        const isActive = pathname === child.href
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setIsMenuOpen(false)}
                            className={`block px-4 py-2 rounded-md transition ${
                              isActive
                                ? "bg-purple-100 text-purple-800 font-medium"
                                : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                            }`}
                          >
                            {child.label}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )
              } else {
                // ここで item.href にアクセスしてしまうとエラーになるので避ける
                // menuItems の親は href を持っていない想定ならここは不要
              }
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <button onClick={handleLogout} className="flex items-center gap-4 p-4 rounded-xl text-red-600 hover:bg-red-50 w-full">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">ログアウト</span>
            </button>
          </div>
        </div>
      </div>

      {/* ボトムナビゲーション */}
      <div className="max-w-xl mx-auto fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 z-50">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white"
                    : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}

          {/* ハンバーガーメニューボタン */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex flex-col items-center gap-1 p-2 rounded-2xl text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all"
          >
            <Menu className="w-5 h-5" />
            <span className="text-xs font-medium">メニュー</span>
          </button>
        </div>
      </div>
    </>
  )
}
