"use client";

import { Card } from "@/components/Card";
import { useFetchPublic } from "@/hooks/fetch/useFetchPublic";
import { Combination } from "@/types/combination";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { memo, useMemo, useState } from "react";

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

// 個別のコンビネーションカードコンポーネント（メモ化で最適化）
const UserCombinationCard = memo(function UserCombinationCard({
  combination,
}: {
  combination: Combination;
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
                tags={combination.tags}
                onClick={() => {}}
              />
            </Link>
          </div>

          {/* 詳細情報 */}
          <div className="flex-2 flex flex-col justify-between">
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                投稿日:{" "}
                {new Date(combination.created_at).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

type UserPostsProps = {
  userId: string;
  userName: string;
};

export const UserPosts = ({ userId, userName }: UserPostsProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // ユーザーの投稿を取得（認証不要）
  const { data, isLoading, error } = useFetchPublic<CombinationsResponse>(
    `/users/${userId}/combinations?limit=${itemsPerPage}&offset=${(currentPage - 1) * itemsPerPage}`
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

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-lg font-medium mb-2">
          投稿の読み込みに失敗しました
        </div>
        <p className="text-gray-600">しばらくしてから再度お試しください。</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">
          {userName}の投稿一覧
        </h3>
        {userCombinations.length > 0 && (
          <span className="text-sm text-gray-500">
            {data?.pagination?.total_count || 0}件の投稿
          </span>
        )}
      </div>

      {isLoading ? (
        // スケルトンローディング表示
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : userCombinations.length > 0 ? (
        <>
          <div className="space-y-4">
            {userCombinations.map((combination) => (
              <UserCombinationCard
                key={combination.id}
                combination={combination}
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
          <p className="text-gray-600">
            {userName}さんはまだ投稿していません。
          </p>
        </div>
      )}
    </div>
  );
};
