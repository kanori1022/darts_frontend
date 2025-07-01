"use client";

import { Button } from "@/components/Button/Button";
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
  const [photoURL, setPhotoURL] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (loginUser) {
      setDisplayName(loginUser.displayName ?? "");
      setPhotoURL(loginUser.photoURL ?? "");
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
      await updateProfile(loginUser, {
        displayName,
        photoURL, // ※ 本来はアップロード処理の後に URL を入れる必要あり
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
          {/* デフォルトアイコン（photoURLもpreviewも無い時） */}
          {!loginUser.photoURL && !previewUrl && (
            <FontAwesomeIcon
              icon={faCircleUser}
              size="4x"
              className="text-gray-400 w-24 h-24"
            />
          )}

          {/* プレビュー画像（最優先） */}
          {previewUrl && (
            <img
              src={previewUrl}
              alt="選択された画像"
              className="top-0 left-0 w-24 h-24 rounded-full object-cover shadow-lg"
            />
          )}

          {/* 既存プロフィール画像（プレビューない時のみ） */}
          {!previewUrl && loginUser.photoURL && (
            <img
              src={loginUser.photoURL}
              alt="プロフィール画像"
              className="top-0 left-0 w-24 h-24 rounded-full object-cover shadow"
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
              // 本来ここで storage にアップロードして photoURL を更新する処理が必要
              // setPhotoURL(uploadedUrl);
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

      {/* 自己紹介 */}
      <div className="mb-6">
        <label className="block font-semibold mb-1">自己紹介</label>
        <textarea
          className="border-2 rounded-sm w-full h-28 p-2 placeholder-[#A39C9C] border-[#E0E0E0]"
          placeholder="ここに自己紹介を入力..."
        ></textarea>
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
