"use client";
import { Card } from "@/components/Card";
import { useFavorites } from "@/hooks/api/useFavorites";
import useAuth from "@/hooks/auth/useAuth";
import { useFetch } from "@/hooks/fetch/useFetch";
import { Combination } from "@/types/combination";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

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

function SearchResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { loginUser } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  // 検索フォームの状態
  const [searchForm, setSearchForm] = useState({
    searchWord: searchParams.get("searchWord") || "",
    tags: searchParams.get("tags") || "",
    username: searchParams.get("username") || "",
  });

  // 検索条件を取得
  const searchWord = searchParams.get("searchWord") || "";
  const tags = searchParams.get("tags") || "";
  const username = searchParams.get("username") || "";

  // 検索条件に基づいてAPIからデータを取得
  const searchQuery = useMemo(() => {
    const params = new URLSearchParams();
    if (searchWord) params.set("searchWord", searchWord);
    if (tags) params.set("tags", tags);
    if (username) params.set("username", username);

    // limitとoffsetを直接計算して送信
    const limit = itemsPerPage;
    const offset = (currentPage - 1) * itemsPerPage;
    params.set("limit", limit.toString());
    params.set("offset", offset.toString());

    return params.toString();
  }, [searchWord, tags, username, currentPage, itemsPerPage]);

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
  useEffect(() => {
    setCurrentPage(1);
  }, [searchWord, tags, username]);

  // 検索実行
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchForm.searchWord.trim()) {
      params.set("searchWord", searchForm.searchWord.trim());
    }
    if (searchForm.tags.trim()) {
      params.set("tags", searchForm.tags.trim());
    }
    if (searchForm.username.trim()) {
      params.set("username", searchForm.username.trim());
    }

    const queryString = params.toString();
    router.push(`/search/result${queryString ? `?${queryString}` : ""}`);
  };

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
      {/* ヘッダー部分（タイトルのみ） */}
      <div className="p-5 font-bold bg-white border-b">
        <div className="text-center">
          <h1 className="text-xl">検索結果</h1>
        </div>
      </div>

      {/* スクロール可能なコンテンツエリア */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-6xl mx-auto">
          {/* 検索フォーム */}
          <div className="mb-6 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              検索条件を変更
            </h2>
            <div className="flex justify-center">
              <div className="w-full max-w-lg">
                <form onSubmit={handleSearch} className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="キーワード検索"
                      value={searchForm.searchWord}
                      onChange={(e) =>
                        setSearchForm({
                          ...searchForm,
                          searchWord: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors duration-200 whitespace-nowrap cursor-pointer"
                    >
                      検索
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="タグ検索（例: 初心者向け）"
                    value={searchForm.tags}
                    onChange={(e) =>
                      setSearchForm({ ...searchForm, tags: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="ユーザー名検索（例: username）"
                    value={searchForm.username}
                    onChange={(e) =>
                      setSearchForm({ ...searchForm, username: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </form>
              </div>
            </div>
          </div>

          {/* 検索条件と結果件数 */}
          <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="space-y-1 text-center">
              <p className="text-sm text-gray-600">
                検索条件: {searchParams.get("searchWord") || "なし"} / タグ:{" "}
                {searchParams.get("tags") || "なし"} / ユーザー名:{" "}
                {searchParams.get("username") || "なし"}
              </p>
              <p className="text-sm text-gray-600">
                結果件数: {data?.pagination.total_count || 0}件
              </p>
            </div>
          </div>

          {currentData.length > 0 ? (
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
                          firebaseUid={combination.firebase_uid}
                          currentFirebaseUid={loginUser?.uid}
                          onClick={() =>
                            (window.location.href = `/item/${combination.id}`)
                          }
                          tags={combination.tags}
                        />
                      </div>

                      {/* 詳細情報とボタン */}
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="mt-10">
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
          ) : (
            <div className="text-center text-gray-500 py-8">
              検索結果が見つかりませんでした
            </div>
          )}
        </div>
      </div>

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
  );
}

export default function SearchResult() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600 font-medium">読み込み中...</span>
        </div>
      }
    >
      <SearchResultContent />
    </Suspense>
  );
}
