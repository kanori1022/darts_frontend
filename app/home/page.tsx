"use client";

import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { useFavorites } from "@/hooks/api/useFavorites";
import useAuth from "@/hooks/auth/useAuth";
import { useFetch } from "@/hooks/fetch/useFetch";
import { Combination } from "@/types/combination";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

export default function Home() {
  const { data: popularData, isLoading: popularLoading } =
    useFetch<CombinationsResponse>("/combinations?limit=10&offset=0");
  const { data: newestData, isLoading: newestLoading } =
    useFetch<CombinationsResponse>("/combinations/newest?limit=15&offset=0");
  const { loginUser, isWaiting } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleToggleFavorite = async (id: string) => {
    if (!loginUser) {
      alert("お気に入り機能を使用するにはログインが必要です");
      return;
    }
    await toggleFavorite(id);
  };

  if (popularLoading || newestLoading || isWaiting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600 font-medium">
          ローディング中...
        </span>
      </div>
    );
  }

  // デバッグ情報（開発時のみ）
  console.log("Popular data:", popularData);
  console.log("Newest data:", newestData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Popular Rankings Section */}
      <section className="mb-6 px-4 pt-6 relative z-0">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-red-500 rounded-full"></div>
            <h2 className="text-xl font-bold text-gray-800">人気ランキング</h2>
            <div className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded">
              HOT
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="flex gap-3 min-w-max">
              {popularData?.combinations &&
              popularData.combinations.length > 0 ? (
                popularData.combinations.map((combination, index) => {
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
                  const crownStyle = getCrownStyle(index + 1);

                  return (
                    <div
                      key={combination.id}
                      className="flex-shrink-0 w-52 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 overflow-hidden relative"
                    >
                      {/* 王冠ランキング（3位まで） */}
                      {index < 3 && (
                        <div
                          className={`absolute -top-1 left-0 w-10 h-10 ${crownStyle.bgColor} rounded-full flex items-center justify-center shadow-xl border-2 border-white z-10`}
                        >
                          <div className="relative flex items-center justify-center">
                            <FontAwesomeIcon
                              icon={faCrown}
                              className={`text-lg ${crownStyle.color}`}
                            />
                            <span
                              className="absolute text-xs font-bold text-gray-900 drop-shadow-sm"
                              style={{
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                              }}
                            >
                              {index + 1}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="p-3 pt-4 flex flex-col items-center">
                        <Card
                          src={combination.image}
                          title={combination.title}
                          isFavorite={isFavorite(combination.id)}
                          onToggleFavorite={() =>
                            handleToggleFavorite(combination.id)
                          }
                        />

                        <Link href={"/item/" + combination.id}>
                          <button className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded text-sm font-medium transition-colors duration-200 border border-blue-600 hover:border-blue-700">
                            詳細を見る
                          </button>
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>人気ランキングのデータが読み込まれていません</p>
                  <p className="text-sm">
                    データ: {JSON.stringify(popularData)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="mb-8 px-4 relative z-0">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-green-500 rounded-full"></div>
            <h2 className="text-xl font-bold text-gray-800">新着一覧</h2>
            <div className="px-2 py-1 bg-green-100 text-green-600 text-xs font-medium rounded">
              NEW
            </div>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="flex gap-3 min-w-max">
              {newestData?.combinations &&
              newestData.combinations.length > 0 ? (
                newestData.combinations.map((combination) => (
                  <div
                    key={combination.id}
                    className="flex-shrink-0 w-52 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 overflow-hidden relative z-0"
                  >
                    <div className="p-3 flex flex-col items-center">
                      <Card
                        src={combination.image}
                        title={combination.title}
                        isFavorite={isFavorite(combination.id)}
                        onToggleFavorite={() =>
                          handleToggleFavorite(combination.id)
                        }
                      />

                      <Link href={"/item/" + combination.id}>
                        <button className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded text-sm font-medium transition-colors duration-200 border border-green-600 hover:border-green-700">
                          詳細を見る
                        </button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>新着データが読み込まれていません</p>
                  <p className="text-sm">
                    データ: {JSON.stringify(newestData)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Sections */}
      <div className="px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* ログイン前に表示させる画面 */}
          {!loginUser && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl p-8 text-center border border-blue-200 shadow-lg">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  より多くの機能をご利用ください
                </h3>
                <p className="text-gray-600 mb-6">
                  新規登録をして限定コンテンツやパーソナライズ機能をお楽しみください
                </p>
                <Link href="/login">
                  <Button color="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg">
                    新規登録はコチラ
                  </Button>
                </Link>
                <p className="text-sm text-gray-500 mt-4">
                  ※登録済みの方はメニューよりログインをしてください
                </p>
              </div>
            </div>
          )}

          {/* ログイン後に表示させる画面 */}
          {loginUser && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl p-8 text-center border border-green-200 shadow-lg">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  ログインありがとうございます！
                </h3>
                <p className="text-gray-600">
                  限定コンテンツやパーソナライズ機能が利用可能になりました
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
