"use client";

import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { useFavorites } from "@/hooks/api/useFavorites";
import useAuth from "@/hooks/auth/useAuth";
import { useFetch } from "@/hooks/fetch/useFetch";
import { Combination } from "@/types/combination";
import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState } from "react";

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

export default function MyPosts() {
  const { loginUser } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 自分が投稿したコンビネーションを直接APIから取得
  const { data, isLoading } = useFetch<CombinationsResponse>(
    `/combinations/my_posts?limit=${itemsPerPage}&offset=${(currentPage - 1) * itemsPerPage}`
  );

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

  // APIから直接取得したデータを使用
  const myCombinations = data?.combinations || [];
  const totalPages = data?.pagination?.total_pages || 0;
  const currentData = myCombinations;

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
          {myCombinations.length > 0 ? (
            <>
              <div className="space-y-4">
                {currentData.map((combination) => (
                  <div
                    key={combination.id}
                    className="w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex items-center space-x-4">
                        {/* 画像とタイトル */}
                        <div className="flex-shrink-0">
                          <Card
                            src={combination.image}
                            title={combination.title}
                            // 自分の投稿なのでお気に入り機能は無効
                          />
                        </div>

                        {/* 詳細情報とボタン */}
                        <div className="flex-2 flex flex-col justify-between">
                          <div className="mt-4 flex space-x-5">
                            <Link href={`/edit/${combination.id}`}>
                              <button className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors duration-200">
                                <FontAwesomeIcon
                                  icon={faEdit}
                                  className="mr-1"
                                />
                                編集する
                              </button>
                            </Link>
                            <button className="bg-red-400 hover:bg-red-500 text-white py-2 px-4 rounded text-sm font-medium transition-colors duration-200">
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="mr-1"
                              />
                              削除する
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                          : "bg-blue-600 text-white hover:bg-blue-700"
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
                          : "bg-blue-600 text-white hover:bg-blue-700"
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
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
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
