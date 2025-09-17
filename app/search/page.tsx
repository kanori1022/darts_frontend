/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { InputLong } from "@/components/Input/Input";
import {
  faChevronDown,
  faChevronUp,
  faSearch,
  faTags,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Word = {
  searchWord: string;
  tags: string;
  username: string;
};

export default function search() {
  const router = useRouter();
  const [word, setWord] = useState<Word>({
    searchWord: "",
    tags: "",
    username: "",
  });
  const [showHints, setShowHints] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);

    // 検索条件をクエリパラメータとして検索結果ページに渡す
    const searchParams = new URLSearchParams();
    if (word.searchWord) {
      searchParams.set("searchWord", word.searchWord);
    }
    if (word.tags) {
      searchParams.set("tags", word.tags);
    }
    if (word.username) {
      searchParams.set("username", word.username);
    }

    const queryString = searchParams.toString();
    const url = queryString
      ? `/search/result?${queryString}`
      : "/search/result";

    // 少し遅延を入れてローディング状態を表示
    setTimeout(() => {
      router.push(url);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 py-4 px-6 mb-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-800">検索</h1>
        </div>
      </div>

      {/* Search Form Section */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-2xl shadow-xl border border-blue-200 p-8 relative overflow-hidden">
          {/* 装飾的な背景要素 */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-100 to-transparent rounded-full translate-y-12 -translate-x-12 opacity-50"></div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="text-white text-2xl"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                検索条件を入力
              </h2>
              <p className="text-gray-600">
                キーワード、タグ、ユーザー名で詳細検索ができます
              </p>
            </div>

            {/* 検索ワード入力 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="mr-2 text-blue-600"
                />
                キーワード検索
              </label>
              <InputLong
                placeholder="タイトル、説明、パーツ名などで検索"
                value={word.searchWord}
                onChange={(e) => {
                  setWord({ ...word, searchWord: e.target.value });
                }}
              >
                検索キーワード
              </InputLong>
            </div>

            {/* タグ検索入力 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FontAwesomeIcon
                  icon={faTags}
                  className="mr-2 text-green-600"
                />
                タグ検索
              </label>
              <InputLong
                placeholder="タグで絞り込み検索（任意）"
                value={word.tags}
                onChange={(e) => {
                  setWord({ ...word, tags: e.target.value });
                }}
              >
                タグ
              </InputLong>
            </div>

            {/* ユーザー名検索入力 */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FontAwesomeIcon
                  icon={faUser}
                  className="mr-2 text-purple-600"
                />
                ユーザー名検索
              </label>
              <InputLong
                placeholder="投稿者のユーザー名で検索（任意）"
                value={word.username}
                onChange={(e) => {
                  setWord({ ...word, username: e.target.value });
                }}
              >
                ユーザー名
              </InputLong>
            </div>

            {/* 検索ボタン */}
            <div className="flex justify-center mt-8">
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className={`group relative px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-300 transform ${
                  isSearching
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 hover:shadow-2xl hover:scale-105 cursor-pointer"
                } shadow-lg`}
              >
                <div className="flex items-center space-x-3">
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>検索中...</span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon
                        icon={faSearch}
                        className="text-lg group-hover:scale-110 transition-transform duration-300"
                      />
                      <span>検索を実行</span>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* 検索のヒント（プルダウン） */}
        <div className="mt-8 bg-white border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setShowHints(!showHints)}
            className="w-full px-6 py-4 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center justify-between text-left cursor-pointer"
          >
            <h3 className="text-lg font-semibold text-blue-800">
              💡 検索のヒント
            </h3>
            <FontAwesomeIcon
              icon={showHints ? faChevronUp : faChevronDown}
              className="text-blue-600 text-sm"
            />
          </button>

          {showHints && (
            <div className="px-6 py-4 border-t border-gray-200 bg-white">
              <div className="space-y-3 text-sm text-gray-700">
                <p>
                  • <strong>キーワード検索</strong>
                  ：タイトル、説明文、パーツ名で検索できます
                </p>
                <p>
                  • <strong>タグ検索</strong>
                  ：特定の特徴や用途で絞り込みができます
                </p>
                <p>
                  • <strong>ユーザー名検索</strong>
                  ：特定のユーザーの投稿を検索できます
                </p>
                <p>
                  • <strong>例</strong>：「初心者」「初心者向け」「安定性」など
                </p>
                <p>
                  • <strong>組み合わせ検索</strong>
                  ：複数の条件を組み合わせて、より詳細に絞り込めます
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 人気の検索キーワード */}
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            🔥 人気の検索キーワード
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              "初心者向け",
              "安定性重視",
              "軽量",
              "重心バランス",
              "プロ仕様",
              "カスタム",
            ].map((keyword) => (
              <button
                key={keyword}
                onClick={() => setWord({ ...word, searchWord: keyword })}
                className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors cursor-pointer"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
