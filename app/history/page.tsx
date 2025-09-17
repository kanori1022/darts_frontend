"use client";

import { Card } from "@/components/Card";
import { useFavorites } from "@/hooks/api/useFavorites";
import useAuth from "@/hooks/auth/useAuth";
import { useAxios } from "@/hooks/axios/useAxios";
import { useCallback, useEffect, useMemo, useState } from "react";

type HistoryItem = {
  id: string;
  title: string;
  image: string;
  tags?: string[];
};

type HistoryResponse = {
  histories: Array<{
    id: string | number;
    title: string;
    image: string;
    tags?: string[];
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [data, setData] = useState<HistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      <div className="px-4">
        {/* コンテンツ（popularのカード並びに合わせる） */}
        {currentData.length > 0 ? (
          <div className="max-w-6xl mx-auto">
            <div className="space-y-4">
              {currentData.map((item) => (
                <div
                  key={item.id}
                  className="w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex items-center space-x-4">
                      {/* 画像とタイトル */}
                      <div className="flex-shrink-0">
                        <Card
                          src={item.image}
                          title={item.title}
                          isFavorite={isFavorite(item.id)}
                          onToggleFavorite={() => toggleFavorite(item.id)}
                          userId={undefined}
                          currentUserId={loginUser?.uid}
                          firebaseUid={undefined}
                          currentFirebaseUid={loginUser?.uid}
                          onClick={() =>
                            (window.location.href = `/item/${item.id}`)
                          }
                          tags={item.tags}
                        />
                      </div>

                      {/* 詳細情報（タイトルのみ） */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {item.title}
                          </h3>
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
          <div className="mt-8 mb-12 flex justify-center sticky bottom-4 z-10">
            <div className="flex items-center space-x-3 bg-white rounded-2xl shadow-lg border border-gray-200 p-2 backdrop-blur-sm">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 hover:shadow-lg hover:scale-105 cursor-pointer"
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
                    : "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 hover:shadow-lg hover:scale-105 cursor-pointer"
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
    </div>
  );
}
