"use client";

import { Card } from "@/components/Card";
import { useFavorites } from "@/hooks/api/useFavorites";
import useAuth from "@/hooks/auth/useAuth";
import { useAxios } from "@/hooks/axios/useAxios";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

type HistoryItem = {
  id: string;
  title: string;
  image: string;
  tags?: string[];
  user_id?: string | number;
  firebase_uid?: string;
  user_name?: string;
  viewed_at?: string;
  flight?: string;
  shaft?: string;
  barrel?: string;
  tip?: string;
};

type HistoryResponse = {
  histories: Array<{
    id: string | number;
    title: string;
    image: string;
    tags?: string[];
    user_id?: string | number;
    firebase_uid?: string;
    user_name?: string;
    viewed_at?: string;
    flight?: string;
    shaft?: string;
    barrel?: string;
    tip?: string;
  }>;
  pagination: {
    current_page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
  };
};

export default function HistoryPage() {
  const axios = useAxios();
  const { loginUser, isWaiting } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [data, setData] = useState<HistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // URLパラメータからページ番号を読み取り
  useEffect(() => {
    const pageParam = searchParams.get("page");
    if (pageParam) {
      const pageNumber = parseInt(pageParam, 10);
      if (pageNumber > 0) {
        setCurrentPage(pageNumber);
      }
    }
  }, [searchParams]);

  const emptyData: HistoryResponse = useMemo(
    () => ({
      histories: [],
      pagination: {
        current_page: 1,
        per_page: itemsPerPage,
        total_count: 0,
        total_pages: 0,
      },
    }),
    [itemsPerPage]
  );

  const load = useCallback(
    async (page: number) => {
      setIsLoading(true);
      try {
        const offset = (page - 1) * itemsPerPage;
        const { data } = await axios.get("/view_histories", {
          params: { limit: itemsPerPage, offset },
        });
        console.log("=== フロントエンド閲覧履歴デバッグ ===");
        console.log("取得データ:", data);
        console.log("histories件数:", data?.histories?.length);
        console.log("total_count:", data?.pagination?.total_count);
        console.log("=====================================");
        setData(data as HistoryResponse);
      } catch {
        setData(emptyData);
      } finally {
        setIsLoading(false);
      }
    },
    [axios, itemsPerPage, emptyData]
  );

  useEffect(() => {
    if (isWaiting) return;
    if (!loginUser) {
      setData(emptyData);
      return;
    }
    load(currentPage);
  }, [currentPage, loginUser, isWaiting, load, emptyData]);

  const currentData = useMemo<HistoryItem[]>(() => {
    return (data?.histories || []).map((h) => ({
      id: String(h.id),
      title: h.title,
      image: h.image,
      tags: h.tags || [],
      user_id: h.user_id,
      firebase_uid: h.firebase_uid,
      user_name: h.user_name,
      viewed_at: h.viewed_at,
      flight: h.flight,
      shaft: h.shaft,
      barrel: h.barrel,
      tip: h.tip,
    }));
  }, [data]);

  const totalPages = data?.pagination?.total_pages || 0;

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
            <h1 className="text-2xl font-bold text-gray-800">閲覧履歴一覧</h1>
            <div className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded">
              RECENT
            </div>
          </div>
          <p className="text-sm text-gray-600">
            総件数: {data?.pagination.total_count || 0}件
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-2 sm:px-4">
        {/* コンテンツ（新着一覧・人気ランキングと同じスタイル） */}
        {currentData.length > 0 ? (
          <div className="max-w-6xl mx-auto">
            <div className="space-y-2 sm:space-y-4">
              {currentData.map((item) => (
                <div
                  key={item.id}
                  className="w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 overflow-hidden min-h-[120px]"
                >
                  {/* タイトルを上部左揃えに配置 */}
                  <div className="p-3 sm:p-5 pb-2 sm:pb-3">
                    <h3 className="text-sm sm:text-lg font-semibold text-gray-800 text-left mb-2 sm:mb-3">
                      {item.title}
                    </h3>
                  </div>

                  <div className="px-3 sm:px-5 pb-3 sm:pb-5">
                    <div className="flex items-center">
                      {/* 閲覧履歴バッジ */}
                      <div className="flex-shrink-0 mr-4 sm:mr-6">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-200">
                          <div className="px-1 sm:px-2 py-0.5 sm:py-1 bg-blue-500 text-white text-xs font-medium rounded">
                            RECENT
                          </div>
                        </div>
                      </div>

                      {/* 画像のみ */}
                      <div className="flex-shrink-0 mr-8 sm:mr-12">
                        <Card
                          src={item.image}
                          title={item.title}
                          isFavorite={isFavorite(item.id)}
                          onToggleFavorite={() =>
                            toggleFavorite(
                              item.id,
                              item.user_id,
                              item.firebase_uid
                            )
                          }
                          userId={item.user_id}
                          currentUserId={loginUser?.uid}
                          firebaseUid={item.firebase_uid}
                          currentFirebaseUid={loginUser?.uid}
                          onClick={() =>
                            (window.location.href = `/item/${item.id}?from=history&page=${currentPage}`)
                          }
                          tags={item.tags}
                          showTitle={false}
                        />
                      </div>

                      {/* パーツ詳細情報 */}
                      <div className="flex-1 flex flex-col justify-center max-w-xs">
                        <div>
                          <div className="text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-1.5 min-h-[60px] flex flex-col justify-center">
                            {item.flight ? (
                              <p>
                                フライト:{" "}
                                {item.flight.length > 6
                                  ? `${item.flight.substring(0, 6)}...`
                                  : item.flight}
                              </p>
                            ) : (
                              <p className="text-gray-400">フライト: -</p>
                            )}
                            {item.shaft ? (
                              <p>
                                シャフト:{" "}
                                {item.shaft.length > 6
                                  ? `${item.shaft.substring(0, 6)}...`
                                  : item.shaft}
                              </p>
                            ) : (
                              <p className="text-gray-400">シャフト: -</p>
                            )}
                            {item.barrel ? (
                              <p>
                                バレル:{" "}
                                {item.barrel.length > 6
                                  ? `${item.barrel.substring(0, 6)}...`
                                  : item.barrel}
                              </p>
                            ) : (
                              <p className="text-gray-400">バレル: -</p>
                            )}
                            {item.tip ? (
                              <p>
                                チップ:{" "}
                                {item.tip.length > 6
                                  ? `${item.tip.substring(0, 6)}...`
                                  : item.tip}
                              </p>
                            ) : (
                              <p className="text-gray-400">チップ: -</p>
                            )}
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
            閲覧履歴はありません
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
