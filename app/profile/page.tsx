"use client";

import { Button } from "@/components/Button/Button";
import useAuth from "@/hooks/auth/useAuth";
import { updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Profile() {
  const { loginUser } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (loginUser) {
      setDisplayName(loginUser.displayName ?? "");
      setPhotoURL(loginUser.photoURL ?? "");
    }
  }, [loginUser]);

  const handleUpdate = async () => {
    if (!loginUser) return;

    try {
      await updateProfile(loginUser, {
        displayName,
        photoURL,
      });
      alert("プロフィールを更新しました");
      router.push("/mypage");
    } catch (error) {
      alert("更新に失敗しました");
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow-md rounded-md mt-10">
      <h1 className="text-xl font-bold mb-4 text-center">プロフィール編集</h1>

      <div className="mb-4">
        <label className="block font-semibold mb-1">表示名</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">アイコンURL</label>
        <input
          type="text"
          value={photoURL}
          onChange={(e) => setPhotoURL(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full"
        />
      </div>

      <div className="flex justify-between">
        <Button color="bg-[#3B82F6]" onClick={handleUpdate}>
          保存する
        </Button>
        <Button color="bg-[#BEBEBE]" onClick={() => router.push("/mypage")}>
          キャンセル
        </Button>
      </div>
    </div>
  );
}
