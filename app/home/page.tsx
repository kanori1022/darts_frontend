"use client";

import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import useAuth from "@/hooks/auth/useAuth";
import { useFetch } from "@/hooks/fetch/useFetch";
import { Combination } from "@/types/combination";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const { data, isLoading } = useFetch<Combination[]>("/combinations");
  const { loginUser } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);

  // --- LocalStorage からお気に入りを読み込む ---
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // --- favorites が変わるたびに LocalStorage に保存 ---
  useEffect(() => {
    // 空配列でも保存して最新状態を保持
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    if (!loginUser) return;

    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  if (isLoading) {
    return <div>ローディング中</div>;
  }

  return (
    <div>
      <div className="p-3 font-bold bg-white">人気ランキング</div>
      <div className="flex overflow-scroll gap-3 pt-3 mx-3">
        {data?.map((combination) => (
          <div key={combination.id} className="flex flex-col items-center">
            <Card
              src={combination.image}
              title={combination.title}
              isFavorite={favorites.includes(combination.id)}
              onToggleFavorite={() => toggleFavorite(combination.id)}
            />
            <Link href={"/item/" + combination.id}>
              <p className="text-blue-500 text-sm text-center mt-1 underline cursor-pointer">
                詳細を見る
              </p>
            </Link>
          </div>
        ))}
      </div>

      <div>
        <div className="p-3 mt-3 font-bold bg-white">新着一覧</div>
        <div className="flex overflow-scroll gap-3 pt-3 mx-3 items-end">
          {data?.map((combination) => (
            <div key={combination.id} className="flex flex-col items-center">
              <Card
                src={combination.image}
                title={combination.title}
                isFavorite={favorites.includes(combination.id)}
                onToggleFavorite={() => toggleFavorite(combination.id)}
              />
              <Link href={"/item/" + combination.id}>
                <p className="text-blue-500 text-sm text-center mt-1 underline cursor-pointer">
                  詳細を見る
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ログイン前に表示させる画面 */}
      {!loginUser && (
        <div className="pt-5 pl-10 pr-10 text-center rounded-sm w-full bg-white placeholder-[#000000]">
          その他の機能を利用するには新規登録をしてください。
          <Link href="/login">
            <Button color="bg-[#3B82F6]">新規登録はコチラ</Button>
          </Link>
          <div className="text-center pt-3 pb-3">
            ※登録済みの方はメニューよりログインをしてください。
          </div>
        </div>
      )}

      {/* ログイン後に表示させる画面 */}
      {loginUser && (
        <div className="p-3 mt-3 bg-white text-center">
          <p className="font-bold">ログインありがとうございます！</p>
          <p>限定コンテンツが利用可能になりました。</p>
        </div>
      )}
    </div>
  );
}
