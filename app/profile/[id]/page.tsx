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
  } = useFetch<User>(id ? `/users/${id}` : null);

  // ローディング状態
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

  // エラーまたはデータがない場合
  if (error || !currentUserData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="text-gray-400 text-4xl mb-4">👤</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            ユーザーが見つかりません
          </h2>
          <p className="text-gray-600 mb-4">
            ユーザーID「{id}」は存在しないか、アクセスできません。
          </p>
          <div className="space-y-2">
            <Link href="/home">
              <Button color="bg-blue-500 hover:bg-blue-600">
                ホームに戻る
              </Button>
            </Link>
            <Link href="/mypage">
              <Button color="bg-gray-500 hover:bg-gray-600">マイページ</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 日付フォーマット関数
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 自己紹介文を取得（description または introduction のどちらかを使用）
  const userDescription =
    currentUserData.description || currentUserData.introduction;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Profile Info */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {currentUserData.name
                    ? currentUserData.name.charAt(0).toUpperCase()
                    : "U"}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                  {currentUserData.name || "匿名ユーザー"}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faUser} className="text-blue-500" />
                    <span>ユーザーID: {currentUserData.id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="text-green-500"
                    />
                    <span>
                      登録日: {formatDate(currentUserData.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {loginUser && loginUser.uid === currentUserData.firebase_uid && (
                <div className="flex gap-2">
                  <Link href="/mypage">
                    <Button color="bg-blue-600 hover:bg-blue-700">
                      マイページ
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* User Stats */}
          <div className="p-6 bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {currentUserData.combinations_count || 0}
                </div>
                <div className="text-sm text-gray-600">投稿数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {currentUserData.favorites_count || 0}
                </div>
                <div className="text-sm text-gray-600">お気に入り数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {currentUserData.view_count || 0}
                </div>
                <div className="text-sm text-gray-600">閲覧数</div>
              </div>
            </div>
          </div>
        </div>

        {/* User Description */}
        {userDescription && (
          <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
              自己紹介
            </h2>
            <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
              {userDescription}
            </p>
          </div>
        )}

        {/* Recent Posts */}
        {currentUserData.recent_combinations &&
          currentUserData.recent_combinations.length > 0 && (
            <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
                最近の投稿
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentUserData.recent_combinations.map(
                  (combination, index) => (
                    <Link
                      key={index}
                      href={`/item/${combination.id}`}
                      className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="aspect-w-16 aspect-h-9 mb-3">
                        <Image
                          src={combination.image}
                          alt={combination.title}
                          width={200}
                          height={150}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                      <h3 className="font-medium text-gray-800 text-sm mb-2 line-clamp-2">
                        {combination.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {formatDate(combination.created_at)}
                      </p>
                    </Link>
                  )
                )}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
