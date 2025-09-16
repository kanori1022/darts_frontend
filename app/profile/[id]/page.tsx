"use client";

import { Button } from "@/components/Button/Button";
import useAuth from "@/hooks/auth/useAuth";
import { useFetch } from "@/hooks/fetch/useFetch";
import { User } from "@/types/user";
import { faCalendarAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default function UserProfile({ params }: Props) {
  const { id } = use(params);
  const { loginUser, isWaiting } = useAuth();
  const {
    data: currentUserData,
    error,
    isLoading,
  } = useFetch<User>(loginUser ? `/users` : null);

  // ログインしていない場合の表示
  if (!loginUser && !isWaiting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="text-blue-500 text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            ログインが必要です
          </h1>
          <p className="mb-6 text-gray-600">
            ユーザープロフィールを閲覧するには、ログインまたは新規登録が必要です。
          </p>
          <div className="space-y-3">
            <Link href="/login">
              <Button color="bg-blue-500 hover:bg-blue-600">ログイン</Button>
            </Link>
            <Link href="/newprofile">
              <Button color="bg-gray-500 hover:bg-gray-600">新規登録</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || isWaiting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            エラーが発生しました
          </h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <p className="text-sm text-gray-500">
            ユーザーID: {id} | エンドポイント: /users
          </p>
          <div className="mt-4">
            <Link href="/home">
              <Button color="bg-blue-500 hover:bg-blue-600">
                ホームに戻る
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUserData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-gray-400 text-4xl mb-4">👤</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            ユーザー情報を取得できません
          </h2>
          <p className="text-gray-600">ユーザー情報の取得に失敗しました</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-8 text-center">
            {/* Profile Image */}
            <div className="mb-6">
              {currentUserData.image ? (
                <Image
                  src={currentUserData.image}
                  alt={currentUserData.name || "ユーザー"}
                  width={120}
                  height={120}
                  className="w-30 h-30 rounded-full object-cover shadow-lg mx-auto border-4 border-white"
                />
              ) : (
                <div className="w-30 h-30 rounded-full bg-gray-200 flex items-center justify-center mx-auto shadow-lg border-4 border-white">
                  <FontAwesomeIcon
                    icon={faUser}
                    size="3x"
                    className="text-gray-400"
                  />
                </div>
              )}
            </div>

            {/* User Name */}
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {currentUserData.name || "匿名ユーザー"}
            </h1>

            {/* User Info */}
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="text-blue-500" />
                <span>ユーザーID: {currentUserData.id}</span>
              </div>
              {currentUserData.created_at && (
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="text-green-500"
                  />
                  <span>
                    {new Date(currentUserData.created_at).toLocaleDateString(
                      "ja-JP",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                    に登録
                  </span>
                </div>
              )}
            </div>

            {/* Introduction */}
            {currentUserData.introduction && (
              <div className="bg-gray-50 rounded-lg p-4 text-left">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  自己紹介
                </h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {currentUserData.introduction}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* User Stats or Additional Info */}
        <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
            ユーザー情報
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">ユーザー名</span>
              <span className="font-medium">
                {currentUserData.name || "未設定"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">登録日</span>
              <span className="font-medium">
                {currentUserData.created_at
                  ? new Date(currentUserData.created_at).toLocaleDateString(
                      "ja-JP"
                    )
                  : "不明"}
              </span>
            </div>
            {currentUserData.updated_at && (
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">最終更新</span>
                <span className="font-medium">
                  {new Date(currentUserData.updated_at).toLocaleDateString(
                    "ja-JP"
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
