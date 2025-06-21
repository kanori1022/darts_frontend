"use client";

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
  console.log("params.idはーーーーーーーーーーー", id);

  if (isLoading) return <div>読み込み中…</div>;
  if (error) return <div>エラーが発生しました: {error.message}</div>;
  if (!data) return <div>データがありません</div>;
  return (
    <div>
      <div className="p-3 font-bold bg-white">IDは{id}です！</div>
      <div className="p-3 font-bold bg-white">localhost:3000/item/{id}</div>

      {data && (
        <div className="p-3 bg-white">
          <div>ID: {data.id}</div>
          <div>Title: {data.title}</div>
          <div>Flight: {data.flight}</div>
          <div>Shaft: {data.shaft}</div>
          <div>Barrel: {data.barrel}</div>
          <div>Tip: {data.tip}</div>
          <div>Description: {data.description}</div>
        </div>
      )}
    </div>
  );
}
// http://localhost:3000/item/2
