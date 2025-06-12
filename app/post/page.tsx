"use client";

import { Button } from "@/components/Button/Button";
import { InputLong, InputShort } from "@/components/Input/Input";
import { useState } from "react";

type Combination = {
  title: string;
  flight: string;
  shaft: string;
  barrel: string;
  tip: string;
  description: string;
};
export default function Post() {
  const [combination, setCombination] = useState<Combination>({
    title: "",
    flight: "",
    shaft: "",
    barrel: "",
    tip: "",
    description: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // useEffect(() => {
  //   const hasEmptyField = Object.values(combination).some(
  //     (value) => value.trim() === ""
  //   );

  //   if (hasEmptyField) {
  //     alert("全ての値の入力が完了していません！");
  //   }
  // }, [combination]);

  return (
    <div>
      <div>
        <div className="pl-10 pr-10 pt-10 pb-10 bg-white mb-10">
          <div>
            <InputLong
              placeholder="タイトル"
              onChange={(e) => {
                setCombination({ ...combination, title: e.target.value });
              }}
            >
              タイトル
            </InputLong>
          </div>
        </div>
        {/* ここにファイルインポートの処理 */}
        <div className="pb-10">
          {/* ラベルクリックでファイル選択が開く */}
          <label
            htmlFor="imageUpload"
            className="block text-center font-medium text-[#000000] mb-4 cursor-pointer hover:underline"
          >
            画像アップロード
          </label>

          {/* 非表示のファイル入力 */}
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImage(file);
                setPreviewUrl(URL.createObjectURL(file));
              }
            }}
            className="hidden"
          />

          {/* プレビュー */}
          {previewUrl && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">プレビュー:</p>
              <img
                src={previewUrl}
                alt="選択された画像"
                className="w-48 h-auto mx-auto rounded-md shadow"
              />
            </div>
          )}
        </div>
        <div className="pl-10 pr-10 pt-10 pb-10 bg-white">
          <div>
            <InputShort
              placeholder="フライト"
              onChange={(e) => {
                setCombination({ ...combination, flight: e.target.value });
              }}
            >
              フライト
            </InputShort>
            <InputShort
              placeholder="シャフト"
              onChange={(e) => {
                setCombination({ ...combination, shaft: e.target.value });
              }}
            >
              シャフト
            </InputShort>

            <InputShort
              placeholder="バレル"
              onChange={(e) => {
                setCombination({ ...combination, barrel: e.target.value });
              }}
            >
              バレル
            </InputShort>
            <InputShort
              placeholder="チップ"
              onChange={(e) => {
                setCombination({ ...combination, tip: e.target.value });
              }}
            >
              チップ
            </InputShort>
          </div>

          <p className="text-left pt-10">説明</p>
          <textarea
            className="border-2 rounded-sm w-full pb-70 placeholder-[#A39C9C] border-[#E0E0E0]"
            placeholder="例：バレルの重心を感じやすく、初心者におすすめな組み合わせになっている。"
            onChange={(e) => {
              setCombination({ ...combination, description: e.target.value });
            }}
          ></textarea>
          <InputLong placeholder="タグ">タグ</InputLong>
          <Button
            color="bg-[#3B82F6]"
            onClick={() => {
              const hasEmptyField = Object.values(combination).some(
                (value) => value.trim() === ""
              );

              if (hasEmptyField) {
                alert("全ての値の入力が完了していません！");
              }
              console.log("押したよ");
            }}
          >
            投稿
          </Button>

          <Button color="bg-[#BEBEBE]">キャンセル</Button>
        </div>
        <div className="bg-neutral-100"></div>
      </div>
    </div>
  );
}
