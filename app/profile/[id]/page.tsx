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

  // デバッグ情報を追加
  console.log("UserProfile Debug Info:", {
    id,
    loginUser: loginUser ? "logged in" : "not logged in",
    token: loginUser ? "has token" : "no token",
    apiUrl: id ? `/users/${id}` : null,
    baseURL: process.env.NEXT_PUBLIC_API_HOST || "http://localhost:8000",
  });

  const {
    data: currentUserData,
    error,
    isLoading,
  } = useFetch<User>(id ? `/users/${id}` : null);

  // エラーの詳細をログ出力
  if (error) {
    console.error("UserProfile Error Details:", {
      error,
      message: error.message,
      response: error.response,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
  }

  // フォールバック用の現在ユーザー情報取得（404エラーの場合に実行）
  const shouldUseFallback = error && error.message?.includes("404");
  const {
    data: fallbackUserData,
    error: fallbackError,
    isLoading: fallbackLoading,
  } = useFetch<User>(loginUser && shouldUseFallback ? `/users` : null);

  // 表示するデータを決定
  const displayData = currentUserData || fallbackUserData;
  const displayError = error && fallbackError ? fallbackError : error;
  const displayLoading = isLoading || fallbackLoading;
  const isUsingFallback = shouldUseFallback && fallbackUserData;

  // ログインしていない場合でもプロフィールを表示可能にする
  // （認証が必要な場合はAPIが401を返す）

  if (displayLoading || isWaiting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (displayError) {
    const is404Error =
      displayError.message?.includes("404") ||
      displayError.response?.status === 404;
    const isAuthError =
      displayError.response?.status === 401 ||
      displayError.response?.status === 403;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {is404Error ? "ユーザーが見つかりません" : "エラーが発生しました"}
          </h2>
          <p className="text-gray-600 mb-4">
            {is404Error
              ? `ユーザーID「${id}」は存在しません。`
              : displayError.message}
          </p>
          {isAuthError && (
            <p className="text-sm text-yellow-600 mb-4">
              認証が必要です。ログインし直してください。
            </p>
          )}
          <p className="text-sm text-gray-500 mb-4">
            ユーザーID: {id} | エンドポイント: /users/{id}
          </p>
          <div className="space-y-2">
            <Link href="/home">
              <Button color="bg-blue-500 hover:bg-blue-600">
                ホームに戻る
              </Button>
            </Link>
            {isAuthError && (
              <Link href="/login">
                <Button color="bg-gray-500 hover:bg-gray-600">ログイン</Button>
              </Link>
            )}
            {!loginUser && !isAuthError && (
              <Link href="/login">
                <Button color="bg-gray-500 hover:bg-gray-600">ログイン</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!displayData) {
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
        {/* フォールバック使用時の通知 */}
        {isUsingFallback && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-yellow-600 text-lg mr-2">⚠️</div>
              <div>
                <p className="text-sm text-yellow-800">
                  指定されたユーザーが見つかりませんでした。現在のユーザー情報を表示しています。
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-8 text-center">
            {/* Profile Image */}
            <div className="mb-6">
              {displayData.image ? (
                <Image
                  src={displayData.image}
                  alt={displayData.name || "ユーザー"}
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
              {displayData.name || "匿名ユーザー"}
            </h1>

            {/* User Info */}
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="text-blue-500" />
                <span>ユーザーID: {displayData.id}</span>
              </div>
              {(displayData as User & { created_at?: string }).created_at && (
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="text-green-500"
                  />
                  <span>
                    {new Date(
                      (
                        displayData as User & { created_at?: string }
                      ).created_at!
                    ).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    に登録
                  </span>
                </div>
              )}
            </div>

            {/* Introduction */}
            {displayData.introduction && (
              <div className="bg-gray-50 rounded-lg p-4 text-left">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  自己紹介
                </h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {displayData.introduction}
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
                {displayData.name || "未設定"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">登録日</span>
              <span className="font-medium">
                {(displayData as User & { created_at?: string }).created_at
                  ? new Date(
                      (
                        displayData as User & { created_at?: string }
                      ).created_at!
                    ).toLocaleDateString("ja-JP")
                  : "不明"}
              </span>
            </div>
            {(displayData as User & { updated_at?: string }).updated_at && (
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">最終更新</span>
                <span className="font-medium">
                  {new Date(
                    (displayData as User & { updated_at?: string }).updated_at!
                  ).toLocaleDateString("ja-JP")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
