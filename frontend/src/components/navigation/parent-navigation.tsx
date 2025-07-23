"use client"

import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation";
import Link from "next/link"
import { Home, Users, BarChart3, Calendar, Menu, Bell, Settings, History, LogOut, Inbox } from "lucide-react"
import { useState } from "react"

export function ParentNavigation() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { href: "/parent/dashboard", icon: Home, label: "ホーム" },
    { href: "/parent/children", icon: Users, label: "子ども" },
    { href: "/parent/tasks", icon: BarChart3, label: "タスク" },
    { href: "/parent/notifications", icon: Bell, label: "通知" },
  ]

  const menuItems = [
    { href: "/parent/calendar", icon: Calendar, label: "カレンダー" },
    { href: "/parent/stats", icon: BarChart3, label: "レポート" },
    { href: "/parent/history", icon: History, label: "履歴" },
    { href: "/parent/master", icon: Settings, label: "マスタ設定" },
  ]

  const router = useRouter();

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
    return null;
  }

  const handleLogout = async () => {
    try {
      const csrfToken = getCookie("XSRF-TOKEN");
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": csrfToken ?? "",
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
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white"
                      : "text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
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
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 z-50">
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
