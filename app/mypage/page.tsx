"use client";

import { Button } from "@/components/Button";
import useAuth from "@/hooks/auth/useAuth";
import { useFetch } from "@/hooks/fetch/useFetch";
import { User } from "@/types/user";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

export default function Mypage() {
  const { loginUser, isWaiting } = useAuth();
  const { data, isLoading } = useFetch<User>(
    loginUser && !isWaiting ? "/users" : null
  );

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
              <div className="bg-gradient-to-r from-blue-500 to-green-500 px-8 py-12 text-center relative">
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
