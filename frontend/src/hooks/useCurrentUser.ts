import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  role: "parent" | "child";
};

export const useCurrentUser = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const [user, setUser] = useState<User | null>(null);

  function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop()!.split(';').shift()!);
    return null;
  }
  
  useEffect(() => {
    const csrfToken = getCookie("XSRF-TOKEN");
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": csrfToken ?? "",
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
  }, []);

  return user;
};
