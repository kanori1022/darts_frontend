"use client";

import { Button } from "@/components/Button/Button";
import useAuth from "@/hooks/auth/useAuth";
import { useFetch } from "@/hooks/fetch/useFetch";
import { User } from "@/types/user";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Mypage() {
  const { loginUser, isWaiting } = useAuth();
  const { data, isLoading } = useFetch<User>(
    loginUser && !isWaiting ? "/users" : null
  );
  const [headerGradientFrom, setHeaderGradientFrom] = useState("#3B82F6"); // デフォルトは青
  const [headerGradientTo, setHeaderGradientTo] = useState("#10B981"); // デフォルトは緑

  // データからグラデーション色を初期化
  useEffect(() => {
    if (data?.headerGradientFrom) {
      setHeaderGradientFrom(data.headerGradientFrom);
    }
    if (data?.headerGradientTo) {
      setHeaderGradientTo(data.headerGradientTo);
    }
  }, [data]);

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
      window.location.reload();
    } catch (error) {
      console.error("ゲストログインエラー:", error);
      alert(
        "ゲストログインに失敗しました。しばらくしてから再度お試しください。"
      );
    }
  };

  // 認証待機中の表示
  if (isWaiting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <span className="text-gray-600 font-medium text-lg">認証中...</span>
        </div>
      </div>
    );
  }

  if (!loginUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="text-blue-500 text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            ログインが必要です
          </h1>
          <p className="mb-8 text-gray-600 leading-relaxed text-center max-w-sm mx-auto">
            マイページをご利用いただくには
            <br />
            ログインまたは新規登録が必要です
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        {/* ヘッダー部分 */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-800 text-center">
              マイページ
            </h1>
          </div>
        </div>

        {/* ローディング表示 */}
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="animate-fade-in">
            {/* プロフィールカードのスケルトン */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-gray-300 to-gray-400 px-8 py-12 animate-pulse">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="w-32 h-6 bg-gray-200 rounded mx-auto mb-2"></div>
                  <div className="w-24 h-4 bg-gray-200 rounded mx-auto"></div>
                </div>
              </div>
              <div className="p-8">
                <div className="space-y-4">
                  <div className="w-20 h-6 bg-gray-200 rounded"></div>
                  <div className="bg-gray-100 rounded-xl p-6 space-y-3">
                    <div className="w-full h-4 bg-gray-200 rounded"></div>
                    <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                    <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="space-y-4 mt-8">
                    <div className="w-full h-12 bg-gray-200 rounded-xl"></div>
                    <div className="w-full h-12 bg-gray-200 rounded-xl"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* ヘッダー部分 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            マイページ
          </h1>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="animate-fade-in">
          {/* プロフィールカード */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              {/* プロフィールヘッダー */}
              <div
                className="px-8 py-12 text-center relative"
                style={{
                  background: `linear-gradient(to right, ${headerGradientFrom}, ${headerGradientTo})`,
                }}
              >
                <div className="relative z-10">
                  {/* プロフィール画像 */}
                  <div className="inline-block relative">
                    {data?.image ? (
                      <Image
                        src={data.image}
                        alt="プロフィール画像"
                        width={120}
                        height={120}
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                        <FontAwesomeIcon
                          icon={faCircleUser}
                          className="text-gray-400 text-6xl"
                        />
                      </div>
                    )}
                    {/* オンライン状態インジケーター */}
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>

                  {/* ユーザー名 */}
                  <h2 className="text-2xl font-bold text-white mt-4 mb-2">
                    {data?.name || "未設定のユーザー"}
                  </h2>
                </div>

                {/* 背景の装飾 */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                  <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white rounded-full"></div>
                  <div className="absolute top-8 right-8 w-6 h-6 border-2 border-white rotate-45"></div>
                  <div className="absolute bottom-6 left-8 w-4 h-4 border-2 border-white rounded-full"></div>
                </div>
              </div>

              {/* プロフィール詳細 */}
              <div className="p-8">
                {/* 自己紹介セクション */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-green-500 rounded-full mr-3"></div>
                    <h3 className="text-xl font-bold text-gray-800">
                      自己紹介
                    </h3>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-blue-500">
                    {data?.introduction ? (
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {data.introduction}
                      </p>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FontAwesomeIcon
                            icon={faCircleUser}
                            className="text-gray-400 text-2xl"
                          />
                        </div>
                        <p className="text-gray-500 italic">
                          自己紹介が設定されていません
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                          プロフィール編集から設定できます
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* アクションボタン */}
                <div className="space-y-4">
                  <Link href="/profile" className="block">
                    <div className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">プロフィール編集</span>
                        <div className="text-blue-200 group-hover:text-white transition-colors">
                          →
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link href="/myposts" className="block">
                    <div className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-4 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">投稿一覧</span>
                        <div className="text-green-200 group-hover:text-white transition-colors">
                          →
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
