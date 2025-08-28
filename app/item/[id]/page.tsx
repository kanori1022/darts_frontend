"use client";

import LabelValueRow from "@/components/LabelValueRow/LabelValueRow";
import { useFavorites } from "@/hooks/api/useFavorites";
import useAuth from "@/hooks/auth/useAuth";
import { useFetch } from "@/hooks/fetch/useFetch";
import { Combination } from "@/types/combination";
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

  if (isLoading) return <div>読み込み中…</div>;
  if (error) return <div>エラーが発生しました: {error.message}</div>;
  if (!data) return <div>データがありません</div>;
  return (
    <div>
      {/* <div className="p-3 font-bold bg-white">localhost:3000/Item/{id}</div> */}

      {data && (
        <div className="p-6 bg-white rounded shadow">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold">{data.title}</h1>
            {loginUser && data.user_id !== loginUser.uid && (
              <button
                onClick={() =>
                  toggleFavorite(data.id, data.user_id, data.firebase_uid)
                }
                className={`py-2 px-4 rounded text-sm font-medium transition-colors duration-200 ${
                  isFavorite(data.id)
                    ? "bg-pink-500 hover:bg-pink-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                {isFavorite(data.id) ? "♥ お気に入り解除" : "♡ お気に入り追加"}
              </button>
            )}
            {loginUser && data.user_id === loginUser.uid && (
              <span className="py-2 px-4 rounded text-sm font-medium bg-gray-100 text-gray-500 cursor-not-allowed">
                自分の投稿
              </span>
            )}
          </div>
          <div className="w-auto pl-25 py-3">
            <img
              src={data.image}
              alt={data.title}
              className="w-64 h-auto rounded shadow-sm border"
            />
          </div>
          {/* <div>ID: {data.id}</div> */}
          <div className="text-gray-600 font-semibold space-y-4">
            <LabelValueRow label="フライト:" value={data.flight} />
            <LabelValueRow label="シャフト:" value={data.shaft} />
            <LabelValueRow label="バレル:" value={data.barrel} />
            <LabelValueRow label="チップ:" value={data.tip} />
            <LabelValueRow label="説明:" value={data.description} />
          </div>
        </div>
      )}
    </div>
  );
}

// https://firebase.google.com/docs/auth/web/start?hl=ja&_gl=1*187nh6y*_up*MQ..*_ga*MTYxOTA3OTYzLjE3NTA0OTY2MzE.*_ga_CW55HF8NVT*czE3NTA0OTY2MzEkajYwJGwwJGgw

// https://github.com/fuku01/konbini-recipe-front/blob/main/src/hooks/auth/useAuth.ts
