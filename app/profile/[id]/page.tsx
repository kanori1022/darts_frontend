"use client";

import { Button } from "@/components/Button/Button";
import useAuth from "@/hooks/auth/useAuth";
import { useFetch } from "@/hooks/fetch/useFetch";
import { useFetchPublic } from "@/hooks/fetch/useFetchPublic";
import { User } from "@/types/user";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
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

  // 現在のユーザー情報を取得
  const { data: currentUser, isLoading: currentUserLoading } = useFetch<User>(
    loginUser ? "/users" : null
  );

  // 表示したいユーザー情報を取得（認証不要）
  const {
    data: targetUser,
    error: targetUserError,
    isLoading: targetUserLoading,
  } = useFetchPublic<User>(`/users/${id}`);

  // デバッグ情報を追加
  console.log("UserProfile Debug Info:", {
    id,
    currentUser,
    targetUser,
    isCurrentUser: currentUser?.id === id,
  });

  // ローディング状態
  if (currentUserLoading || targetUserLoading || isWaiting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">読み込み中...</p>
        </div>
      </div>
    );
  }

  // 表示したいユーザーが見つからない場合
  if (targetUserError || !targetUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="text-gray-400 text-4xl mb-4">👤</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            ユーザーが見つかりません
          </h2>
          <p className="text-gray-600 mb-4">
            指定されたユーザー情報を取得できませんでした。
          </p>
          <div className="space-y-2">
            <Link href="/home">
              <Button color="bg-blue-500 hover:bg-blue-600">
                ホームに戻る
              </Button>
            </Link>
            {currentUser && (
              <Link href="/mypage">
                <Button color="bg-gray-500 hover:bg-gray-600">
                  マイページ
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 現在のユーザーと表示したいユーザーが一致するかチェック
  const isOwnProfile = currentUser?.id === id;

  // 自分のプロフィールの場合はマイページにリダイレクト
  if (isOwnProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="text-blue-500 text-4xl mb-4">👤</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            自分のプロフィール
          </h2>
          <p className="text-gray-600 mb-4">
            自分のプロフィールを編集する場合は、マイページをご利用ください。
          </p>
          <div className="space-y-2">
            <Link href="/mypage">
              <Button color="bg-blue-500 hover:bg-blue-600">
                マイページに移動
              </Button>
            </Link>
            <Link href="/home">
              <Button color="bg-gray-500 hover:bg-gray-600">
                ホームに戻る
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 他のユーザーのプロフィール表示
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* ヘッダー部分 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            {targetUser.name || "未設定のユーザー"}のプロフィール
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
                    {targetUser?.image ? (
                      <Image
                        src={targetUser.image}
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
                    {targetUser?.name || "未設定のユーザー"}
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
                    {targetUser?.introduction ? (
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {targetUser.introduction}
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
                      </div>
                    )}
                  </div>
                </div>

                {/* アクションボタン */}
                <div className="space-y-4">
                  <Link href="/home" className="block">
                    <div className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">ホームに戻る</span>
                        <div className="text-blue-200 group-hover:text-white transition-colors">
                          →
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link href={`/user-posts/${id}`} className="block">
                    <div className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-4 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">投稿一覧を見る</span>
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
