import { getAuth } from "firebase/auth";
import { useCallback } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3000";

export const useUpdateUser = () => {
  const updateUser = useCallback(
    async ({ user }: { user: { name: string; image: File | null } }) => {
      const formData = new FormData();
      formData.append("user[name]", user.name);
      if (user.image) {
        formData.append("user[image]", user.image);
      }

      // ✅ Firebaseトークンを取得
      const auth = getAuth();
      const currentUser = auth.currentUser;
      const idToken = currentUser ? await currentUser.getIdToken() : null;

      const res = await fetch(`${API_BASE_URL}/users`, {
        method: "PUT",
        credentials: "include",
        body: formData,
        headers: {
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("ユーザー更新失敗:", res.status, errorText);
        throw new Error("ユーザー更新に失敗しました");
      }

      return res.json();
    },
    []
  );

  return { updateUser };
};
