"use client";

import { Button } from "@/components/Button/Button";
import { useUpdateUser } from "@/hooks/api/useUpdateUser";
import useAuth from "@/hooks/auth/useAuth";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { updateProfile } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Profile() {
  const { loginUser } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { updateUser } = useUpdateUser();

  // ログインユーザー情報を初期セット
  useEffect(() => {
    if (loginUser) {
      setDisplayName(loginUser.displayName || "");
      setPreviewUrl(loginUser.photoURL || null);
    }
  }, [loginUser]);

  if (!loginUser) {
    return (
      <div className="pl-10 pr-10 pt-10 pb-10 bg-white mb-10 text-center">
        <p className="mb-3">
          その他の機能を利用するには新規登録をしてください。
        </p>
        <Link href="/login">
          <Button color="bg-[#3B82F6]">新規登録はコチラ</Button>
        </Link>
        <div className="pt-3">
          ※登録済みの方はメニューよりログインをしてください。
        </div>
      </div>
    );
  }

  const handleUpdate = async () => {
    if (!loginUser) return;

    try {
      // API側に更新
      await updateUser({
        user: {
          image: inputRef.current?.files?.[0] || null,
          name: displayName,
        },
      });

      // Firebaseのユーザー情報も更新
      await updateProfile(loginUser, {
        displayName: displayName,
        photoURL: previewUrl || loginUser.photoURL || null,
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

      {/* プロフィール画像エリア */}
      <div className="flex justify-center mb-4">
        <label
          htmlFor="imageUpload"
          className="w-24 h-24 cursor-pointer hover:opacity-80"
        >
          {/* デフォルトアイコン */}
          {!previewUrl && (
            <FontAwesomeIcon
              icon={faCircleUser}
              size="4x"
              className="text-gray-400 w-24 h-24"
            />
          )}

          {/* プレビュー画像 or 既存画像 */}
          {previewUrl && (
            <img
              src={previewUrl}
              alt="プロフィール画像"
              className="top-0 left-0 w-24 h-24 rounded-full object-cover shadow-lg"
            />
          )}
        </label>

        {/* 非表示のファイル入力 */}
        <input
          id="imageUpload"
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const preview = URL.createObjectURL(file);
              setPreviewUrl(preview);
            }
          }}
          className="hidden"
        />
      </div>

      {/* 表示名 */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">表示名</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full"
        />
      </div>

      {/* ボタンエリア */}
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
