import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  role: "parent" | "child";
};

export const useCurrentUser = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchUser = async () => {
      try {
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

  return user;
};
