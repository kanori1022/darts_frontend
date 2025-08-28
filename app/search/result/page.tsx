"use client";
import { Card } from "@/components/Card/Card";
import { useFavorites } from "@/hooks/api/useFavorites";
import useAuth from "@/hooks/auth/useAuth";
import { useFetch } from "@/hooks/fetch/useFetch";
import { Combination } from "@/types/combination";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

// APIレスポンスの型定義
type SearchResponse = {
  combinations: Combination[];
  pagination: {
    current_page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
  };
};

export default function SearchResult() {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const { loginUser } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  // 検索条件を取得
  const searchWord = searchParams.get("searchWord") || "";
  const tags = searchParams.get("tags") || "";

  // 検索条件に基づいてAPIからデータを取得
  const searchQuery = useMemo(() => {
    const params = new URLSearchParams();
    if (searchWord) params.set("searchWord", searchWord);
    if (tags) params.set("tags", tags);

    // limitとoffsetを直接計算して送信
    const limit = itemsPerPage;
    const offset = (currentPage - 1) * itemsPerPage;
    params.set("limit", limit.toString());
    params.set("offset", offset.toString());

    return params.toString();
  }, [searchWord, tags, currentPage, itemsPerPage]);

  const { data, isLoading } = useFetch<SearchResponse>(
    searchQuery ? `/combinations/search?${searchQuery}` : "/combinations"
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

  // 検索条件が変わったら1ページ目に戻す
  useMemo(() => {
    setCurrentPage(1);
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600 font-medium">検索中...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* ヘッダー部分（固定） */}
      <div className="p-5 font-bold bg-white border-b">
        <h1 className="text-xl mb-2">検索結果</h1>
        <p className="text-sm text-gray-600">
          検索条件: {searchParams.get("searchWord") || "なし"} / タグ:{" "}
          {searchParams.get("tags") || "なし"}
        </p>
        <p className="text-sm text-gray-600">
          結果件数: {data?.pagination.total_count || 0}件
        </p>
      </div>

      {/* スクロール可能なコンテンツエリア */}
      <div className="flex-1 overflow-y-auto p-4">
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
                      {/* 画像とタイトル */}
                      <div className="flex-shrink-0">
                        <Card
                          src={combination.image}
                          title={combination.title}
                          isFavorite={isFavorite(combination.id)}
                          onToggleFavorite={() =>
                            loginUser &&
                            toggleFavorite(
                              combination.id,
                              combination.user_id,
                              combination.firebase_uid
                            )
                          }
                          userId={combination.user_id}
                          currentUserId={loginUser?.uid}
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

                        <div className="mt-4">
                          <Link href={"/item/" + combination.id}>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-sm font-medium transition-colors duration-200 border border-blue-600 hover:border-blue-700">
                              詳細を見る
                            </button>
                          </Link>
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
            検索結果が見つかりませんでした
          </div>
        )}
      </div>

      {/* ページネーション（固定位置） */}
      {totalPages > 1 && (
        <div className="p-3 font-bold bg-white border-t">
          <div className="flex justify-between items-center">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
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
                  : "bg-blue-500 text-white hover:bg-blue-600"
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
