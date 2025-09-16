"use client";

import { Card } from "@/components/Card";
import { useFavorites } from "@/hooks/api/useFavorites";
import useAuth from "@/hooks/auth/useAuth";
import { useFetch } from "@/hooks/fetch/useFetch";
import { Combination } from "@/types/combination";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

export default function PopularPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { loginUser } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  // 人気ランキングデータを取得
  const { data, isLoading } = useFetch<CombinationsResponse>(
    `/combinations?limit=${itemsPerPage}&offset=${(currentPage - 1) * itemsPerPage}&sort=popular`
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
                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                <h1 className="text-2xl font-bold text-gray-800">
                  人気ランキング一覧
                </h1>
                <div className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded">
                  HOT
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
                {currentData.map((combination, index) => {
                  const globalRank =
                    (currentPage - 1) * itemsPerPage + index + 1;

                  const getCrownStyle = (rank: number) => {
                    switch (rank) {
                      case 1:
                        return {
                          color: "text-yellow-400",
                          bgColor: "bg-yellow-50",
                        };
                      case 2:
                        return {
                          color: "text-gray-400",
                          bgColor: "bg-gray-50",
                        };
                      case 3:
                        return {
                          color: "text-orange-600",
                          bgColor: "bg-orange-50",
                        };
                      default:
                        return {
                          color: "text-gray-400",
                          bgColor: "bg-gray-50",
                        };
                    }
                  };
                  const crownStyle = getCrownStyle(globalRank);

                  return (
                    <div
                      key={combination.id}
                      className="w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 overflow-hidden"
                    >
                      <div className="p-4">
                        <div className="flex items-center space-x-4">
                          {/* ランキング表示 */}
                          <div className="flex-shrink-0">
                            {globalRank <= 3 ? (
                              <div
                                className={`w-12 h-12 ${crownStyle.bgColor} rounded-full flex items-center justify-center shadow-xl border-2 border-white`}
                              >
                                <div className="relative flex items-center justify-center">
                                  <FontAwesomeIcon
                                    icon={faCrown}
                                    className={`text-lg ${crownStyle.color}`}
                                  />
                                  <span
                                    className="absolute text-xs font-bold text-gray-900 drop-shadow-sm"
                                    style={{
                                      top: "50%",
                                      left: "50%",
                                      transform: "translate(-50%, -50%)",
                                    }}
                                  >
                                    {globalRank}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border border-gray-300">
                                <span className="text-lg font-bold text-gray-600">
                                  {globalRank}
                                </span>
                              </div>
                            )}
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
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              データが見つかりませんでした
            </div>
          )}
        </div>
      </div>

      {/* ページネーション（固定位置） */}
      <div className="flex-shrink-0 p-3 font-bold bg-white border-t shadow-lg">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          {totalPages > 1 ? (
            <>
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded ${
                  currentPage === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                }`}
              >
                前のページ
              </button>

              <span className="text-center">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                }`}
              >
                次のページ
              </button>
            </>
          ) : (
            <div className="text-center text-gray-600">
              <span>ページ: 1 / 1</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
