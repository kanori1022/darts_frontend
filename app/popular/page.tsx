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
  const itemsPerPage = 10;
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
    <div className="min-h-screen bg-gray-50">
      {/* Header Section - 固定位置 */}
      <div className="bg-white border-b border-gray-200 py-6 px-6 mb-6">
        <div className="max-w-4xl mx-auto text-center">
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

      {/* Content Section */}
      <div className="px-2 sm:px-4">
        {currentData.length > 0 ? (
          <div className="max-w-6xl mx-auto">
            <div className="space-y-2 sm:space-y-4">
              {currentData.map((combination, index) => {
                const globalRank = (currentPage - 1) * itemsPerPage + index + 1;

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
                    {/* タイトルを上部左揃えに配置 */}
                    <div className="p-3 sm:p-5 pb-2 sm:pb-3">
                      <h3 className="text-sm sm:text-lg font-semibold text-gray-800 text-left mb-2 sm:mb-3">
                        {combination.title}
                      </h3>
                    </div>

                    <div className="px-3 sm:px-5 pb-3 sm:pb-5">
                      <div className="flex items-center">
                        {/* ランキング表示 */}
                        <div className="flex-shrink-0 mr-4 sm:mr-6">
                          {globalRank <= 3 ? (
                            <div
                              className={`w-8 h-8 sm:w-12 sm:h-12 ${crownStyle.bgColor} rounded-full flex items-center justify-center shadow-xl border-2 border-white`}
                            >
                              <div className="relative flex items-center justify-center">
                                <FontAwesomeIcon
                                  icon={faCrown}
                                  className={`text-sm sm:text-lg ${crownStyle.color}`}
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
                            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center border border-gray-300">
                              <span className="text-sm sm:text-lg font-bold text-gray-600">
                                {globalRank}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* 画像のみ */}
                        <div className="flex-shrink-0 mr-8 sm:mr-12">
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
                              (window.location.href = `/item/${combination.id}?from=popular&page=${currentPage}`)
                            }
                            tags={combination.tags}
                            showTitle={false}
                          />
                        </div>

                        {/* 詳細情報 */}
                        <div className="flex-1 flex flex-col justify-center max-w-xs">
                          <div>
                            <div className="text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-1.5">
                              <p>
                                フライト:{" "}
                                {combination.flight.length > 6
                                  ? `${combination.flight.substring(0, 6)}...`
                                  : combination.flight}
                              </p>
                              <p>
                                シャフト:{" "}
                                {combination.shaft.length > 6
                                  ? `${combination.shaft.substring(0, 6)}...`
                                  : combination.shaft}
                              </p>
                              <p>
                                バレル:{" "}
                                {combination.barrel.length > 6
                                  ? `${combination.barrel.substring(0, 6)}...`
                                  : combination.barrel}
                              </p>
                              <p>
                                チップ:{" "}
                                {combination.tip.length > 6
                                  ? `${combination.tip.substring(0, 6)}...`
                                  : combination.tip}
                              </p>
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

        {/* ページネーション */}
        {totalPages > 1 && (
          <div className="mt-4 sm:mt-8 mb-8 sm:mb-12 flex justify-center sticky bottom-4 z-10">
            <div className="flex items-center space-x-1 sm:space-x-3 bg-white rounded-2xl shadow-lg border border-gray-200 p-1 sm:p-2 backdrop-blur-sm">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:scale-105 cursor-pointer"
                }`}
              >
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4"
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
                <span className="hidden sm:inline">前へ</span>
                <span className="sm:hidden">前</span>
              </button>

              <span className="px-2 sm:px-4 py-1 sm:py-2 text-gray-600 text-xs sm:text-sm">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:scale-105 cursor-pointer"
                }`}
              >
                <span className="hidden sm:inline">次へ</span>
                <span className="sm:hidden">次</span>
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4"
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
    </div>
  );
}
