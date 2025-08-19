/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { SrcButton } from "@/components/Button/Button";
import { InputLong } from "@/components/Input/Input";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Word = {
  seachWord: string;
  tags: string;
};

export default function search() {
  const router = useRouter();
  const [word, setWord] = useState<Word>({
    seachWord: "",
    tags: "",
  });

  const handleSearch = () => {
    // 検索条件をクエリパラメータとして検索結果ページに渡す
    const searchParams = new URLSearchParams();
    if (word.seachWord) {
      searchParams.set("searchWord", word.seachWord);
    }
    if (word.tags) {
      searchParams.set("tags", word.tags);
    }

    const queryString = searchParams.toString();
    const url = queryString
      ? `/search/result?${queryString}`
      : "/search/result";

    router.push(url);
  };

  return (
    <div className="flex flex-col">
      <div className="p-5 font-bold bg-white ">
        <InputLong
          placeholder="検索"
          value={word.seachWord}
          onChange={(e) => {
            setWord({ ...word, seachWord: e.target.value });
          }}
        >
          検索
        </InputLong>

        <InputLong
          placeholder="タグ検索"
          value={word.tags}
          onChange={(e) => {
            setWord({ ...word, tags: e.target.value });
          }}
        >
          タグ検索
        </InputLong>
        <div className="flex justify-end">
          <SrcButton color={"bg-[#3B82F6]"} onClick={handleSearch}>
            検索
          </SrcButton>
        </div>
      </div>

      <div className="p-5 text-center text-gray-600">
        検索条件を入力して「検索」ボタンを押してください
      </div>
    </div>
  );
}
