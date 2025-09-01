/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { SrcButton } from "@/components/Button/Button";
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

  const handleSearch = () => {
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

    router.push(url);
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            検索条件を入力
          </h2>

          {/* 検索ワード入力 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faSearch} className="mr-2 text-blue-600" />
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
              <FontAwesomeIcon icon={faTags} className="mr-2 text-green-600" />
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
              <FontAwesomeIcon icon={faUser} className="mr-2 text-purple-600" />
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
          <div className="flex justify-center">
            <SrcButton
              color={"bg-blue-600 hover:bg-blue-700"}
              onClick={handleSearch}
            >
              <FontAwesomeIcon icon={faSearch} className="mr-2" />
              検索を実行
            </SrcButton>
          </div>
        </div>

        {/* 検索のヒント（プルダウン） */}
        <div className="mt-8 bg-white border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setShowHints(!showHints)}
            className="w-full px-6 py-4 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center justify-between text-left"
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
