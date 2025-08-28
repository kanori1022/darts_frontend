"use client";

import LabelValueRow from "@/components/LabelValueRow/LabelValueRow";
import { useFavorites } from "@/hooks/api/useFavorites";
import useAuth from "@/hooks/auth/useAuth";
import { useFetch } from "@/hooks/fetch/useFetch";
import { Combination } from "@/types/combination";
import { faCalendarAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default function Item({ params }: Props) {
  // const { id } = props.params;
  const { id } = use(params);
  const { data, error, isLoading } = useFetch<Combination>(
    "/combinations/" + id
  );
  const { loginUser } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  // 日付フォーマット関数
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            エラーが発生しました
          </h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-gray-400 text-4xl mb-4">📭</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            データが見つかりません
          </h2>
          <p className="text-gray-600">
            投稿が削除されたか、存在しない可能性があります
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Title and Actions */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-800 leading-tight">
                {data.title}
              </h1>
              <div className="flex gap-2">
                {loginUser &&
                  !(
                    data.firebase_uid === loginUser.uid ||
                    String(data.user_id) === String(loginUser.uid)
                  ) && (
                    <button
                      onClick={() =>
                        toggleFavorite(data.id, data.user_id, data.firebase_uid)
                      }
                      className={`py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg ${
                        isFavorite(data.id)
                          ? "bg-pink-500 hover:bg-pink-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      {isFavorite(data.id)
                        ? "♥ お気に入り解除"
                        : "♡ お気に入り追加"}
                    </button>
                  )}
                {loginUser &&
                  (data.firebase_uid === loginUser.uid ||
                    String(data.user_id) === String(loginUser.uid)) && (
                    <div className="flex gap-2">
                      <Link href={`/edit/${data.id}`}>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg">
                          編集する
                        </button>
                      </Link>
                      <span className="py-2 px-4 rounded-lg text-sm font-medium bg-blue-50 text-blue-600 border border-blue-200">
                        自分の投稿
                      </span>
                    </div>
                  )}
              </div>
            </div>

            {/* User and Date Info */}
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="text-blue-500" />
                <span className="font-medium">
                  {data.user_name || "匿名ユーザー"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="text-green-500"
                />
                <span>{formatDate(data.created_at)}</span>
              </div>
              {data.updated_at && data.updated_at !== data.created_at && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span>（更新: {formatDate(data.updated_at)}）</span>
                </div>
              )}
            </div>
          </div>

          {/* Image Section */}
          <div className="p-6 bg-gray-50">
            <div className="flex justify-center">
              <div className="relative group">
                <Image
                  src={data.image}
                  alt={data.title}
                  width={400}
                  height={300}
                  className="max-w-md w-full h-auto rounded-xl shadow-lg border border-gray-200 transition-transform duration-200 group-hover:scale-105"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
            パーツ詳細
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <LabelValueRow label="フライト" value={data.flight} />
              <LabelValueRow label="シャフト" value={data.shaft} />
            </div>
            <div className="space-y-4">
              <LabelValueRow label="バレル" value={data.barrel} />
              <LabelValueRow label="チップ" value={data.tip} />
            </div>
          </div>

          {data.description && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">説明</h3>
              <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                {data.description}
              </p>
            </div>
          )}

          {data.tags && data.tags.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">タグ</h3>
              <div className="flex flex-wrap gap-2">
                {data.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200 transition-colors duration-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// https://firebase.google.com/docs/auth/web/start?hl=ja&_gl=1*187nh6y*_up*MQ..*_ga*MTYxOTA3OTYzLjE3NTA0OTY2MzE.*_ga_CW55HF8NVT*czE3NTA0OTY2MzEkajYwJGwwJGgw

// https://github.com/fuku01/konbini-recipe-front/blob/main/src/hooks/auth/useAuth.ts
