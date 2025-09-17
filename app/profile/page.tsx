"use client";

import { Button } from "@/components/Button/Button";
import { useUpdateUser } from "@/hooks/api/useUpdateUser";
import useAuth from "@/hooks/auth/useAuth";
import { useFetch } from "@/hooks/fetch/useFetch";
import { User } from "@/types/user";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Profile() {
  const { loginUser } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [hasNewImage, setHasNewImage] = useState(false);
  const [headerGradientFrom, setHeaderGradientFrom] = useState("#3B82F6"); // デフォルトは青
  const [headerGradientTo, setHeaderGradientTo] = useState("#10B981"); // デフォルトは緑
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { updateUser } = useUpdateUser();
  const { data: userData, isLoading } = useFetch<User>(
    loginUser ? "/users" : null
  );

  const handleGuestLogin = async () => {
    try {
      const auth = getAuth();
      const result = await signInWithEmailAndPassword(
        auth,
        "gest@1.com",
        "33443344"
      );
      console.log("ゲストログイン成功:", result);
      alert("ゲストユーザーとしてログインしました");
      router.push("/home");
    } catch (error) {
      console.error("ゲストログインエラー:", error);
      alert(
        "ゲストログインに失敗しました。しばらくしてから再度お試しください。"
      );
    }
  };

  // ログインユーザー情報を初期セット
  useEffect(() => {
    if (loginUser) {
      setDisplayName(loginUser.displayName || "");
      // Firebase photoURLは最初のフォールバックとして使用
      if (!hasNewImage) {
        setPreviewUrl(loginUser.photoURL || null);
      }
    }
  }, [loginUser, hasNewImage]);

  // APIから取得したユーザーデータを使用して画像URLを設定
  useEffect(() => {
    if (userData && !hasNewImage) {
      setDisplayName(userData.name || "");
      setIntroduction(userData.introduction || "");
      // APIから取得した画像URLを優先的に使用
      setPreviewUrl(userData.image || loginUser?.photoURL || null);
      // ヘッダーグラデーション色を設定
      if (userData.headerGradientFrom) {
        setHeaderGradientFrom(userData.headerGradientFrom);
      }
      if (userData.headerGradientTo) {
        setHeaderGradientTo(userData.headerGradientTo);
      }
    }
  }, [userData, loginUser, hasNewImage]);

  // ObjectURLのクリーンアップ
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!loginUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="text-blue-500 text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            ログインが必要です
          </h1>
          <p className="mb-6 text-gray-600">
            プロフィール編集機能を利用するには、ログインまたは新規登録が必要です。
          </p>
          <div className="space-y-4">
            <Link href="/login">
              <Button color="bg-blue-500 hover:bg-blue-600">ログイン</Button>
            </Link>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">または</span>
              </div>
            </div>

            <button
              onClick={handleGuestLogin}
              className="w-full px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer border border-slate-500 hover:border-slate-400 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center">
                <span>ゲストユーザーでログイン</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
            </button>

            <Link href="/newprofile">
              <Button color="bg-gray-500 hover:bg-gray-600">新規登録</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <span className="ml-3 text-gray-600 font-medium">読み込み中...</span>
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
          introduction: introduction,
          headerGradientFrom: headerGradientFrom,
          headerGradientTo: headerGradientTo,
        },
      });

      // Firebaseのユーザー情報も更新
      await updateProfile(loginUser, {
        displayName: displayName,
        photoURL: previewUrl || loginUser.photoURL || null,
      });

      alert("プロフィールを更新しました");
      // 更新成功後、新しい画像フラグをリセット
      setHasNewImage(false);
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
            <Image
              src={previewUrl}
              alt="プロフィール画像"
              width={96}
              height={96}
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
              setHasNewImage(true);
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
      <div className="mb-4">
        <label className="block font-semibold mb-1">自己紹介</label>
        <textarea
          value={introduction}
          onChange={(e) => setIntroduction(e.target.value)}
          placeholder="あなたの自己紹介を入力してください..."
          rows={4}
          className="border border-gray-300 rounded p-2 w-full resize-vertical"
        />
        <p className="text-sm text-gray-500 mt-1">改行は自動的に反映されます</p>
      </div>

      {/* ヘッダーグラデーション色設定 */}
      <div className="mb-6">
        <label className="block font-semibold mb-3">ヘッダー背景色</label>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* 開始色 */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">開始色</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={headerGradientFrom}
                  onChange={(e) => setHeaderGradientFrom(e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <span className="text-sm text-gray-500 font-mono">
                  {headerGradientFrom}
                </span>
              </div>
            </div>

            {/* 終了色 */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">終了色</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={headerGradientTo}
                  onChange={(e) => setHeaderGradientTo(e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <span className="text-sm text-gray-500 font-mono">
                  {headerGradientTo}
                </span>
              </div>
            </div>
          </div>

          {/* プレビュー */}
          <div className="mt-4">
            <label className="block text-sm text-gray-600 mb-2">
              プレビュー
            </label>
            <div
              className="h-16 rounded-lg flex items-center justify-center text-white font-medium shadow-sm"
              style={{
                background: `linear-gradient(to right, ${headerGradientFrom}, ${headerGradientTo})`,
              }}
            >
              ヘッダー背景プレビュー
            </div>
          </div>
        </div>
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
