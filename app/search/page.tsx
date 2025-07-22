/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { SrcButton } from "@/components/Button/Button";
import { SrcCard } from "@/components/Card/Card";
import { InputLong } from "@/components/Input/Input";
import { useFetch } from "@/hooks/fetch/useFetch";
import { Combination } from "@/types/combination";
import { useState } from "react";

type Word = {
  seachWord: string;
  tags: string;
};
export default function search() {
  const { data } = useFetch<Combination[]>("/combinations");
  // const array = [
  //   { src: "sampl1.png", title: "サンプル1" },
  //   { src: "sampl2.jpg", title: "サンプル2" },
  //   { src: "sampl3.jpg", title: "サンプル3" },
  //   { src: "sampl4.jpg", title: "サンプル4" },
  //   { src: "sampl5.jpg", title: "サンプル5" },
  //   { src: "sampl6.jpeg", title: "サンプル6" },
  //   { src: "sampl7.jpeg", title: "サンプル7" },
  //   { src: "sampl8.jpg", title: "サンプル8" },
  //   { src: "sampl9.jpg", title: "サンプル9" },
  //   { src: "sampl10.jpg", title: "サンプル10" },
  // ];
  const [word, setWord] = useState<Word>({
    seachWord: "",
    tags: "",
  });

  return (
    <div className="flex flex-col">
      <div className="p-5 font-bold bg-white ">
        <InputLong
          placeholder="検索"
          onChange={(e) => {
            setWord({ ...word, seachWord: e.target.value });
          }}
        >
          検索
        </InputLong>

        <InputLong
          placeholder="タグ検索"
          onChange={(e) => {
            setWord({ ...word, tags: e.target.value });
          }}
        >
          タグ検索
        </InputLong>
        <div className="flex justify-end">
          <SrcButton color={"bg-[#3B82F6]"}>ok</SrcButton>
        </div>
      </div>

      <div className="flex-1 overflow-y-scroll overflow-x-hidden p-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-3 pb-3 mx-1">
          {data?.map((image, index) => (
            <SrcCard src={image.image} title={image.title} key={index} />
          ))}
        </div>
      </div>
      <div className="p-3 font-bold">前のページ 1/3 次のページ</div>
    </div>
  );
}
