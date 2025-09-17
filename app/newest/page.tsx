"use client";

import { Card } from "@/components/Card";
import { useFavorites } from "@/hooks/api/useFavorites";
import useAuth from "@/hooks/auth/useAuth";
import { useFetch } from "@/hooks/fetch/useFetch";
import { Combination } from "@/types/combination";
import { useMemo, useState } from "react";

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

export default function NewestPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { loginUser } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  // 新着データを取得
  const { data, isLoading } = useFetch<CombinationsResponse>(
    `/combinations/newest?limit=${itemsPerPage}&offset=${(currentPage - 1) * itemsPerPage}`
  );

  // 現在のページのデータを取得
  const currentData = useMemo(() => {
    if (!data?.combinations) return [];
    return data.combinations;
  }, [data]);

  // 総ページ数を取得
  const totalPages = useMemo(() => {
    if (!data?.pagination) return 0;
    return data.pagination.total_pages;
  }, [data]);

  // お気に入り処理
  const handleToggleFavorite = async (
    id: string,
    userId?: string | number,
    firebaseUid?: string
  ) => {
    if (!loginUser) {
      alert("お気に入り機能を使用するにはログインが必要です");
      return;
    }
    await toggleFavorite(id, userId, firebaseUid);
  };

  // ページネーション処理
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600 font-medium">読み込み中...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* スクロール可能なコンテンツエリア */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-4">
          {/* ヘッダー部分（スクロール対象） */}
          <div className="p-5 font-bold bg-white border-b shadow-sm mb-4 rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                <h1 className="text-2xl font-bold text-gray-800">新着一覧</h1>
                <div className="px-2 py-1 bg-green-100 text-green-600 text-xs font-medium rounded">
                  NEW
                </div>
              </div>
              <p className="text-sm text-gray-600">
                総件数: {data?.pagination.total_count || 0}件
              </p>
            </div>
          </div>

          {currentData.length > 0 ? (
            <div className="max-w-6xl mx-auto">
              <div className="space-y-4">
                {currentData.map((combination) => (
                  <div
                    key={combination.id}
                    className="w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex items-center space-x-4">
                        {/* NEW バッジ */}
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center border-2 border-green-200">
                            <div className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded">
                              NEW
                            </div>
                          </div>
                        </div>

                        {/* 画像とタイトル */}
                        <div className="flex-shrink-0">
                          <Card
                            src={combination.image}
                            title={combination.title}
                            isFavorite={isFavorite(combination.id)}
                            onToggleFavorite={() =>
                              handleToggleFavorite(
                                combination.id,
                                combination.user_id,
                                combination.firebase_uid
                              )
                            }
                            userId={combination.user_id}
                            currentUserId={loginUser?.uid}
                            firebaseUid={combination.firebase_uid}
                            currentFirebaseUid={loginUser?.uid}
                            onClick={() =>
                              (window.location.href = `/item/${combination.id}`)
                            }
                            tags={combination.tags}
                          />
                        </div>

                        {/* 詳細情報とボタン */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                              {combination.title}
                            </h3>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>フライト: {combination.flight}</p>
                              <p>シャフト: {combination.shaft}</p>
                              <p>バレル: {combination.barrel}</p>
                              <p>チップ: {combination.tip}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              データが見つかりませんでした
            </div>
          )}
        </div>
      </div>
      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="mt-8 mb-8 flex justify-center">
          <div className="flex items-center space-x-3 bg-white rounded-2xl shadow-lg border border-gray-200 p-2">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:shadow-lg hover:scale-105 cursor-pointer"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>前へ</span>
            </button>

            <span className="px-4 py-2 text-gray-600">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:shadow-lg hover:scale-105 cursor-pointer"
              }`}
            >
              <span>次へ</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
