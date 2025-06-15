"use client";

import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { useFetch } from "@/hooks/fetch/useFetch";
import { Combination } from "@/types/combination";
import Link from "next/link";

export default function Home() {
  // const { data } = useFetch("/combinations");
  const { data } = useFetch<Combination[]>("/combinations");

  return (
    <div>
      <div className="p-3 font-bold bg-white">人気ランキング</div>
      <div className="flex overflow-scroll gap-3 pt-3 mx-3">
        {data?.map((image, index) => (
          <Card src={image.image} title={image.title} key={index} />
        ))}
      </div>
      <div className="pb-3">
        <div className="p-3 mt-3 font-bold  bg-white">新着一覧</div>
        <div className="flex overflow-scroll gap-3 pt-3 mx-3">
          {data?.map((image, index) => (
            <Card src={image.image} title={image.title} key={index} />
          ))}
        </div>
      </div>
      {/* <div className="flame p-3  bg-white"> */}
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
    </div>
  );
}
