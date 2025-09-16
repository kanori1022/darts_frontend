"use client";

import { Card } from "@/components/Card";
import { useFavorites } from "@/hooks/api/useFavorites";
import useAuth from "@/hooks/auth/useAuth";
import { useAxios } from "@/hooks/axios/useAxios";
import { useEffect, useMemo, useState } from "react";

type HistoryItem = { id: string; title: string; image: string };

type HistoryResponse = {
  histories: Array<{ id: string | number; title: string; image: string }>;
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

  const emptyData: HistoryResponse = {
    histories: [],
    pagination: {
      current_page: 1,
      per_page: itemsPerPage,
      total_count: 0,
      total_pages: 0,
    },
  };

  const load = async (page: number) => {
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
  };

  useEffect(() => {
    if (isWaiting) return;
    if (!loginUser) {
      setData(emptyData);
      return;
    }
    load(currentPage);
  }, [currentPage, loginUser, isWaiting]);

  const currentData = useMemo<HistoryItem[]>(() => {
    return (data?.histories || []).map((h) => ({
      id: String(h.id),
      title: h.title,
      image: h.image,
    }));
  }, [data]);

  const totalPages = data?.pagination?.total_pages || 0;

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
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
      {/* スクロール可能なコンテンツエリア（popularに合わせる） */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-4">
          {/* ヘッダー部分（スクロール対象 / popularと同様の見た目） */}
          <div className="p-5 font-bold bg-white border-b shadow-sm mb-4 rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                <h1 className="text-2xl font-bold text-gray-800">
                  閲覧履歴一覧
                </h1>
                <div className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded">
                  RECENT
                </div>
              </div>
              <p className="text-sm text-gray-600">
                総件数: {data?.pagination.total_count || 0}件
              </p>
            </div>
          </div>

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
        </div>
      </div>

      {/* ページネーション（popularと同様の見た目） */}
      {totalPages > 1 && (
        <div className="flex-shrink-0 p-3 font-bold bg-white border-t shadow-lg">
          <div className="flex justify-between items-center max-w-6xl mx-auto">
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
          </div>
        </div>
      )}
    </div>
  );
}
