"use client";

import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import useAuth from "@/hooks/auth/useAuth";
import { useFetch } from "@/hooks/fetch/useFetch";
import { Combination } from "@/types/combination";
import Link from "next/link";

export default function Home() {
  // const { data } = useFetch("/combinations");
  const { data, isLoading } = useFetch<Combination[]>("/combinations");
  const { loginUser } = useAuth();

  if (isLoading) {
    return <div>ローディング中</div>;
  }

  return (
    <div>
      <div className="p-3 font-bold bg-white">人気ランキング</div>
      <div className="flex overflow-scroll gap-3 pt-3 mx-3">
        {data?.map((combination, index) => (
          <Link href={"/item/" + combination.id} key={index}>
            <Card src={combination.image} title={combination.title} />
          </Link>
        ))}
      </div>

      <div className="pb-3">
        <div className="p-3 mt-3 font-bold  bg-white">新着一覧</div>
        <div className="flex overflow-scroll gap-3 pt-3 mx-3">
          {data?.map((combination, index) => (
            <Card
              src={combination.image}
              title={combination.title}
              key={index}
            />
          ))}
        </div>
      </div>

      {/* ログイン前に表示させる画面 */}
      {/* <div className="flame p-3  bg-white"> */}
      {!loginUser && (
        <div className="pt-5 pl-10 pr-10 text-center rounded-sm w-full bg-white placeholder-[#000000]">
          その他の機能を利用するには新規登録をしてください。
          {/* <div> */}
          <Link href="/login">
            <Button color="bg-[#3B82F6]">新規登録はコチラ</Button>
          </Link>
          {/* </div> */}
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
          {/* ここに追加機能をどんどん追加可能 */}
        </div>
      )}
    </div>
  );
}
