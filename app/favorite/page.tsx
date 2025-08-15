"use client";

import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { useFavorites } from "@/hooks/api/useFavorites";
import useAuth from "@/hooks/auth/useAuth";
import { useFetch } from "@/hooks/fetch/useFetch";
import { Combination } from "@/types/combination";
import Link from "next/link";

export default function Favorite() {
  const { loginUser } = useAuth();
  const {
    toggleFavorite,
    isFavorite,
    isLoading: favoritesLoading,
  } = useFavorites();
  const { data, isLoading } = useFetch<Combination[]>("/combinations");

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

  const favoriteItems = data?.filter((item) => isFavorite(item.id)) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-pink-500 via-pink-600 to-pink-700 text-white py-8 px-6 mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-100">
            あなたのお気に入り
          </h1>
          <p className="text-pink-100 text-lg">
            お気に入りのダーツコンビネーション一覧
          </p>
        </div>
      </div>

      {/* Favorites Section */}
      <section className="mb-8 px-4">
        <div className="max-w-6xl mx-auto">
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
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-3 min-w-max">
                {favoriteItems.map((combination) => (
                  <div
                    key={combination.id}
                    className="flex-shrink-0 w-52 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 overflow-hidden"
                  >
                    <div className="p-3">
                      <Card
                        src={combination.image}
                        title={combination.title}
                        isFavorite={isFavorite(combination.id)}
                        onToggleFavorite={() => toggleFavorite(combination.id)}
                      />

                      <Link href={"/item/" + combination.id}>
                        <button className="mt-3 w-full bg-pink-500 hover:bg-pink-600 text-white py-2 px-3 rounded text-sm font-medium transition-colors duration-200">
                          詳細を見る
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
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
      </section>
    </div>
  );
}
