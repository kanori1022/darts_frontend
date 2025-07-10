"use client";

import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { useFavorite } from "@/context/FavoriteContext";
import useAuth from "@/hooks/auth/useAuth";
import { useFetch } from "@/hooks/fetch/useFetch";
import { Combination } from "@/types/combination";
import Link from "next/link";

export default function Favorite() {
  const { loginUser } = useAuth();
  const { favorites, toggleFavorite } = useFavorite(); // ← 追加
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

  if (isLoading) return <div>ローディング中</div>;

  const favoriteItems =
    data?.filter((item) => favorites.includes(item.id)) || [];

  return (
    <div>
      <div className="p-3 font-bold bg-white">お気に入り</div>
      <div className="flex overflow-scroll gap-3 pt-3 mx-3 items-start">
        {favoriteItems.length > 0 ? (
          favoriteItems.map((combination) => (
            <div key={combination.id} className="flex flex-col items-center">
              <Card
                src={combination.image}
                title={combination.title}
                isFavorite={true}
                onToggleFavorite={() => toggleFavorite(combination.id)}
              />
              <Link href={"/item/" + combination.id}>
                <p className="text-blue-500 text-sm mt-1 underline cursor-pointer text-center">
                  詳細を見る
                </p>
              </Link>
            </div>
          ))
        ) : (
          <p className="p-3">お気に入りはまだありません。</p>
        )}
      </div>
    </div>
  );
}
