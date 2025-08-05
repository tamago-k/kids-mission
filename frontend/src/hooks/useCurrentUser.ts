import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  role: "parent" | "child";
};

export const useCurrentUser = () => {
  // ユーザー情報を格納するstate
  const [user, setUser] = useState<User | null>(null);
  // 環境変数からAPI URL取得
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  useEffect(() => {
    // ローカルストレージからtokenを取得
    const token = localStorage.getItem("token");

    //tokenがなければ終了
    if (!token) return;

    //　初回マウント時に実行
    const fetchUser = async () => {
      try {
        // GET /api/user を叩いてログインユーザーを取得
        const res = await fetch(`${apiBaseUrl}/api/user`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (error) {
        console.error("ユーザー情報取得エラー:", error);
      }
    };
    fetchUser();
  }, [apiBaseUrl]);

  // ログインユーザーを返す
  return user;
};
