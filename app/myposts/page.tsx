"use client";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { useDeleteCombination } from "@/hooks/api/useDeleteCombination";
import useAuth from "@/hooks/auth/useAuth";
import { useFetch } from "@/hooks/fetch/useFetch";
import { Combination } from "@/types/combination";
import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { memo, useCallback, useMemo, useState } from "react";

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
const CombinationCard = memo(function CombinationCard({
  combination,
  onDelete,
  deleteLoading,
}: {
  combination: Combination;
  onDelete: (id: string, title: string) => void;
  deleteLoading: boolean;
}) {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center space-x-4">
          {/* 画像とタイトル */}
          <div className="flex-shrink-0">
            <Card
              src={combination.image}
              title={combination.title}
              // 自分の投稿なので、お気に入り機能は無効
              // onToggleFavoriteとisFavoriteを渡さないことで、お気に入りボタンは表示されない
            />
          </div>

          {/* 詳細情報とボタン */}
          <div className="flex-2 flex flex-col justify-between">
            <div className="mt-4 flex space-x-5">
              <Link href={`/edit/${combination.id}`}>
                <button className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors duration-200 cursor-pointer">
                  <FontAwesomeIcon icon={faEdit} className="mr-1" />
                  編集する
                </button>
              </Link>
              <button
                onClick={() => onDelete(combination.id, combination.title)}
                disabled={deleteLoading}
                className="bg-red-400 hover:bg-red-500 disabled:bg-red-300 text-white py-2 px-4 rounded text-sm font-medium transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed"
              >
                <FontAwesomeIcon icon={faTrash} className="mr-1" />
                {deleteLoading ? "削除中..." : "削除する"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default function MyPosts() {
  const { loginUser, isWaiting } = useAuth();
  const { deleteCombination, isLoading: deleteLoading } =
    useDeleteCombination();
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const itemsPerPage = 10;

  // 認証が完了し、ログインユーザーが存在する場合のみAPIリクエストを送信
  const shouldFetch = !isWaiting && loginUser;
  const { data, isLoading } = useFetch<CombinationsResponse>(
    shouldFetch
      ? `/combinations/my_posts?limit=${itemsPerPage}&offset=${(currentPage - 1) * itemsPerPage}&refresh=${refreshTrigger}`
      : null
  );

  // APIから直接取得したデータを使用（hooksは早期returnの前に配置）
  const myCombinations = useMemo(
    () => data?.combinations || [],
    [data?.combinations]
  );
  const totalPages = useMemo(
    () => data?.pagination?.total_pages || 0,
    [data?.pagination?.total_pages]
  );
  const currentData = myCombinations;

  const handleDelete = useCallback(
    async (combinationId: string, title: string) => {
      const confirmDelete = window.confirm(
        `「${title}」を削除しますか？\nこの操作は取り消せません。`
      );

      if (!confirmDelete) return;

      try {
        await deleteCombination(combinationId);
        alert("投稿を削除しました");

        // データを再取得
        setRefreshTrigger((prev) => prev + 1);

        // ページ数が変わった場合の調整
        if (myCombinations.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error("削除エラー:", error);
        alert(error instanceof Error ? error.message : "削除に失敗しました");
      }
    },
    [deleteCombination, myCombinations.length, currentPage]
  );

  // 認証待機中の表示
  if (isWaiting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600 font-medium">認証中...</span>
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <span className="ml-3 text-gray-600 font-medium">読み込み中...</span>
      </div>
    );
  }

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
            <div className="mt-4 flex space-x-5">
              <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
              <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 py-6 px-6 mb-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-2 text-gray-800">投稿一覧</h1>
        </div>
      </div>

      {/* My Posts Section */}
      <section className="mb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            // スケルトンローディング表示
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : myCombinations.length > 0 ? (
            <>
              <div className="space-y-4">
                {currentData.map((combination) => (
                  <CombinationCard
                    key={combination.id}
                    combination={combination}
                    onDelete={handleDelete}
                    deleteLoading={deleteLoading}
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
                初めてのコンビネーションを投稿してみましょう
              </p>
              <Link href="/post">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 cursor-pointer">
                  投稿する
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
