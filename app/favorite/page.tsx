"use client";

import { Button } from "@/components/Button/Button";
import { useFavorites } from "@/hooks/api/useFavorites";
import useAuth from "@/hooks/auth/useAuth";
import { useFetch } from "@/hooks/fetch/useFetch";
import { Combination } from "@/types/combination";
import { signInAnonymously } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const handleGuestLogin = async () => {
    try {
      const { getAuth } = await import("firebase/auth");
      const auth = getAuth();
      const result = await signInAnonymously(auth);
      console.log("ゲストログイン成功:", result);
      alert("ゲストユーザーとしてログインしました");
      router.push("/home");
    } catch (error) {
      console.error("ゲストログインエラー:", error);
      alert(
        "ゲストログインに失敗しました。しばらくしてから再度お試しください。"
      );
    }
  };

  if (!loginUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="text-blue-500 text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            ログインが必要です
          </h1>
          <p className="mb-8 text-gray-600 leading-relaxed text-center max-w-sm mx-auto">
            お気に入り機能をご利用いただくには
            <br />
            ログインまたは新規登録が必要です
          </p>
          <div className="space-y-6">
            <Link href="/login">
              <Button color="bg-blue-500 hover:bg-blue-600">ログイン</Button>
            </Link>

            {/* 区切り線 */}
            <div className="flex items-center justify-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 text-sm text-gray-500 bg-white">
                または
              </span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <button
              onClick={handleGuestLogin}
              className="w-full px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer border border-slate-500 hover:border-slate-400 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center">
                <span>ゲストユーザーでログイン</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
            </button>

            <Link href="/newprofile">
              <Button color="bg-gray-500 hover:bg-gray-600">新規登録</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || favoritesLoading) return <div>ローディング中</div>;

  // 新しいAPIレスポンス形式に対応
  const combinations = data?.combinations || [];
  const favoriteItems = combinations
    .filter((item) => isFavorite(item.id))
    .slice(0, 10);

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
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:bg-gray-50 hover:shadow-md transition duration-200 cursor-pointer"
                  onClick={() =>
                    (window.location.href = `/item/${combination.id}`)
                  }
                >
                  <div className="flex items-start gap-5">
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
                    <div className="flex-1 min-w-0 pl-1">
                      <h3 className="text-[17px] sm:text-lg font-semibold text-gray-900 leading-snug mb-1 truncate">
                        {combination.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-2 line-clamp-2">
                        {combination.description || "説明がありません"}
                      </p>

                      {/* ボタン群 */}
                      <div className="flex gap-2 pt-1">
                        {loginUser &&
                        !(
                          combination.firebase_uid === loginUser.uid ||
                          String(combination.user_id) === String(loginUser.uid)
                        ) ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(
                                combination.id,
                                combination.user_id,
                                combination.firebase_uid
                              );
                            }}
                            className={`py-2 px-3 rounded text-sm font-medium transition-colors duration-200 cursor-pointer ${
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
                <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 cursor-pointer">
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
