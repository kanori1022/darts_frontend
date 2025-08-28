"use client";

import { Button } from "@/components/Button/Button";
import { useFavorites } from "@/hooks/api/useFavorites";
import useAuth from "@/hooks/auth/useAuth";
import { useFetch } from "@/hooks/fetch/useFetch";
import { Combination } from "@/types/combination";
import Link from "next/link";

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

export default function Favorite() {
  const { loginUser } = useAuth();
  const {
    toggleFavorite,
    isFavorite,
    isLoading: favoritesLoading,
  } = useFavorites();
  const { data, isLoading } = useFetch<CombinationsResponse>("/combinations");

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

  if (isLoading || favoritesLoading) return <div>ローディング中</div>;

  // 新しいAPIレスポンス形式に対応
  const combinations = data?.combinations || [];
  const favoriteItems = combinations.filter((item) => isFavorite(item.id));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 py-6 px-6 mb-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-800">お気に入り</h1>
        </div>
      </div>

      {/* Favorites Section */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-pink-500 rounded-full"></div>
            <h2 className="text-xl font-bold text-gray-800">
              お気に入りコンビネーション
            </h2>
            <div className="px-2 py-1 bg-pink-100 text-pink-600 text-xs font-medium rounded">
              ♥ {favoriteItems.length}件
            </div>
          </div>

          {favoriteItems.length > 0 ? (
            <div className="space-y-4">
              {favoriteItems.map((combination) => (
                <div
                  key={combination.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start gap-4">
                    {/* 画像 */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                        {combination.image ? (
                          <img
                            src={combination.image}
                            alt={combination.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-500 text-xs">
                              No Image
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* コンテンツ */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                        {combination.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {combination.description || "説明がありません"}
                      </p>

                      {/* ボタン群 */}
                      <div className="flex gap-2">
                        <Link href={"/item/" + combination.id}>
                          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors duration-200">
                            詳細を見る
                          </button>
                        </Link>
                        {loginUser && combination.user_id !== loginUser.uid ? (
                          <button
                            onClick={() =>
                              toggleFavorite(
                                combination.id,
                                combination.user_id,
                                combination.firebase_uid
                              )
                            }
                            className={`py-2 px-3 rounded text-sm font-medium transition-colors duration-200 ${
                              isFavorite(combination.id)
                                ? "bg-pink-500 hover:bg-pink-600 text-white"
                                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                            }`}
                          >
                            {isFavorite(combination.id)
                              ? "♥ お気に入り解除"
                              : "♡ お気に入り追加"}
                          </button>
                        ) : (
                          <span className="py-2 px-3 rounded text-sm font-medium bg-gray-100 text-gray-500 cursor-not-allowed">
                            自分の投稿
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-pink-500 text-2xl">♥</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                お気に入りはまだありません
              </h3>
              <p className="text-gray-600 mb-6">
                気になるコンビネーションを見つけてお気に入りに追加しましょう
              </p>
              <Link href="/home">
                <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
                  コンビネーションを探す
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
