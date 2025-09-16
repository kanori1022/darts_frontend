"use client";

import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card";
import { useFavorites } from "@/hooks/api/useFavorites";
import useAuth from "@/hooks/auth/useAuth";
import { useFetchPublic } from "@/hooks/fetch/useFetchPublic";
import { Combination } from "@/types/combination";
import { User } from "@/types/user";
import { faArrowLeft, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { memo, use, useMemo, useState } from "react";

// APIレスポンスの型定義
type CombinationsResponse = {
  combinations: Combination[];
  pagination: {
    current_page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
  };
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

// 個別のコンビネーションカードコンポーネント（メモ化で最適化）
const UserCombinationCard = memo(function UserCombinationCard({
  combination,
  onToggleFavorite,
  isFavorite,
  currentUserId,
  currentFirebaseUid,
}: {
  combination: Combination;
  onToggleFavorite: (
    id: string,
    userId?: string | number,
    firebaseUid?: string
  ) => void;
  isFavorite: (id: string) => boolean;
  currentUserId?: string | number;
  currentFirebaseUid?: string;
}) {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center space-x-4">
          {/* 画像とタイトル */}
          <div className="flex-shrink-0">
            <Link href={`/item/${combination.id}`}>
              <Card
                src={combination.image}
                title={combination.title}
                onClick={() => {}}
                isFavorite={isFavorite(combination.id)}
                onToggleFavorite={() =>
                  onToggleFavorite(
                    combination.id,
                    combination.user_id,
                    combination.firebase_uid
                  )
                }
                userId={combination.user_id}
                currentUserId={currentUserId}
                firebaseUid={combination.firebase_uid}
                currentFirebaseUid={currentFirebaseUid}
              />
            </Link>
          </div>

          {/* 詳細情報 */}
          <div className="flex-2 flex flex-col justify-between">
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                投稿日:{" "}
                {combination.created_at
                  ? new Date(combination.created_at).toLocaleDateString(
                      "ja-JP",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      }
                    )
                  : "不明"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default function UserPostsPage({ params }: Props) {
  const { id } = use(params);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { loginUser } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleToggleFavorite = async (
    combinationId: string,
    userId?: string | number,
    firebaseUid?: string
  ) => {
    if (!loginUser) {
      alert("お気に入り機能を使用するにはログインが必要です");
      return;
    }

    await toggleFavorite(combinationId, userId, firebaseUid);
  };

  // ユーザー情報を取得
  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useFetchPublic<User>(`/users/${id}`);

  // ユーザーの投稿を取得（認証不要）
  const { data, isLoading, error } = useFetchPublic<CombinationsResponse>(
    `/users/${id}/combinations?limit=${itemsPerPage}&offset=${(currentPage - 1) * itemsPerPage}`
  );

  // APIから直接取得したデータを使用
  const userCombinations = useMemo(
    () => data?.combinations || [],
    [data?.combinations]
  );
  const totalPages = useMemo(
    () => data?.pagination?.total_pages || 0,
    [data?.pagination?.total_pages]
  );

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // スケルトンローディングコンポーネント
  const SkeletonCard = () => (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="px-4 pb-2 w-40 flex flex-col justify-between">
              <div className="w-32 h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="w-32 h-24 bg-gray-200 animate-pulse rounded-lg"></div>
            </div>
          </div>
          <div className="flex-2 flex flex-col justify-between">
            <div className="mt-4">
              <div className="w-24 h-4 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ローディング状態
  if (userLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* ヘッダー部分 */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 animate-pulse rounded"></div>
              <div className="w-48 h-8 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // エラー状態
  if (userError || error) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* ヘッダー部分 */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="flex items-center space-x-4">
              <Link href={`/profile/${id}`}>
                <Button color="bg-gray-500 hover:bg-gray-600">
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                  プロフィールに戻る
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">投稿一覧</h1>
            </div>
          </div>
        </div>

        {/* エラー表示 */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <div className="text-red-500 text-lg font-medium mb-2">
              データの読み込みに失敗しました
            </div>
            <p className="text-gray-600 mb-6">
              しばらくしてから再度お試しください。
            </p>
            <Link href={`/profile/${id}`}>
              <Button color="bg-blue-500 hover:bg-blue-600">
                プロフィールに戻る
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー部分 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center space-x-4">
            <Link href={`/profile/${id}`}>
              <Button color="bg-gray-500 hover:bg-gray-600">
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                プロフィールに戻る
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {userData?.name || "未設定のユーザー"}の投稿一覧
              </h1>
              {data?.pagination?.total_count && (
                <p className="text-sm text-gray-600 mt-1">
                  {data.pagination.total_count}件の投稿
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {userCombinations.length > 0 ? (
          <>
            <div className="space-y-4">
              {userCombinations.map((combination) => (
                <UserCombinationCard
                  key={combination.id}
                  combination={combination}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={isFavorite}
                  currentUserId={loginUser?.uid}
                  currentFirebaseUid={loginUser?.uid}
                />
              ))}
            </div>

            {/* ページネーション */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex space-x-2">
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded ${
                      currentPage === 1
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                    }`}
                  >
                    前のページ
                  </button>
                  <span className="px-4 py-2 text-gray-600">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded ${
                      currentPage === totalPages
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                    }`}
                  >
                    次のページ
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <FontAwesomeIcon
                  icon={faPlus}
                  className="text-gray-500 text-2xl"
                />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              まだ投稿がありません
            </h3>
            <p className="text-gray-600 mb-6">
              {userData?.name || "このユーザー"}はまだ投稿していません。
            </p>
            <Link href={`/profile/${id}`}>
              <Button color="bg-blue-500 hover:bg-blue-600">
                プロフィールに戻る
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
