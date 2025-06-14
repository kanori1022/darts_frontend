"use client";

import { Button } from "@/components/Button/Button";
import { InputLong, InputShort } from "@/components/Input/Input";
import { useCreateCombination } from "@/hooks/api/useCreateCombination";
import { CombinationParms } from "@/types/combination";
import { faFolderPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";

// https://flowbite.com/docs/components/forms/

export default function Post() {
  const [combination, setCombination] = useState<CombinationParms>({
    title: "",
    image: null,
    flight: "",
    shaft: "",
    barrel: "",
    tip: "",
    description: "",
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { createCombination } = useCreateCombination();
  const inputRef = useRef<HTMLInputElement>(null);
  // useEffect(() => {
  //   const hasEmptyField = Object.values(combination).some(
  //     (value) => value.trim() === ""
  //   );

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
        <div className=" w-32 h-auto mx-auto">
          {/* プレビュー画像（重ねる） */}
          {previewUrl && (
            <img
              src={previewUrl}
              alt="選択された画像"
              className=" top-0 left-0 w-full h-full object-cover rounded-md cursor-pointer shadow-lg"
              onClick={() => {
                inputRef.current?.click();
              }}
            />
          )}

          {/* アップロード用ラベルとアイコン（下に表示） */}
          {!previewUrl && (
            <label
              htmlFor="imageUpload"
              className=" top-0 left-0 w-full h-full flex items-center justify-center cursor-pointer hover:opacity-70"
            >
              <FontAwesomeIcon
                icon={faFolderPlus}
                size="4x"
                className="text-gray-400"
              />
            </label>
          )}
          {/* 非表示のファイル入力 */}
          <input
            id="imageUpload"
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setCombination({ ...combination, image: file });
                setPreviewUrl(URL.createObjectURL(file));
              }
            }}
            className="hidden"
          />
        </div>

        <div className="text-center mt-2 mb-4 text-sm text-gray-600">
          画像を選択
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
                (value) => !value
              );

              if (hasEmptyField) {
                alert("値の入力または画像の選択が完了していません！");
              }
              console.log("押したよ");
              createCombination({ combination: combination });
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
