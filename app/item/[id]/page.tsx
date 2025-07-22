"use client";

import LabelValueRow from "@/components/LabelValueRow/LabelValueRow";
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

  if (isLoading) return <div>読み込み中…</div>;
  if (error) return <div>エラーが発生しました: {error.message}</div>;
  if (!data) return <div>データがありません</div>;
  return (
    <div>
      {/* <div className="p-3 font-bold bg-white">localhost:3000/Item/{id}</div> */}

      {data && (
        <div className="p-6 bg-white rounded shadow">
          <div>Title: {data.title}</div>
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

// https://firebase.google.com/docs/auth/web/start?hl=ja&_gl=1*187nh6y*_up*MQ..*_ga*MTYxOTA3OTYzLjE3NTA0OTY2MzE.*_ga_CW55HF8NVT*czE3NTA0OTY2MzEkbzEkZzAkdDE3NTA0OTY2MzEkajYwJGwwJGgw

// https://github.com/fuku01/konbini-recipe-front/blob/main/src/hooks/auth/useAuth.ts
