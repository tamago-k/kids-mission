// src/app/parent/master/page.tsx

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Medal, Settings, SquareCheck } from "lucide-react";
import { ParentNavigation } from "@/components/navigation/ParentNavigation"

export default function MasterMenuPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 max-w-xl mx-auto">
      {/* ヘッダー */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-500" />
                マスタ管理
              </h1>
              <p className="text-sm text-gray-600">各マスタを管理</p>
            </div>
          </div>
        </div>
      </div>
      {/* メインコンテンツ */}
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <div className="mb-3">
          <Link href="/parent/master/rewards" className="hover:opacity-90">
            <Card className="rounded-2xl shadow-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white transition duration-200">
              <CardContent className="p-6 flex items-center gap-4">
                <Gift className="w-8 h-8" />
                <div>
                  <h2 className="text-lg font-semibold">報酬マスター</h2>
                  <p className="text-sm text-white/80">ポイントで交換できる報酬の設定</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
        <div className="mb-3">
          <Link href="/parent/master/badges" className="hover:opacity-90">
            <Card className="rounded-2xl shadow-lg bg-gradient-to-r from-yellow-400 to-orange-400 text-white transition duration-200">
              <CardContent className="p-6 flex items-center gap-4">
                <Medal className="w-8 h-8" />
                <div>
                  <h2 className="text-lg font-semibold">バッジマスター</h2>
                  <p className="text-sm text-white/80">条件達成で付与されるバッジの管理</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
        <div className="mb-3">
          <Link href="/parent/master/categories" className="hover:opacity-90">
            <Card className="rounded-2xl shadow-lg bg-gradient-to-r from-green-400 to-sky-400 text-white transition duration-200">
              <CardContent className="p-6 flex items-center gap-4">
                <SquareCheck className="w-8 h-8" />
                <div>
                  <h2 className="text-lg font-semibold">タスクカテゴリー</h2>
                  <p className="text-sm text-white/80">タスクのカテゴリー管理</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* ナビゲーション */}
      <ParentNavigation />
    </div>
  );
}
